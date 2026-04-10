<template>
  <section class="rental-shell">
    <header class="rental-header">
      <div class="rental-copy">
        <p class="rental-eyebrow">Fluxo Staff</p>
        <h2>Criar contrato de aluguer</h2>
        <p class="rental-intro">
          Selecione o cliente, a viatura disponível e o período de aluguer. O sistema calcula o valor estimado em tempo real e atualiza o estado da viatura para <strong>Em Aluguer</strong> quando o contrato é confirmado.
        </p>
      </div>

      <div class="rental-stats">
        <article class="rental-stat-card">
          <span>Clientes</span>
          <strong>{{ context.customers.length }}</strong>
        </article>
        <article class="rental-stat-card">
          <span>Viaturas disponiveis</span>
          <strong>{{ filteredVehicles.length }}</strong>
        </article>
        <article class="rental-stat-card">
          <span>Contratos recentes</span>
          <strong>{{ context.recentRentals.length }}</strong>
        </article>
      </div>
    </header>

    <p v-if="banner.message" :class="['rental-banner', `rental-banner-${banner.type}`]">
      {{ banner.message }}
    </p>

    <div class="rental-layout">
      <aside class="rental-sidebar rental-card">
        <div class="rental-card-head">
          <div>
            <span class="rental-card-eyebrow">Clientes</span>
            <h3>{{ customerMode === 'existing' ? 'Selecionar cliente' : 'Novo cliente' }}</h3>
          </div>

          <button class="rental-ghost-button" type="button" @click="toggleCustomerMode">
            {{ customerMode === 'existing' ? 'Criar cliente' : 'Selecionar existente' }}
          </button>
        </div>

        <div v-if="customerMode === 'existing'" class="rental-sidebar-content">
          <label class="rental-field rental-field-inline">
            <span>Pesquisar cliente</span>
            <input v-model.trim="customerSearch" type="search" placeholder="Nome, email ou documento" />
          </label>

          <div class="rental-list">
            <button
              v-for="customer in filteredCustomers"
              :key="customer.id"
              type="button"
              class="rental-list-card"
              :class="{ 'is-selected': selectedCustomerId === customer.id }"
              @click="selectCustomer(customer.id)"
            >
              <strong>{{ customer.firstName }} {{ customer.lastName }}</strong>
              <span>{{ customer.email || 'Sem email' }}</span>
              <small>{{ customer.documentNumber || 'Sem documento' }}</small>
            </button>

            <div v-if="filteredCustomers.length === 0" class="rental-empty">
              Nenhum cliente corresponde ao filtro atual.
            </div>
          </div>
        </div>

        <form v-else class="rental-form rental-new-customer" @submit.prevent>
          <div class="rental-field-grid">
            <label class="rental-field">
              <span>Nome</span>
              <input v-model.trim="newCustomer.firstName" type="text" placeholder="Primeiro nome" />
            </label>
            <label class="rental-field">
              <span>Apelido</span>
              <input v-model.trim="newCustomer.lastName" type="text" placeholder="Ultimo nome" />
            </label>
          </div>

          <label class="rental-field">
            <span>Email</span>
            <input v-model.trim="newCustomer.email" type="email" placeholder="cliente@exemplo.com" />
          </label>

          <div class="rental-field-grid">
            <label class="rental-field">
              <span>Telefone</span>
              <input v-model.trim="newCustomer.phone" type="text" placeholder="+351..." />
            </label>
            <label class="rental-field">
              <span>Documento</span>
              <input v-model.trim="newCustomer.documentNumber" type="text" placeholder="Numero fiscal ou BI" />
            </label>
          </div>

          <p class="rental-note">
            Se o email ou documento já existir, o sistema reutiliza automaticamente o cliente associado.
          </p>
        </form>
      </aside>

      <main class="rental-main">
        <article class="rental-card rental-main-card">
          <div class="rental-card-head">
            <div>
              <span class="rental-card-eyebrow">Contrato</span>
              <h3>Dados principais</h3>
            </div>

            <div class="rental-role-pill">
              {{ sessionUserRole || 'STAFF' }}
            </div>
          </div>

          <form class="rental-form" @submit.prevent="submitContract">
            <div class="rental-summary-strip">
              <article>
                <span>Cliente</span>
                <strong>{{ selectedCustomerLabel }}</strong>
              </article>
              <article>
                <span>Viatura</span>
                <strong>{{ selectedVehicleLabel }}</strong>
              </article>
              <article>
                <span>Dias estimados</span>
                <strong>{{ estimatedDays }}</strong>
              </article>
              <article>
                <span>Valor estimado</span>
                <strong>{{ formatMoney(estimatedAmount) }}</strong>
              </article>
            </div>

            <div class="rental-field-grid rental-field-grid-3">
              <label class="rental-field">
                <span>Estação</span>
                <select v-model.number="form.stationId" @change="handleStationChange">
                  <option :value="0" disabled>Selecionar estação</option>
                  <option
                    v-for="station in context.stations"
                    :key="station.id"
                    :value="station.id"
                  >
                    {{ station.name }}
                  </option>
                </select>
              </label>

              <label class="rental-field rental-field-wide">
                <span>Viatura disponível</span>
                <select v-model.number="form.vehicleId" @change="handleVehicleChange">
                  <option :value="0" disabled>Selecionar viatura</option>
                  <option
                    v-for="vehicle in filteredVehicles"
                    :key="vehicle.id"
                    :value="vehicle.id"
                  >
                    {{ vehicle.plateNumber }} | {{ vehicle.brand }} {{ vehicle.model }}
                  </option>
                </select>
              </label>

              <label class="rental-field">
                <span>Quilometragem inicial</span>
                <input v-model.number="form.pickupOdometerKm" type="number" min="0" />
              </label>
            </div>

            <div class="rental-field-grid rental-field-grid-2">
              <label class="rental-field">
                <span>Data de início</span>
                <input v-model="form.pickupAt" type="datetime-local" @change="syncEstimate" />
              </label>

              <label class="rental-field">
                <span>Data de fim</span>
                <input v-model="form.expectedReturnAt" type="datetime-local" @change="syncEstimate" />
              </label>
            </div>

            <div class="rental-field-grid rental-field-grid-2">
              <label class="rental-field">
                <span>Estado inicial da viatura</span>
                <input v-model.trim="form.vehicleCondition" type="text" placeholder="Ex: Limpo, sem danos, depósito cheio" />
              </label>

              <label class="rental-field">
                <span>Observações</span>
                <input v-model.trim="form.notes" type="text" placeholder="Notas operacionais opcionais" />
              </label>
            </div>

            <div class="rental-actions">
              <button type="button" class="rental-ghost-button" @click="fillDateRange(1)">
                1 dia
              </button>
              <button type="button" class="rental-ghost-button" @click="fillDateRange(2)">
                2 dias
              </button>
              <button type="button" class="rental-ghost-button" @click="fillDateRange(7)">
                7 dias
              </button>

              <button class="rental-submit-button" type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'A criar contrato...' : 'Confirmar criação do contrato' }}
              </button>
            </div>

            <p v-if="createdContract" class="rental-success-note">
              Contrato {{ createdContract.contractNumber }} criado com sucesso para {{ createdContract.customerFullName }}.
            </p>
          </form>
        </article>

        <article class="rental-card rental-vehicle-panel">
          <div class="rental-card-head">
            <div>
              <span class="rental-card-eyebrow">Viaturas</span>
              <h3>Disponibilidade atual</h3>
            </div>
            <input v-model.trim="vehicleSearch" class="rental-inline-search" type="search" placeholder="Filtrar por matrícula ou modelo" />
          </div>

          <div class="rental-vehicle-grid">
            <button
              v-for="vehicle in filteredVehicles"
              :key="`vehicle-${vehicle.id}`"
              type="button"
              class="vehicle-card"
              :class="{ 'is-selected': form.vehicleId === vehicle.id }"
              @click="selectVehicle(vehicle)"
            >
              <div class="vehicle-card-head">
                <strong>{{ vehicle.plateNumber }}</strong>
                <span>{{ formatMoney(vehicle.dailyRate) }}/dia</span>
              </div>

              <p>{{ vehicle.brand }} {{ vehicle.model }}</p>
              <small>{{ vehicle.stationName }}</small>
            </button>
          </div>

          <div v-if="filteredVehicles.length === 0" class="rental-empty">
            Não existem viaturas disponíveis para a estação ou filtro atual.
          </div>
        </article>
      </main>
    </div>

    <section class="rental-card rental-recent-panel">
      <div class="rental-card-head">
        <div>
          <span class="rental-card-eyebrow">Histórico recente</span>
          <h3>Últimos contratos criados</h3>
        </div>
      </div>

      <div class="rental-recent-grid">
        <article v-for="rental in context.recentRentals" :key="rental.contractNumber" class="recent-card">
          <div class="recent-card-head">
            <strong>{{ rental.contractNumber }}</strong>
            <span>{{ formatMoney(rental.estimatedAmount) }}</span>
          </div>
          <p>{{ rental.customerFullName }} · {{ rental.vehiclePlate }}</p>
          <small>{{ rental.stationName }} · {{ formatDate(rental.pickupAt) }}</small>
        </article>

        <div v-if="context.recentRentals.length === 0" class="rental-empty">
          Ainda não existem contratos registados.
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { createRentalContract, fetchRentalContext } from '../../services/rentalsApi'

