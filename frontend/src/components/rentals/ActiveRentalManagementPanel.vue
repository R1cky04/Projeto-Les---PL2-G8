<template>
  <section class="rental-card rental-management-panel">
    <div class="rental-card-head">
      <div class="rental-management-copy">
        <span class="rental-card-eyebrow">Atualizacao controlada</span>
        <h3>Gerir contratos ativos</h3>
        <p class="rental-note">
          Pesquise por numero de contrato ou cliente, reveja os dados atuais e
          atualize apenas os campos autorizados. O valor estimado e recalculado
          automaticamente sempre que o periodo muda.
        </p>
      </div>

      <div class="rental-role-pill">
        Ativos {{ activeRentals.length }}
      </div>
    </div>

    <p
      v-if="banner.message"
      :class="['rental-banner', `rental-banner-${banner.type}`]"
    >
      {{ banner.message }}
    </p>

    <div class="rental-management-layout">
      <aside class="rental-management-sidebar">
        <label class="rental-field rental-field-inline">
          <span>Pesquisar contrato</span>
          <input
            v-model.trim="searchTerm"
            type="search"
            placeholder="Numero do contrato ou cliente"
          />
        </label>

        <div class="rental-list rental-management-list">
          <div v-if="isLoading" class="rental-empty">
            A carregar contratos ativos...
          </div>

          <template v-else>
            <button
              v-for="rental in filteredRentals"
              :key="rental.id"
              type="button"
              class="rental-list-card rental-contract-list-card"
              :class="{ 'is-selected': selectedRentalId === rental.id }"
              @click="selectRental(rental)"
            >
              <div class="recent-card-head">
                <strong>{{ rental.contractNumber }}</strong>
                <span>{{ formatMoney(rental.estimatedAmount) }}</span>
              </div>

              <p>{{ rental.customerFullName }} · {{ rental.vehiclePlate }}</p>
              <small>
                {{ rental.stationName }} -> {{ rental.returnStationName }}
              </small>
            </button>
          </template>

          <div
            v-if="!isLoading && filteredRentals.length === 0"
            class="rental-empty"
          >
            Nenhum contrato ativo corresponde ao filtro atual.
          </div>
        </div>
      </aside>

      <main class="rental-management-main">
        <article v-if="selectedRental" class="rental-management-details">
          <div class="rental-summary-strip rental-summary-strip-wide">
            <article>
              <span>Contrato</span>
              <strong>{{ selectedRental.contractNumber }}</strong>
            </article>
            <article>
              <span>Cliente</span>
              <strong>{{ selectedRental.customerFullName }}</strong>
            </article>
            <article>
              <span>Veiculo</span>
              <strong>
                {{ selectedRental.vehiclePlate }} ·
                {{ selectedRental.vehicleBrand }} {{ selectedRental.vehicleModel }}
              </strong>
            </article>
            <article>
              <span>Estado</span>
              <strong>{{ selectedRental.status }}</strong>
            </article>
            <article>
              <span>Inicio</span>
              <strong>{{ formatDate(selectedRental.pickupAt) }}</strong>
            </article>
            <article>
              <span>Fim previsto</span>
              <strong>{{ formatDate(selectedRental.expectedReturnAt) }}</strong>
            </article>
            <article>
              <span>Devolucao prevista</span>
              <strong>{{ selectedRental.returnStationName }}</strong>
            </article>
            <article>
              <span>Valor atual</span>
              <strong>{{ formatMoney(selectedRental.estimatedAmount) }}</strong>
            </article>
          </div>

          <form class="rental-form" @submit.prevent="submitUpdate">
            <div class="rental-field-grid rental-field-grid-2">
              <label class="rental-field">
                <span>Nova data de fim</span>
                <input
                  v-model="editForm.expectedReturnAt"
                  type="datetime-local"
                />
              </label>

              <label class="rental-field">
                <span>Estacao de devolucao</span>
                <select v-model.number="editForm.returnStationId">
                  <option
                    v-for="station in stations"
                    :key="station.id"
                    :value="station.id"
                  >
                    {{ station.name }}
                  </option>
                </select>
              </label>
            </div>

            <div class="rental-actions rental-inline-actions">
              <button
                type="button"
                class="rental-ghost-button"
                @click="extendReturnDate(1)"
              >
                +1 dia
              </button>
              <button
                type="button"
                class="rental-ghost-button"
                @click="extendReturnDate(3)"
              >
                +3 dias
              </button>
              <button
                type="button"
                class="rental-ghost-button"
                @click="extendReturnDate(7)"
              >
                +7 dias
              </button>
            </div>

            <div class="rental-summary-strip rental-summary-strip-compact">
              <article>
                <span>Dias recalculados</span>
                <strong>{{ estimatedDays }}</strong>
              </article>
              <article>
                <span>Valor recalculado</span>
                <strong>{{ formatMoney(estimatedAmount) }}</strong>
              </article>
              <article>
                <span>Preco diario</span>
                <strong>{{ formatMoney(selectedRental.dailyRate) }}</strong>
              </article>
            </div>

            <div class="rental-field-grid rental-field-grid-2">
              <label class="rental-field">
                <span>Nome do cliente</span>
                <input v-model.trim="editForm.customerFirstName" type="text" />
              </label>

              <label class="rental-field">
                <span>Apelido do cliente</span>
                <input v-model.trim="editForm.customerLastName" type="text" />
              </label>
            </div>

            <div class="rental-field-grid rental-field-grid-3">
              <label class="rental-field">
                <span>Email</span>
                <input v-model.trim="editForm.customerEmail" type="email" />
              </label>

              <label class="rental-field">
                <span>Telefone</span>
                <input v-model.trim="editForm.customerPhone" type="text" />
              </label>

              <label class="rental-field">
                <span>Documento</span>
                <input
                  v-model.trim="editForm.customerDocumentNumber"
                  type="text"
                />
              </label>
            </div>

            <label class="rental-field">
              <span>Notas do contrato</span>
              <textarea
                v-model.trim="editForm.notes"
                placeholder="Notas operacionais e observacoes relevantes"
              />
            </label>

            <div class="rental-actions rental-form-actions">
              <button
                type="button"
                class="rental-ghost-button"
                :disabled="!hasChanges"
                @click="resetForm"
              >
                Repor valores atuais
              </button>

              <button
                class="rental-submit-button"
                type="submit"
                :disabled="isSubmitting || !hasChanges"
              >
                {{
                  isSubmitting
                    ? 'A guardar alteracoes...'
                    : 'Confirmar atualizacao'
                }}
              </button>
            </div>
          </form>
        </article>

        <div v-else class="rental-empty rental-management-empty">
          Selecione um contrato ativo para consultar e atualizar os dados
          permitidos.
        </div>
      </main>
    </div>
  </section>
