<template>
  <section class="rental-shell">
    <header class="rental-header">
      <div class="rental-copy">
        <p class="rental-eyebrow">Fluxo Staff/Admin</p>
        <h2>Criar reserva</h2>
        <p class="rental-intro">
          Selecione um cliente, defina o periodo, escolha a estacao de
          levantamento e confirme uma viatura disponivel. Quando nao existir
          disponibilidade local, o sistema sugere alternativas.
        </p>
      </div>

      <div class="rental-stats">
        <article class="rental-stat-card">
          <span>Clientes</span>
          <strong>{{ context.customers.length }}</strong>
        </article>
        <article class="rental-stat-card">
          <span>Viaturas no periodo</span>
          <strong>{{ filteredAvailableVehicles.length }}</strong>
        </article>
        <article class="rental-stat-card">
          <span>Reservas recentes</span>
          <strong>{{ recentReservations.length }}</strong>
        </article>
      </div>
    </header>

    <p
      v-if="banner.message"
      :class="['rental-banner', `rental-banner-${banner.type}`]"
    >
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
            <input
              v-model.trim="customerSearch"
              type="search"
              placeholder="Nome, email ou documento"
            />
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
              <input
                v-model.trim="newCustomer.firstName"
                type="text"
                placeholder="Primeiro nome"
              />
            </label>

            <label class="rental-field">
              <span>Apelido</span>
              <input
                v-model.trim="newCustomer.lastName"
                type="text"
                placeholder="Ultimo nome"
              />
            </label>
          </div>

          <label class="rental-field">
            <span>Email</span>
            <input
              v-model.trim="newCustomer.email"
              type="email"
              placeholder="cliente@exemplo.com"
            />
          </label>

          <div class="rental-field-grid">
            <label class="rental-field">
              <span>Telefone</span>
              <input
                v-model.trim="newCustomer.phone"
                type="text"
                placeholder="+351..."
              />
            </label>

            <label class="rental-field">
              <span>Documento</span>
              <input
                v-model.trim="newCustomer.documentNumber"
                type="text"
                placeholder="Numero fiscal ou BI"
              />
            </label>
          </div>

          <p class="rental-note">
            Se o cliente ainda nao existir, esta reserva cria o registo antes da
            confirmacao.
          </p>
        </form>
      </aside>

      <main class="rental-main">
        <article class="rental-card rental-main-card">
          <div class="rental-card-head">
            <div>
              <span class="rental-card-eyebrow">Reserva</span>
              <h3>Dados principais</h3>
            </div>

            <div class="rental-role-pill">
              {{ selectedCustomerLabel }}
            </div>
          </div>

          <form class="rental-form" @submit.prevent="submitCreate">
            <div class="rental-summary-strip">
              <article>
                <span>Cliente</span>
                <strong>{{ selectedCustomerLabel }}</strong>
              </article>
              <article>
                <span>Levantamento</span>
                <strong>{{ selectedPickupStationLabel }}</strong>
              </article>
              <article>
                <span>Devolucao</span>
                <strong>{{ selectedReturnStationLabel }}</strong>
              </article>
              <article>
                <span>Viatura</span>
                <strong>{{ selectedVehicleLabel }}</strong>
              </article>
            </div>

            <div class="rental-field-grid rental-field-grid-2">
              <label class="rental-field">
                <span>Estacao de levantamento</span>
                <select
                  v-model.number="form.pickupStationId"
                  @change="handleAvailabilityInputsChanged"
                >
                  <option :value="0" disabled>Selecionar estacao</option>
                  <option
                    v-for="station in context.stations"
                    :key="station.id"
                    :value="station.id"
                  >
                    {{ station.name }}
                  </option>
                </select>
              </label>

              <label class="rental-field">
                <span>Estacao de devolucao</span>
                <select v-model.number="form.returnStationId">
                  <option :value="0" disabled>Selecionar estacao</option>
                  <option
                    v-for="station in context.stations"
                    :key="`return-${station.id}`"
                    :value="station.id"
                  >
                    {{ station.name }}
                  </option>
                </select>
              </label>
            </div>

            <div class="rental-field-grid rental-field-grid-2">
              <label class="rental-field">
                <span>Data de levantamento</span>
                <input
                  v-model="form.pickupAt"
                  type="datetime-local"
                  @change="handleAvailabilityInputsChanged"
                />
              </label>

              <label class="rental-field">
                <span>Data de devolucao</span>
                <input
                  v-model="form.expectedReturnAt"
                  type="datetime-local"
                  @change="handleAvailabilityInputsChanged"
                />
              </label>
            </div>

            <label class="rental-field">
              <span>Observacoes</span>
              <input
                v-model.trim="form.notes"
                type="text"
                placeholder="Notas operacionais opcionais"
              />
            </label>

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

              <button
                class="rental-submit-button"
                type="submit"
                :disabled="isCreating"
              >
                {{ isCreating ? 'A criar reserva...' : 'Confirmar reserva' }}
              </button>
            </div>

            <p v-if="createdReservation" class="rental-success-note">
              Reserva {{ createdReservation.reservationNumber }} criada com
              sucesso para {{ createdReservation.customerFullName }}.
            </p>
          </form>
        </article>

        <article class="rental-card rental-vehicle-panel">
          <div class="rental-card-head">
            <div>
              <span class="rental-card-eyebrow">Disponibilidade</span>
              <h3>Viaturas para o periodo</h3>
            </div>

            <input
              v-model.trim="vehicleSearch"
              class="rental-inline-search"
              type="search"
              placeholder="Filtrar por matricula ou modelo"
            />
          </div>

          <p v-if="isLoadingAvailability" class="rental-note">
            A validar disponibilidade no periodo selecionado...
          </p>

          <div class="rental-vehicle-grid">
            <button
              v-for="vehicle in filteredAvailableVehicles"
              :key="vehicle.id"
              type="button"
              class="vehicle-card"
              :class="{ 'is-selected': form.vehicleId === vehicle.id }"
              @click="selectVehicle(vehicle)"
            >
              <div class="vehicle-card-head">
                <strong>{{ vehicle.plateNumber }}</strong>
                <span>{{ vehicle.stationName }}</span>
              </div>
              <p>{{ vehicle.brand }} {{ vehicle.model }}</p>
              <small>{{ formatMoney(vehicle.dailyRate) }}/dia</small>
            </button>
          </div>

          <p
            v-if="availability.suggestionMessage"
            class="rental-note"
          >
            {{ availability.suggestionMessage }}
          </p>

          <div v-if="filteredAvailableVehicles.length === 0" class="rental-empty">
            Nao existem viaturas disponiveis na estacao selecionada para este periodo.
          </div>

          <div
            v-if="filteredAlternativeVehicles.length > 0"
            class="rental-card-head"
            style="margin-top: 1.5rem;"
          >
            <div>
              <span class="rental-card-eyebrow">Alternativas</span>
              <h3>Outras estacoes</h3>
            </div>
          </div>

          <div class="rental-vehicle-grid">
            <button
              v-for="vehicle in filteredAlternativeVehicles"
              :key="`alt-${vehicle.id}-${vehicle.stationId}`"
              type="button"
              class="vehicle-card"
              @click="selectVehicle(vehicle)"
            >
              <div class="vehicle-card-head">
                <strong>{{ vehicle.plateNumber }}</strong>
                <span>{{ vehicle.stationName }}</span>
              </div>
              <p>{{ vehicle.brand }} {{ vehicle.model }}</p>
              <small>Clique para trocar o levantamento para esta estacao.</small>
            </button>
          </div>
        </article>
      </main>
    </div>

    <section class="rental-card rental-recent-panel">
      <div class="rental-card-head">
        <div>
          <span class="rental-card-eyebrow">Historico recente</span>
          <h3>Ultimas reservas criadas</h3>
        </div>
      </div>

      <div class="rental-recent-grid">
        <article
          v-for="reservation in recentReservations"
          :key="reservation.reservationNumber"
          class="recent-card"
        >
          <div class="recent-card-head">
            <strong>{{ reservation.reservationNumber }}</strong>
            <span>{{ reservation.status }}</span>
          </div>
          <p>{{ reservation.customerFullName }} · {{ reservation.vehiclePlate }}</p>
          <small>
            {{ reservation.stationName }} · {{ formatDate(reservation.pickupAt) }}
          </small>
        </article>

        <div v-if="recentReservations.length === 0" class="rental-empty">
          Ainda nao existem reservas registadas.
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import {
  createReservation,
  fetchReservationAvailability,
  fetchReservationContext,
  fetchReservations,
} from '../../services/reservationsApi'
import {
  buildCreateReservationPayload,
  createReservationCustomerForm,
  createReservationForm,
  isReservationAvailabilityReady,
  validateReservationCreateForm,
} from '../../utils/reservationCreation'
import {
  formatRentalCurrency,
  formatRentalDateTimeLocal,
  formatRentalDisplayDate,
} from '../../utils/rentalFormatting'

