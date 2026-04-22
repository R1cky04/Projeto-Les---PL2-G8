<template>
  <section class="rental-shell">
    <header class="rental-header">
      <div class="rental-copy">
        <p class="rental-eyebrow">{{ tr('staffFlow') }}</p>
        <h2>{{ tr('createRentalContract') }}</h2>
        <p class="rental-intro">
          {{ tr('introPrefix') }} <strong>{{ tr('rentedStatus') }}</strong> {{ tr('introSuffix') }}
        </p>
      </div>

      <div class="rental-stats">
        <article class="rental-stat-card">
          <span>{{ tr('customersStat') }}</span>
          <strong>{{ context.customers.length }}</strong>
        </article>
        <article class="rental-stat-card">
          <span>{{ tr('availableVehiclesStat') }}</span>
          <strong>{{ filteredVehicles.length }}</strong>
        </article>
        <article class="rental-stat-card">
          <span>{{ tr('recentContractsStat') }}</span>
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
            <span class="rental-card-eyebrow">{{ tr('customersTitle') }}</span>
            <h3>{{ customerMode === 'existing' ? tr('selectCustomerTitle') : tr('newCustomerTitle') }}</h3>
          </div>

          <button class="rental-ghost-button" type="button" @click="toggleCustomerMode">
            {{ customerMode === 'existing' ? tr('createCustomer') : tr('selectExisting') }}
          </button>
        </div>

        <div v-if="customerMode === 'existing'" class="rental-sidebar-content">
          <label class="rental-field rental-field-inline">
            <span>{{ tr('searchCustomer') }}</span>
            <input v-model.trim="customerSearch" type="search" :placeholder="tr('searchCustomerPlaceholder')" />
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
              <span>{{ customer.email || tr('noEmail') }}</span>
              <small>{{ customer.documentNumber || tr('noDocument') }}</small>
            </button>

            <div v-if="filteredCustomers.length === 0" class="rental-empty">
              {{ tr('noCustomersForFilter') }}
            </div>
          </div>
        </div>

        <form v-else class="rental-form rental-new-customer" @submit.prevent>
          <div class="rental-field-grid">
            <label class="rental-field">
              <span>{{ tr('firstName') }}</span>
              <input v-model.trim="newCustomer.firstName" type="text" :placeholder="tr('firstNamePlaceholder')" />
            </label>
            <label class="rental-field">
              <span>{{ tr('lastName') }}</span>
              <input v-model.trim="newCustomer.lastName" type="text" :placeholder="tr('lastNamePlaceholder')" />
            </label>
          </div>

          <label class="rental-field">
            <span>Email</span>
            <input v-model.trim="newCustomer.email" type="email" placeholder="cliente@exemplo.com" />
          </label>

          <div class="rental-field-grid">
            <label class="rental-field">
              <span>{{ tr('phone') }}</span>
              <input v-model.trim="newCustomer.phone" type="text" placeholder="+351..." />
            </label>
            <label class="rental-field">
              <span>{{ tr('document') }}</span>
              <input v-model.trim="newCustomer.documentNumber" type="text" :placeholder="tr('documentPlaceholder')" />
            </label>
          </div>

          <p class="rental-note">
            {{ tr('customerReuseNote') }}
          </p>
        </form>
      </aside>

      <main class="rental-main">
        <article class="rental-card rental-main-card">
          <div class="rental-card-head">
            <div>
              <span class="rental-card-eyebrow">{{ tr('contractTitle') }}</span>
              <h3>{{ tr('mainData') }}</h3>
            </div>

            <div class="rental-role-pill">
              {{ sessionUserRole || 'STAFF' }}
            </div>
          </div>

          <form class="rental-form" @submit.prevent="submitContract">
            <div class="rental-summary-strip">
              <article>
                <span>{{ tr('customerLabel') }}</span>
                <strong>{{ selectedCustomerLabel }}</strong>
              </article>
              <article>
                <span>{{ tr('vehicleLabel') }}</span>
                <strong>{{ selectedVehicleLabel }}</strong>
              </article>
              <article>
                <span>{{ tr('estimatedDaysLabel') }}</span>
                <strong>{{ estimatedDays }}</strong>
              </article>
              <article>
                <span>{{ tr('estimatedAmountLabel') }}</span>
                <strong>{{ formatMoney(estimatedAmount) }}</strong>
              </article>
            </div>

            <div class="rental-field-grid rental-field-grid-3">
              <label class="rental-field">
                <span>{{ tr('stationLabel') }}</span>
                <select v-model.number="form.stationId" @change="handleStationChange">
                  <option :value="0" disabled>{{ tr('selectStation') }}</option>
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
                <span>{{ tr('availableVehicleLabel') }}</span>
                <select v-model.number="form.vehicleId" @change="handleVehicleChange">
                  <option :value="0" disabled>{{ tr('selectVehicle') }}</option>
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
                <span>{{ tr('initialMileage') }}</span>
                <input v-model.number="form.pickupOdometerKm" type="number" min="0" />
              </label>
            </div>

            <div class="rental-field-grid rental-field-grid-2">
              <label class="rental-field">
                <span>{{ tr('startDate') }}</span>
                <input v-model="form.pickupAt" type="datetime-local" @change="syncEstimate" />
              </label>

              <label class="rental-field">
                <span>{{ tr('endDate') }}</span>
                <input v-model="form.expectedReturnAt" type="datetime-local" @change="syncEstimate" />
              </label>
            </div>

            <div class="rental-field-grid rental-field-grid-2">
              <label class="rental-field">
                <span>{{ tr('initialVehicleState') }}</span>
                <input v-model.trim="form.vehicleCondition" type="text" :placeholder="tr('initialVehicleStatePlaceholder')" />
              </label>

              <label class="rental-field">
                <span>{{ tr('observations') }}</span>
                <input v-model.trim="form.notes" type="text" :placeholder="tr('observationsPlaceholder')" />
              </label>
            </div>

            <div class="rental-actions">
              <button type="button" class="rental-ghost-button" @click="fillDateRange(1)">
                {{ tr('daysShort', { count: 1 }) }}
              </button>
              <button type="button" class="rental-ghost-button" @click="fillDateRange(2)">
                {{ tr('daysShort', { count: 2 }) }}
              </button>
              <button type="button" class="rental-ghost-button" @click="fillDateRange(7)">
                {{ tr('daysShort', { count: 7 }) }}
              </button>

              <button class="rental-submit-button" type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? tr('creatingContract') : tr('confirmContract') }}
              </button>
            </div>

            <p v-if="createdContract" class="rental-success-note">
              {{ tr('contractCreatedFor', { contractNumber: createdContract.contractNumber, customerName: createdContract.customerFullName }) }}
            </p>
          </form>
        </article>

        <article class="rental-card rental-vehicle-panel">
          <div class="rental-card-head">
            <div>
              <span class="rental-card-eyebrow">{{ tr('vehiclesTitle') }}</span>
              <h3>{{ tr('currentAvailability') }}</h3>
            </div>
            <input v-model.trim="vehicleSearch" class="rental-inline-search" type="search" :placeholder="tr('vehicleFilterPlaceholder')" />
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
                <span>{{ formatMoney(vehicle.dailyRate) }}/{{ tr('perDay') }}</span>
              </div>

              <p>{{ vehicle.brand }} {{ vehicle.model }}</p>
              <small>{{ vehicle.stationName }}</small>
            </button>
          </div>

          <div v-if="filteredVehicles.length === 0" class="rental-empty">
            {{ tr('noVehiclesForFilter') }}
          </div>
        </article>
      </main>
    </div>

    <section class="rental-card rental-recent-panel">
      <div class="rental-card-head">
        <div>
          <span class="rental-card-eyebrow">{{ tr('recentHistory') }}</span>
          <h3>{{ tr('latestContracts') }}</h3>
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
          {{ tr('noContractsYet') }}
        </div>
      </div>
    </section>
    <ActiveRentalManagementPanel
      :session-token="sessionToken"
      :stations="context.stations"
      :refresh-token="contractsRefreshToken"
      @contracts-changed="handleContractsChanged"
    />
  </section>