function formatDateTimeLocal(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const pad = (input) => String(input).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value || 0))
}

export default {
  name: 'RentalContractsView',
  props: {
    sessionToken: {
      type: String,
      required: true,
    },
    sessionUserRole: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      context: {
        customers: [],
        stations: [],
        availableVehicles: [],
        recentRentals: [],
      },
      customerMode: 'existing',
      customerSearch: '',
      vehicleSearch: '',
      selectedCustomerId: 0,
      form: {
        stationId: 0,
        vehicleId: 0,
        pickupAt: '',
        expectedReturnAt: '',
        pickupOdometerKm: null,
        vehicleCondition: '',
        notes: '',
      },
      newCustomer: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        documentNumber: '',
      },
      banner: {
        message: '',
        type: 'info',
      },
      isLoading: false,
      isSubmitting: false,
      createdContract: null,
    }
  },
  computed: {
    filteredCustomers() {
      const term = this.customerSearch.trim().toLowerCase()

      if (!term) {
        return this.context.customers
      }

      return this.context.customers.filter((customer) => {
        const searchableText = [
          customer.firstName,
          customer.lastName,
          customer.email,
          customer.documentNumber,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return searchableText.includes(term)
      })
    },
    filteredVehicles() {
      const term = this.vehicleSearch.trim().toLowerCase()
      const stationId = this.form.stationId

      return this.context.availableVehicles.filter((vehicle) => {
        const matchesStation = !stationId || vehicle.stationId === stationId
        const searchableText = [vehicle.plateNumber, vehicle.brand, vehicle.model]
          .join(' ')
          .toLowerCase()
        const matchesSearch = !term || searchableText.includes(term)

        return matchesStation && matchesSearch
      })
    },
    selectedVehicle() {
      return this.context.availableVehicles.find((vehicle) => vehicle.id === this.form.vehicleId) || null
    },
    selectedCustomer() {
      return this.context.customers.find((customer) => customer.id === this.selectedCustomerId) || null
    },
    selectedCustomerLabel() {
      if (this.customerMode === 'new') {
        const firstName = this.newCustomer.firstName.trim()
        const lastName = this.newCustomer.lastName.trim()
        return firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Novo cliente'
      }

      return this.selectedCustomer ? `${this.selectedCustomer.firstName} ${this.selectedCustomer.lastName}` : 'Cliente por selecionar'
    },
    selectedVehicleLabel() {
      if (!this.selectedVehicle) {
        return 'Viatura por selecionar'
      }

      return `${this.selectedVehicle.plateNumber} · ${this.selectedVehicle.brand} ${this.selectedVehicle.model}`
    },
    estimatedDays() {
      if (!this.form.pickupAt || !this.form.expectedReturnAt) {
        return 1
      }

      const pickupAt = new Date(this.form.pickupAt)
      const expectedReturnAt = new Date(this.form.expectedReturnAt)

      if (Number.isNaN(pickupAt.getTime()) || Number.isNaN(expectedReturnAt.getTime())) {
        return 1
      }

      const difference = expectedReturnAt.getTime() - pickupAt.getTime()
      return Math.max(1, Math.ceil(difference / (1000 * 60 * 60 * 24)))
    },
    estimatedAmount() {
      if (!this.selectedVehicle) {
        return 0
      }

      return Number((this.estimatedDays * this.selectedVehicle.dailyRate).toFixed(2))
    },
  },
  async mounted() {
    await this.loadContext()
  },
  methods: {
    formatDate(value) {
      if (!value) {
        return 'Sem data'
      }

      return new Date(value).toLocaleString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    formatMoney(value) {
      return formatCurrency(value)
    },
    extractApiError(error, fallbackMessage) {
      const details = error?.errors
      if (Array.isArray(details) && details.length > 0) {
        return details.join(' | ')
      }

      return error?.message || fallbackMessage
    },
    async loadContext() {
      this.isLoading = true

      try {
        this.context = await fetchRentalContext(this.sessionToken)
        this.initializeDefaults()
      } catch (error) {
        this.showBanner(
          this.extractApiError(error, 'Nao foi possivel carregar o contexto de contratos.'),
          'error',
        )
      } finally {
        this.isLoading = false
      }
    },
    initializeDefaults() {
      if (!this.form.stationId && this.context.stations.length > 0) {
        this.form.stationId = this.context.stations[0].id
      }

      if (!this.form.pickupAt) {
        this.form.pickupAt = formatDateTimeLocal(new Date())
      }

      if (!this.form.expectedReturnAt) {
        this.form.expectedReturnAt = formatDateTimeLocal(
          new Date(Date.now() + 1000 * 60 * 60 * 24),
        )
      }

      this.syncVehicleSelection()
      this.syncEstimate()
    },
    toggleCustomerMode() {
      this.customerMode = this.customerMode === 'existing' ? 'new' : 'existing'

      if (this.customerMode === 'existing') {
        this.clearNewCustomerForm()
      } else {
        this.selectedCustomerId = 0
      }
    },
    selectCustomer(customerId) {
      this.customerMode = 'existing'
      this.selectedCustomerId = customerId
      this.clearNewCustomerForm()
    },
    selectVehicle(vehicle) {
      this.form.vehicleId = vehicle.id
      this.form.stationId = vehicle.stationId
      this.vehicleSearch = ''
      this.syncEstimate()
    },
    handleStationChange() {
      this.syncVehicleSelection()
      this.syncEstimate()
    },
    handleVehicleChange() {
      this.syncEstimate()
    },
    syncVehicleSelection() {
      const matchingVehicle = this.filteredVehicles.find(
        (vehicle) => vehicle.id === this.form.vehicleId,
      )

      if (!matchingVehicle) {
        this.form.vehicleId = this.filteredVehicles[0]?.id || 0
      }

      if (this.form.vehicleId === 0 && this.filteredVehicles.length > 0) {
        this.form.vehicleId = this.filteredVehicles[0].id
      }
    },
    syncEstimate() {
      if (!this.form.pickupAt) {
        this.form.pickupAt = formatDateTimeLocal(new Date())
      }

      if (!this.form.expectedReturnAt) {
        this.form.expectedReturnAt = formatDateTimeLocal(
          new Date(Date.now() + 1000 * 60 * 60 * 24),
        )
      }
    },
    fillDateRange(days) {
      const start = new Date()
      const end = new Date(start.getTime() + days * 1000 * 60 * 60 * 24)

      this.form.pickupAt = formatDateTimeLocal(start)
      this.form.expectedReturnAt = formatDateTimeLocal(end)
      this.syncEstimate()
    },
    clearNewCustomerForm() {
      this.newCustomer = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        documentNumber: '',
      }
    },
    resetFormAfterSuccess() {
      this.selectedCustomerId = 0
      this.customerSearch = ''
      this.vehicleSearch = ''
      this.form.pickupAt = formatDateTimeLocal(new Date())
      this.form.expectedReturnAt = formatDateTimeLocal(
        new Date(Date.now() + 1000 * 60 * 60 * 24),
      )
      this.form.pickupOdometerKm = null
      this.form.vehicleCondition = ''
      this.form.notes = ''
      this.clearNewCustomerForm()
      this.customerMode = 'existing'
      this.syncVehicleSelection()
    },
    buildCreatePayload() {
      if (this.customerMode === 'existing') {
        return {
          stationId: this.form.stationId,
          vehicleId: this.form.vehicleId,
          pickupAt: new Date(this.form.pickupAt).toISOString(),
          expectedReturnAt: new Date(this.form.expectedReturnAt).toISOString(),
          pickupOdometerKm: this.form.pickupOdometerKm,
          vehicleCondition: this.form.vehicleCondition,
          notes: this.form.notes,
          customerId: this.selectedCustomerId,
        }
      }

      return {
        stationId: this.form.stationId,
        vehicleId: this.form.vehicleId,
        pickupAt: new Date(this.form.pickupAt).toISOString(),
        expectedReturnAt: new Date(this.form.expectedReturnAt).toISOString(),
        pickupOdometerKm: this.form.pickupOdometerKm,
        vehicleCondition: this.form.vehicleCondition,
        notes: this.form.notes,
        customerFirstName: this.newCustomer.firstName,
        customerLastName: this.newCustomer.lastName,
        customerEmail: this.newCustomer.email,
        customerPhone: this.newCustomer.phone,
        customerDocumentNumber: this.newCustomer.documentNumber,
      }
    },
    validateBeforeSubmit() {
      if (this.form.stationId < 1) {
        return 'Selecione uma estação válida.'
      }

      if (this.form.vehicleId < 1) {
        return 'Selecione uma viatura disponível.'
      }

      if (this.customerMode === 'existing' && this.selectedCustomerId < 1) {
        return 'Selecione um cliente existente ou crie um novo cliente.'
      }

      if (this.customerMode === 'new') {
        if (!this.newCustomer.firstName.trim() || !this.newCustomer.lastName.trim()) {
          return 'Preencha o nome e apelido do novo cliente.'
        }
      }

      if (!this.form.pickupAt || !this.form.expectedReturnAt) {
        return 'Defina as datas de início e fim do contrato.'
      }

      if (this.estimatedDays < 1) {
        return 'O período do contrato é inválido.'
      }

      if (this.form.pickupOdometerKm === null || this.form.pickupOdometerKm < 0) {
        return 'A quilometragem inicial é obrigatória.'
      }

      if (!this.form.vehicleCondition.trim()) {
        return 'Registe o estado inicial da viatura.'
      }

      return ''
    },
    async submitContract() {
      const validationError = this.validateBeforeSubmit()
      if (validationError) {
        this.showBanner(validationError, 'error')
        return
      }

      this.isSubmitting = true

      try {
        const response = await createRentalContract(this.buildCreatePayload(), this.sessionToken)
        this.createdContract = response
        this.showBanner(`Contrato ${response.contractNumber} criado com sucesso.`, 'success')
        this.resetFormAfterSuccess()
        await this.loadContext()
      } catch (error) {
        this.showBanner(
          this.extractApiError(error, 'Nao foi possivel criar o contrato.'),
          'error',
        )
      } finally {
        this.isSubmitting = false
      }
    },
    showBanner(message, type) {
      this.banner = { message, type }
    },
  },
}
</script>

<style scoped src="../../styles/components/rental-contracts.css"></style>