</template>

<script>
import {
  fetchRentalContracts,
  updateRentalContract,
} from '../../services/rentalsApi'
import {
  formatRentalCurrency,
  formatRentalDateTimeLocal,
  formatRentalDisplayDate,
} from '../../utils/rentalFormatting'

function createEditForm() {
  return {
    expectedReturnAt: '',
    returnStationId: 0,
    notes: '',
    customerFirstName: '',
    customerLastName: '',
    customerEmail: '',
    customerPhone: '',
    customerDocumentNumber: '',
  }
}

export default {
  name: 'ActiveRentalManagementPanel',
  props: {
    sessionToken: {
      type: String,
      required: true,
    },
    stations: {
      type: Array,
      default: () => [],
    },
    refreshToken: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      activeRentals: [],
      selectedRentalId: 0,
      searchTerm: '',
      editForm: createEditForm(),
      banner: {
        message: '',
        type: 'info',
      },
      isLoading: false,
      isSubmitting: false,
    }
  },
  computed: {
    filteredRentals() {
      const normalizedSearch = this.searchTerm.trim().toLowerCase()

      if (!normalizedSearch) {
        return this.activeRentals
      }

      return this.activeRentals.filter((rental) =>
        this.buildSearchText(rental).includes(normalizedSearch),
      )
    },
    selectedRental() {
      return (
        this.activeRentals.find((rental) => rental.id === this.selectedRentalId) ||
        null
      )
    },
    estimatedDays() {
      if (!this.selectedRental || !this.editForm.expectedReturnAt) {
        return 1
      }

      const pickupAt = new Date(this.selectedRental.pickupAt)
      const expectedReturnAt = new Date(this.editForm.expectedReturnAt)

      if (
        Number.isNaN(pickupAt.getTime()) ||
        Number.isNaN(expectedReturnAt.getTime())
      ) {
        return 1
      }

      const difference = expectedReturnAt.getTime() - pickupAt.getTime()

      return Math.max(1, Math.ceil(difference / (1000 * 60 * 60 * 24)))
    },
    estimatedAmount() {
      if (!this.selectedRental) {
        return 0
      }

      return Number(
        (this.estimatedDays * Number(this.selectedRental.dailyRate || 0)).toFixed(2),
      )
    },
    hasChanges() {
      return Object.keys(this.buildUpdatePayload()).length > 0
    },
  },
  watch: {
    refreshToken() {
      this.loadActiveRentals()
    },
  },
  async mounted() {
    await this.loadActiveRentals()
  },
  methods: {
    formatDate(value) {
      return formatRentalDisplayDate(value)
    },
    formatMoney(value) {
      return formatRentalCurrency(value)
    },
    buildSearchText(rental) {
      return [
        rental.contractNumber,
        rental.customerFullName,
        rental.customerEmail,
        rental.customerPhone,
        rental.customerDocumentNumber,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
    },
    extractApiError(error, fallbackMessage) {
      const details = error?.errors

      if (Array.isArray(details) && details.length > 0) {
        return details.join(' | ')
      }

      return error?.message || fallbackMessage
    },
    async loadActiveRentals() {
      this.isLoading = true

      try {
        const rentals = await fetchRentalContracts(this.sessionToken, {
          status: 'OPEN',
        })

        this.activeRentals = rentals
        this.reconcileSelection()
      } catch (error) {
        this.showBanner(
          this.extractApiError(
            error,
            'Nao foi possivel carregar os contratos ativos.',
          ),
          'error',
        )
      } finally {
        this.isLoading = false
      }
    },
    reconcileSelection() {
      if (this.activeRentals.length === 0) {
        this.selectedRentalId = 0
        this.editForm = createEditForm()
        return
      }

      const selectedRental =
        this.activeRentals.find((rental) => rental.id === this.selectedRentalId) ||
        this.activeRentals[0]

      this.selectRental(selectedRental)
    },
    selectRental(rental) {
      this.selectedRentalId = rental.id
      this.editForm = {
        expectedReturnAt: formatRentalDateTimeLocal(rental.expectedReturnAt),
        returnStationId: rental.returnStationId,
        notes: rental.notes || '',
        customerFirstName: this.extractCustomerNamePart(rental.customerFullName, 'first'),
        customerLastName: this.extractCustomerNamePart(rental.customerFullName, 'last'),
        customerEmail: rental.customerEmail || '',
        customerPhone: rental.customerPhone || '',
        customerDocumentNumber: rental.customerDocumentNumber || '',
      }
    },
    extractCustomerNamePart(fullName, segment) {
      const nameParts = String(fullName || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)

      if (nameParts.length === 0) {
        return ''
      }

      if (segment === 'first') {
        return nameParts[0]
      }

      return nameParts.slice(1).join(' ')
    },
    extendReturnDate(days) {
      const baseDate = new Date(
        this.editForm.expectedReturnAt || this.selectedRental?.expectedReturnAt,
      )

      if (Number.isNaN(baseDate.getTime())) {
        return
      }

      baseDate.setDate(baseDate.getDate() + days)
      this.editForm.expectedReturnAt = formatRentalDateTimeLocal(baseDate)
    },
    normalizeText(value) {
      return String(value || '').trim()
    },
    normalizeEmail(value) {
      const normalized = this.normalizeText(value)
      return normalized ? normalized.toLowerCase() : ''
    },
    buildUpdatePayload() {
      if (!this.selectedRental) {
        return {}
      }

      // Only changed fields are sent so the backend can keep the update
      // contract narrow and predictable.
      const payload = {}
      const selectedRental = this.selectedRental
      const currentExpectedReturnAt = formatRentalDateTimeLocal(
        selectedRental.expectedReturnAt,
      )
      const nextExpectedReturnAt = this.normalizeText(this.editForm.expectedReturnAt)

      if (nextExpectedReturnAt && nextExpectedReturnAt !== currentExpectedReturnAt) {
        const parsedExpectedReturnAt = new Date(nextExpectedReturnAt)

        if (!Number.isNaN(parsedExpectedReturnAt.getTime())) {
          payload.expectedReturnAt = parsedExpectedReturnAt.toISOString()
        }
      }

      if (Number(this.editForm.returnStationId) !== selectedRental.returnStationId) {
        payload.returnStationId = Number(this.editForm.returnStationId)
      }

      const currentNotes = selectedRental.notes || ''
      const nextNotes = this.normalizeText(this.editForm.notes)

      if (nextNotes !== currentNotes) {
        payload.notes = nextNotes
      }

      const currentFirstName = this.extractCustomerNamePart(
        selectedRental.customerFullName,
        'first',
      )
      const currentLastName = this.extractCustomerNamePart(
        selectedRental.customerFullName,
        'last',
      )

      if (this.normalizeText(this.editForm.customerFirstName) !== currentFirstName) {
        payload.customerFirstName = this.normalizeText(this.editForm.customerFirstName)
      }

      if (this.normalizeText(this.editForm.customerLastName) !== currentLastName) {
        payload.customerLastName = this.normalizeText(this.editForm.customerLastName)
      }

      if (
        this.normalizeEmail(this.editForm.customerEmail) !==
        this.normalizeEmail(selectedRental.customerEmail)
      ) {
        payload.customerEmail = this.normalizeText(this.editForm.customerEmail)
      }

      if (
        this.normalizeText(this.editForm.customerPhone) !==
        this.normalizeText(selectedRental.customerPhone)
      ) {
        payload.customerPhone = this.normalizeText(this.editForm.customerPhone)
      }

      if (
        this.normalizeText(this.editForm.customerDocumentNumber) !==
        this.normalizeText(selectedRental.customerDocumentNumber)
      ) {
        payload.customerDocumentNumber = this.normalizeText(
          this.editForm.customerDocumentNumber,
        )
      }

      return payload
    },
    validateBeforeSubmit() {
      if (!this.selectedRental) {
        return 'Selecione um contrato ativo.'
      }

      if (!this.editForm.expectedReturnAt) {
        return 'Defina uma nova data de fim.'
      }

      const expectedReturnAt = new Date(this.editForm.expectedReturnAt)
      const pickupAt = new Date(this.selectedRental.pickupAt)

      if (Number.isNaN(expectedReturnAt.getTime())) {
        return 'A data de fim indicada e invalida.'
      }

      if (expectedReturnAt.getTime() <= pickupAt.getTime()) {
        return 'A data de fim tem de ser posterior a data de inicio.'
      }

      if (this.editForm.returnStationId < 1) {
        return 'Selecione uma estacao de devolucao valida.'
      }

      if (!this.hasChanges) {
        return 'Nao existem alteracoes para guardar.'
      }

      return ''
    },
    resetForm() {
      if (!this.selectedRental) {
        return
      }

      this.selectRental(this.selectedRental)
      this.showBanner('Os valores editados foram repostos.', 'info')
    },
    async submitUpdate() {
      const validationError = this.validateBeforeSubmit()

      if (validationError) {
        this.showBanner(validationError, 'error')
        return
      }

      this.isSubmitting = true

      try {
        const updatedRental = await updateRentalContract(
          this.selectedRental.id,
          this.buildUpdatePayload(),
          this.sessionToken,
        )

        this.activeRentals = this.activeRentals.map((rental) =>
          rental.id === updatedRental.id ? updatedRental : rental,
        )
        this.selectRental(updatedRental)
        this.showBanner(
          `Contrato ${updatedRental.contractNumber} atualizado com sucesso.`,
          'success',
        )
        this.$emit('contracts-changed')
      } catch (error) {
        this.showBanner(
          this.extractApiError(
            error,
            'Nao foi possivel atualizar o contrato selecionado.',
          ),
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