</template>

<script>
import { createRentalContract, fetchRentalContext } from '../../services/rentalsApi'
import ActiveRentalManagementPanel from './ActiveRentalManagementPanel.vue'
import { getDateLocale, getLocaleState } from '../../services/i18n'
import { formatRentalDateTimeLocal } from '../../utils/rentalFormatting'

const TRANSLATIONS = {
  pt: {
    noDate: 'Sem data',
    staffFlow: 'Fluxo Staff',
    createRentalContract: 'Criar contrato de aluguer',
    introPrefix: 'Selecione o cliente, a viatura disponivel e o periodo de aluguer. O sistema calcula o valor estimado em tempo real e atualiza o estado da viatura para',
    rentedStatus: 'Em Aluguer',
    introSuffix: 'quando o contrato e confirmado.',
    customersStat: 'Clientes',
    availableVehiclesStat: 'Viaturas disponiveis',
    recentContractsStat: 'Contratos recentes',
    customersTitle: 'Clientes',
    contractTitle: 'Contrato',
    daysShort: '{count} dia',
    newCustomerLabel: 'Novo cliente',
    customerToSelect: 'Cliente por selecionar',
    vehicleToSelect: 'Viatura por selecionar',
    loadContextError: 'Nao foi possivel carregar o contexto de contratos.',
    validateStation: 'Selecione uma estacao valida.',
    validateVehicle: 'Selecione uma viatura disponivel.',
    validateCustomer: 'Selecione um cliente existente ou crie um novo cliente.',
    validateNewCustomerName: 'Preencha o nome e apelido do novo cliente.',
    validateDates: 'Defina as datas de inicio e fim do contrato.',
    validatePeriod: 'O periodo do contrato e invalido.',
    validateOdometer: 'A quilometragem inicial e obrigatoria.',
    validateCondition: 'Registe o estado inicial da viatura.',
    createError: 'Nao foi possivel criar o contrato.',
    createSuccess: 'Contrato {contractNumber} criado com sucesso.',
    selectCustomerTitle: 'Selecionar cliente',
    newCustomerTitle: 'Novo cliente',
    createCustomer: 'Criar cliente',
    selectExisting: 'Selecionar existente',
    searchCustomer: 'Pesquisar cliente',
    searchCustomerPlaceholder: 'Nome, email ou documento',
    noEmail: 'Sem email',
    noDocument: 'Sem documento',
    noCustomersForFilter: 'Nenhum cliente corresponde ao filtro atual.',
    firstName: 'Nome',
    firstNamePlaceholder: 'Primeiro nome',
    lastName: 'Apelido',
    lastNamePlaceholder: 'Ultimo nome',
    phone: 'Telefone',
    document: 'Documento',
    documentPlaceholder: 'Numero fiscal ou BI',
    customerReuseNote: 'Se o email ou documento ja existir, o sistema reutiliza automaticamente o cliente associado.',
    mainData: 'Dados principais',
    customerLabel: 'Cliente',
    vehicleLabel: 'Viatura',
    estimatedDaysLabel: 'Dias estimados',
    estimatedAmountLabel: 'Valor estimado',
    stationLabel: 'Estacao',
    selectStation: 'Selecionar estacao',
    availableVehicleLabel: 'Viatura disponivel',
    selectVehicle: 'Selecionar viatura',
    initialMileage: 'Quilometragem inicial',
    startDate: 'Data de inicio',
    endDate: 'Data de fim',
    initialVehicleState: 'Estado inicial da viatura',
    initialVehicleStatePlaceholder: 'Ex: Limpo, sem danos, deposito cheio',
    observations: 'Observacoes',
    observationsPlaceholder: 'Notas operacionais opcionais',
    creatingContract: 'A criar contrato...',
    confirmContract: 'Confirmar criacao do contrato',
    contractCreatedFor: 'Contrato {contractNumber} criado com sucesso para {customerName}.',
    vehiclesTitle: 'Viaturas',
    currentAvailability: 'Disponibilidade atual',
    vehicleFilterPlaceholder: 'Filtrar por matricula ou modelo',
    perDay: 'dia',
    noVehiclesForFilter: 'Nao existem viaturas disponiveis para a estacao ou filtro atual.',
    recentHistory: 'Historico recente',
    latestContracts: 'Ultimos contratos criados',
    noContractsYet: 'Ainda nao existem contratos registados.',
  },
  en: {
    noDate: 'No date',
    staffFlow: 'Staff Flow',
    createRentalContract: 'Create rental contract',
    introPrefix: 'Select customer, available vehicle and rental period. The system calculates estimated amount in real time and updates vehicle status to',
    rentedStatus: 'Rented',
    introSuffix: 'when the contract is confirmed.',
    customersStat: 'Customers',
    availableVehiclesStat: 'Available vehicles',
    recentContractsStat: 'Recent contracts',
    customersTitle: 'Customers',
    contractTitle: 'Contract',
    daysShort: '{count} day',
    newCustomerLabel: 'New customer',
    customerToSelect: 'Customer to select',
    vehicleToSelect: 'Vehicle to select',
    loadContextError: 'Unable to load contracts context.',
    validateStation: 'Select a valid station.',
    validateVehicle: 'Select an available vehicle.',
    validateCustomer: 'Select an existing customer or create a new customer.',
    validateNewCustomerName: 'Fill in first and last name for the new customer.',
    validateDates: 'Set start and end contract dates.',
    validatePeriod: 'Contract period is invalid.',
    validateOdometer: 'Initial mileage is required.',
    validateCondition: 'Provide the initial vehicle condition.',
    createError: 'Unable to create contract.',
    createSuccess: 'Contract {contractNumber} created successfully.',
    selectCustomerTitle: 'Select customer',
    newCustomerTitle: 'New customer',
    createCustomer: 'Create customer',
    selectExisting: 'Select existing',
    searchCustomer: 'Search customer',
    searchCustomerPlaceholder: 'Name, email or document',
    noEmail: 'No email',
    noDocument: 'No document',
    noCustomersForFilter: 'No customer matches the current filter.',
    firstName: 'First name',
    firstNamePlaceholder: 'First name',
    lastName: 'Last name',
    lastNamePlaceholder: 'Last name',
    phone: 'Phone',
    document: 'Document',
    documentPlaceholder: 'Tax number or ID',
    customerReuseNote: 'If email or document already exists, the system automatically reuses the associated customer.',
    mainData: 'Main data',
    customerLabel: 'Customer',
    vehicleLabel: 'Vehicle',
    estimatedDaysLabel: 'Estimated days',
    estimatedAmountLabel: 'Estimated amount',
    stationLabel: 'Station',
    selectStation: 'Select station',
    availableVehicleLabel: 'Available vehicle',
    selectVehicle: 'Select vehicle',
    initialMileage: 'Initial mileage',
    startDate: 'Start date',
    endDate: 'End date',
    initialVehicleState: 'Initial vehicle condition',
    initialVehicleStatePlaceholder: 'Ex: Clean, no damage, full tank',
    observations: 'Observations',
    observationsPlaceholder: 'Optional operational notes',
    creatingContract: 'Creating contract...',
    confirmContract: 'Confirm contract creation',
    contractCreatedFor: 'Contract {contractNumber} created successfully for {customerName}.',
    vehiclesTitle: 'Vehicles',
    currentAvailability: 'Current availability',
    vehicleFilterPlaceholder: 'Filter by plate or model',
    perDay: 'day',
    noVehiclesForFilter: 'No vehicles available for the selected station or filter.',
    recentHistory: 'Recent history',
    latestContracts: 'Latest created contracts',
    noContractsYet: 'There are no contracts registered yet.',
  },
  es: {
    noDate: 'Sin fecha',
    staffFlow: 'Flujo Staff',
    createRentalContract: 'Crear contrato de alquiler',
    introPrefix: 'Seleccione cliente, vehiculo disponible y periodo de alquiler. El sistema calcula el valor estimado en tiempo real y actualiza el estado del vehiculo a',
    rentedStatus: 'En Alquiler',
    introSuffix: 'cuando el contrato se confirma.',
    customersStat: 'Clientes',
    availableVehiclesStat: 'Vehiculos disponibles',
    recentContractsStat: 'Contratos recientes',
    customersTitle: 'Clientes',
    contractTitle: 'Contrato',
    daysShort: '{count} dia',
    newCustomerLabel: 'Nuevo cliente',
    customerToSelect: 'Cliente por seleccionar',
    vehicleToSelect: 'Vehiculo por seleccionar',
    loadContextError: 'No fue posible cargar el contexto de contratos.',
    validateStation: 'Seleccione una estacion valida.',
    validateVehicle: 'Seleccione un vehiculo disponible.',
    validateCustomer: 'Seleccione un cliente existente o cree uno nuevo.',
    validateNewCustomerName: 'Complete nombre y apellido del nuevo cliente.',
    validateDates: 'Defina las fechas de inicio y fin del contrato.',
    validatePeriod: 'El periodo del contrato es invalido.',
    validateOdometer: 'El kilometraje inicial es obligatorio.',
    validateCondition: 'Registre el estado inicial del vehiculo.',
    createError: 'No fue posible crear el contrato.',
    createSuccess: 'Contrato {contractNumber} creado con exito.',
    selectCustomerTitle: 'Seleccionar cliente',
    newCustomerTitle: 'Nuevo cliente',
    createCustomer: 'Crear cliente',
    selectExisting: 'Seleccionar existente',
    searchCustomer: 'Buscar cliente',
    searchCustomerPlaceholder: 'Nombre, email o documento',
    noEmail: 'Sin email',
    noDocument: 'Sin documento',
    noCustomersForFilter: 'Ningun cliente coincide con el filtro actual.',
    firstName: 'Nombre',
    firstNamePlaceholder: 'Nombre',
    lastName: 'Apellido',
    lastNamePlaceholder: 'Apellido',
    phone: 'Telefono',
    document: 'Documento',
    documentPlaceholder: 'Numero fiscal o documento',
    customerReuseNote: 'Si el email o documento ya existe, el sistema reutiliza automaticamente el cliente asociado.',
    mainData: 'Datos principales',
    customerLabel: 'Cliente',
    vehicleLabel: 'Vehiculo',
    estimatedDaysLabel: 'Dias estimados',
    estimatedAmountLabel: 'Valor estimado',
    stationLabel: 'Estacion',
    selectStation: 'Seleccionar estacion',
    availableVehicleLabel: 'Vehiculo disponible',
    selectVehicle: 'Seleccionar vehiculo',
    initialMileage: 'Kilometraje inicial',
    startDate: 'Fecha de inicio',
    endDate: 'Fecha de fin',
    initialVehicleState: 'Estado inicial del vehiculo',
    initialVehicleStatePlaceholder: 'Ej: Limpio, sin danos, deposito lleno',
    observations: 'Observaciones',
    observationsPlaceholder: 'Notas operativas opcionales',
    creatingContract: 'Creando contrato...',
    confirmContract: 'Confirmar creacion del contrato',
    contractCreatedFor: 'Contrato {contractNumber} creado con exito para {customerName}.',
    vehiclesTitle: 'Vehiculos',
    currentAvailability: 'Disponibilidad actual',
    vehicleFilterPlaceholder: 'Filtrar por matricula o modelo',
    perDay: 'dia',
    noVehiclesForFilter: 'No hay vehiculos disponibles para la estacion o filtro actual.',
    recentHistory: 'Historial reciente',
    latestContracts: 'Ultimos contratos creados',
    noContractsYet: 'Aun no existen contratos registrados.',
  },
}