export default {
  name: 'ManageReservations',
  props: {
    sessionToken: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      context: {
        customers: [],
        stations: [],
        recentReservations: [],
      },
      reservations: [],
      availability: {
        availableVehicles: [],
        alternativeVehicles: [],
        suggestionMessage: null,
      },
      customerMode: 'existing',
      customerSearch: '',
      vehicleSearch: '',
      selectedCustomerId: 0,
      form: createReservationForm(),
      newCustomer: createReservationCustomerForm(),
      createdReservation: null,
      isLoadingContext: false,
      isLoadingAvailability: false,
      isCreating: false,
      banner: {
        message: '',
        type: 'info',
      },
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
    filteredAvailableVehicles() {
      const term = this.vehicleSearch.trim().toLowerCase()

      return this.availability.availableVehicles.filter((vehicle) => {
        const searchableText = [vehicle.plateNumber, vehicle.brand, vehicle.model]
          .join(' ')
          .toLowerCase()

        return !term || searchableText.includes(term)
      })
    },
    filteredAlternativeVehicles() {
      const term = this.vehicleSearch.trim().toLowerCase()

      return this.availability.alternativeVehicles.filter((vehicle) => {
        const searchableText = [
          vehicle.plateNumber,
          vehicle.brand,
          vehicle.model,
          vehicle.stationName,
        ]
          .join(' ')
          .toLowerCase()

        return !term || searchableText.includes(term)
      })
    },
    selectedCustomer() {
      return (
        this.context.customers.find(
          (customer) => customer.id === this.selectedCustomerId,
        ) || null
      )
    },
    selectedCustomerLabel() {
      if (this.customerMode === 'new') {
        const firstName = this.newCustomer.firstName.trim()
        const lastName = this.newCustomer.lastName.trim()
        return firstName || lastName
          ? `${firstName} ${lastName}`.trim()
          : 'Novo cliente'
      }

      return this.selectedCustomer
        ? `${this.selectedCustomer.firstName} ${this.selectedCustomer.lastName}`
        : 'Cliente por selecionar'
    },
    selectedVehicle() {
      return (
        [...this.availability.availableVehicles, ...this.availability.alternativeVehicles]
          .find((vehicle) => vehicle.id === this.form.vehicleId) || null
      )
    },
    selectedVehicleLabel() {
      if (!this.selectedVehicle) {
        return 'Viatura por selecionar'
      }

      return `${this.selectedVehicle.plateNumber} · ${this.selectedVehicle.brand} ${this.selectedVehicle.model}`
    },
    selectedPickupStationLabel() {
      const station = this.context.stations.find(
        (item) => item.id === this.form.pickupStationId,
      )

      return station ? station.name : 'Levantamento por selecionar'
    },
    selectedReturnStationLabel() {
      const station = this.context.stations.find(
        (item) => item.id === this.form.returnStationId,
      )

      return station ? station.name : 'Devolucao por selecionar'
    },
    recentReservations() {
      return this.reservations.slice(0, 6)
    },
  },
  async mounted() {
    await this.loadContext()
    await this.loadReservations()
    await this.loadAvailability()
  },
  methods: {
    formatDate(value) {
      return formatRentalDisplayDate(value)
    },
    formatMoney(value) {
      return formatRentalCurrency(value)
    },
    showBanner(message, type) {
      this.banner = { message, type }
    },
    extractApiError(error, fallbackMessage) {
      const details = error?.errors

      if (Array.isArray(details) && details.length > 0) {
        return details.join(' | ')
      }

      return error?.message || fallbackMessage
    },
    async loadContext() {
      this.isLoadingContext = true

      try {
        this.context = await fetchReservationContext(this.sessionToken)
        this.initializeDefaults()
      } catch (error) {
        this.showBanner(
          this.extractApiError(
            error,
            'Nao foi possivel carregar o contexto de reservas.',
          ),
          'error',
        )
      } finally {
        this.isLoadingContext = false
      }
    },
    async loadReservations() {
      try {
        this.reservations = await fetchReservations(this.sessionToken)
      } catch (error) {
        this.showBanner(
          this.extractApiError(error, 'Nao foi possivel carregar as reservas.'),
          'error',
        )
      }
    },
    initializeDefaults() {
      if (!this.form.pickupStationId && this.context.stations.length > 0) {
        this.form.pickupStationId = this.context.stations[0].id
      }

      if (!this.form.returnStationId && this.context.stations.length > 0) {
        this.form.returnStationId = this.context.stations[0].id
      }

      if (!this.form.pickupAt) {
        this.form.pickupAt = formatRentalDateTimeLocal(new Date())
      }

      if (!this.form.expectedReturnAt) {
        this.form.expectedReturnAt = formatRentalDateTimeLocal(
          new Date(Date.now() + 1000 * 60 * 60 * 24),
        )
      }
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
    clearNewCustomerForm() {
      this.newCustomer = createReservationCustomerForm()
    },
    fillDateRange(days) {
      const start = new Date()
      const end = new Date(start.getTime() + days * 1000 * 60 * 60 * 24)

      this.form.pickupAt = formatRentalDateTimeLocal(start)
      this.form.expectedReturnAt = formatRentalDateTimeLocal(end)
      this.loadAvailability()
    },
    async handleAvailabilityInputsChanged() {
      if (!this.form.returnStationId) {
        this.form.returnStationId = this.form.pickupStationId
      }

      await this.loadAvailability()
    },
    async selectVehicle(vehicle) {
      if (this.form.pickupStationId !== vehicle.stationId) {
        this.form.pickupStationId = vehicle.stationId
        await this.loadAvailability()
      }

      this.form.vehicleId = vehicle.id
    },
    async loadAvailability() {
      if (!isReservationAvailabilityReady(this.form)) {
        this.availability = {
          availableVehicles: [],
          alternativeVehicles: [],
          suggestionMessage: null,
        }
        this.form.vehicleId = 0
        return
      }

      this.isLoadingAvailability = true

      try {
        this.availability = await fetchReservationAvailability(this.sessionToken, {
          pickupStationId: this.form.pickupStationId,
          pickupAt: new Date(this.form.pickupAt).toISOString(),
          expectedReturnAt: new Date(this.form.expectedReturnAt).toISOString(),
        })

        const stillAvailable = this.availability.availableVehicles.find(
          (vehicle) => vehicle.id === this.form.vehicleId,
        )

        if (!stillAvailable) {
          this.form.vehicleId = this.availability.availableVehicles[0]?.id || 0
        }
      } catch (error) {
        this.availability = {
          availableVehicles: [],
          alternativeVehicles: [],
          suggestionMessage: null,
        }
        this.form.vehicleId = 0
        this.showBanner(
          this.extractApiError(
            error,
            'Nao foi possivel validar a disponibilidade das viaturas.',
          ),
          'error',
        )
      } finally {
        this.isLoadingAvailability = false
      }
    },
    resetFormAfterSuccess() {
      const pickupStationId = this.context.stations[0]?.id || 0

      this.customerMode = 'existing'
      this.selectedCustomerId = 0
      this.customerSearch = ''
      this.vehicleSearch = ''
      this.form = {
        ...createReservationForm(),
        pickupStationId,
        returnStationId: pickupStationId,
        pickupAt: formatRentalDateTimeLocal(new Date()),
        expectedReturnAt: formatRentalDateTimeLocal(
          new Date(Date.now() + 1000 * 60 * 60 * 24),
        ),
      }
      this.clearNewCustomerForm()
    },
    async submitCreate() {
      const validationErrors = validateReservationCreateForm({
        customerMode: this.customerMode,
        selectedCustomerId: this.selectedCustomerId,
        newCustomer: this.newCustomer,
        form: this.form,
      })

      if (Object.keys(validationErrors).length > 0) {
        this.showBanner(Object.values(validationErrors)[0], 'error')
        return
      }

      this.isCreating = true

      try {
        const reservation = await createReservation(
          buildCreateReservationPayload({
            customerMode: this.customerMode,
            selectedCustomerId: this.selectedCustomerId,
            newCustomer: this.newCustomer,
            form: this.form,
          }),
          this.sessionToken,
        )

        this.createdReservation = reservation
        this.showBanner(
          `Reserva ${reservation.reservationNumber} criada com sucesso.`,
          'success',
        )
        this.resetFormAfterSuccess()
        await this.loadContext()
        await this.loadReservations()
        await this.loadAvailability()
      } catch (error) {
        if (error?.code === 'VEHICLE_UNAVAILABLE') {
          this.form.vehicleId = 0
          await this.loadAvailability()
        }

        this.showBanner(
          this.extractApiError(error, 'Nao foi possivel criar a reserva.'),
          'error',
        )
      } finally {
        this.isCreating = false
      }
    },
  },
}
</script>

<style scoped src="../../styles/components/rental-contracts.css"></style>