function formatDateTimeLocal(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const pad = (input) => String(input).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default {
  name: 'RentalContractsView',
  components: {
    ActiveRentalManagementPanel,
  },
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
      localeState: getLocaleState(),
      contractsRefreshToken: 0,
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
        return firstName || lastName ? `${firstName} ${lastName}`.trim() : this.tr('newCustomerLabel')
      }

      return this.selectedCustomer
        ? `${this.selectedCustomer.firstName} ${this.selectedCustomer.lastName}`
        : this.tr('customerToSelect')
    },
    selectedVehicleLabel() {
      if (!this.selectedVehicle) {
        return this.tr('vehicleToSelect')
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
    tr(key, params = {}) {
      const locale = this.localeState.locale
      const template =
        (TRANSLATIONS[locale] && TRANSLATIONS[locale][key]) || TRANSLATIONS.pt[key] || key

      return Object.entries(params).reduce(
        (result, [paramKey, value]) => result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value)),
        template,
      )
    },
    formatDate(value) {
      if (!value) {
        return this.tr('noDate')
      }

      return new Date(value).toLocaleString(getDateLocale(), {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    formatMoney(value) {
      return new Intl.NumberFormat(getDateLocale(), {
        style: 'currency',
        currency: 'EUR',
      }).format(Number(value || 0))
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
          this.extractApiError(error, this.tr('loadContextError')),
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
        this.form.pickupAt = formatRentalDateTimeLocal(new Date())
      }

      if (!this.form.expectedReturnAt) {
        this.form.expectedReturnAt = formatRentalDateTimeLocal(
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
        this.form.pickupAt = formatRentalDateTimeLocal(new Date())
      }

      if (!this.form.expectedReturnAt) {
        this.form.expectedReturnAt = formatRentalDateTimeLocal(
          new Date(Date.now() + 1000 * 60 * 60 * 24),
        )
      }
    },
    fillDateRange(days) {
      const start = new Date()
      const end = new Date(start.getTime() + days * 1000 * 60 * 60 * 24)

      this.form.pickupAt = formatRentalDateTimeLocal(start)
      this.form.expectedReturnAt = formatRentalDateTimeLocal(end)
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
      this.form.pickupAt = formatRentalDateTimeLocal(new Date())
      this.form.expectedReturnAt = formatRentalDateTimeLocal(
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
        return this.tr('validateStation')
      }

      if (this.form.vehicleId < 1) {
        return this.tr('validateVehicle')
      }

      if (this.customerMode === 'existing' && this.selectedCustomerId < 1) {
        return this.tr('validateCustomer')
      }

      if (this.customerMode === 'new') {
        if (!this.newCustomer.firstName.trim() || !this.newCustomer.lastName.trim()) {
          return this.tr('validateNewCustomerName')
        }
      }

      if (!this.form.pickupAt || !this.form.expectedReturnAt) {
        return this.tr('validateDates')
      }

      if (this.estimatedDays < 1) {
        return this.tr('validatePeriod')
      }

      if (this.form.pickupOdometerKm === null || this.form.pickupOdometerKm < 0) {
        return this.tr('validateOdometer')
      }

      if (!this.form.vehicleCondition.trim()) {
        return this.tr('validateCondition')
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
        this.showBanner(this.tr('createSuccess', { contractNumber: response.contractNumber }), 'success')
        this.resetFormAfterSuccess()
        await this.loadContext()
        this.contractsRefreshToken += 1
      } catch (error) {
        this.showBanner(
          this.extractApiError(error, this.tr('createError')),
          'error',
        )
      } finally {
        this.isSubmitting = false
      }
    },
    showBanner(message, type) {
      this.banner = { message, type }
    },
    async handleContractsChanged() {
      this.contractsRefreshToken += 1
      await this.loadContext()
    },
  },
}
</script>

<style scoped src="../../styles/components/rental-contracts.css"></style>
