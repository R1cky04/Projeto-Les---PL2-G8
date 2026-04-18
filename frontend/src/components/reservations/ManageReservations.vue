<template>
  <section class="rental-shell">
    <header class="rental-header">
      <div class="rental-copy">
        <p class="rental-eyebrow">Fluxo Staff</p>
        <h2>Gerir reservas</h2>
        <p class="rental-intro">
          Consulte, crie, atualize e cancele reservas confirmadas.
        </p>
      </div>

      <div class="rental-stats">
        <article class="rental-stat-card">
          <span>Total</span>
          <strong>{{ reservations.length }}</strong>
        </article>
        <article class="rental-stat-card">
          <span>Confirmadas</span>
          <strong>{{ confirmedCount }}</strong>
        </article>
        <article class="rental-stat-card">
          <span>Canceladas</span>
          <strong>{{ cancelledCount }}</strong>
        </article>
      </div>
    </header>

    <p v-if="banner.message" :class="['rental-banner', `rental-banner-${banner.type}`]">
      {{ banner.message }}
    </p>

    <section class="rental-card">
      <div class="rental-card-head">
        <div>
          <span class="rental-card-eyebrow">Nova reserva</span>
          <h3>Criar reserva</h3>
        </div>
      </div>

      <form class="rental-form" @submit.prevent="submitCreate">
        <div class="rental-field-grid rental-field-grid-3">
          <label class="rental-field">
            <span>Cliente</span>
            <input v-model.trim="createForm.customerName" type="text" placeholder="Nome do cliente" />
          </label>
          <label class="rental-field">
            <span>Email</span>
            <input v-model.trim="createForm.customerEmail" type="email" placeholder="cliente@exemplo.com" />
          </label>
          <label class="rental-field">
            <span>Estacao</span>
            <select v-model.number="createForm.stationId">
              <option :value="0" disabled>Selecionar estacao</option>
              <option v-for="station in stations" :key="station.id" :value="station.id">
                {{ station.name }}
              </option>
            </select>
          </label>
        </div>

        <div class="rental-field-grid rental-field-grid-3">
          <label class="rental-field">
            <span>ID viatura</span>
            <input v-model.number="createForm.vehicleId" type="number" min="1" />
          </label>
          <label class="rental-field">
            <span>Inicio</span>
            <input v-model="createForm.pickupAt" type="datetime-local" />
          </label>
          <label class="rental-field">
            <span>Fim previsto</span>
            <input v-model="createForm.expectedReturnAt" type="datetime-local" />
          </label>
        </div>

        <label class="rental-field">
          <span>Notas</span>
          <input v-model.trim="createForm.notes" type="text" placeholder="Notas operacionais" />
        </label>

        <div class="rental-actions rental-form-actions">
          <button class="rental-submit-button" type="submit" :disabled="isCreating">
            {{ isCreating ? 'A criar reserva...' : 'Criar reserva' }}
          </button>
        </div>
      </form>
    </section>

    <section class="rental-card rental-management-panel">
      <div class="rental-card-head">
        <div>
          <span class="rental-card-eyebrow">Lista</span>
          <h3>Reservas</h3>
        </div>
        <input v-model.trim="searchTerm" class="rental-inline-search" type="search" placeholder="Pesquisar reserva" />
      </div>

      <div class="rental-layout">
        <aside class="rental-sidebar rental-card">
          <div class="rental-list">
            <button
              v-for="reservation in filteredReservations"
              :key="reservation.id"
              type="button"
              class="rental-list-card"
              :class="{ 'is-selected': selectedReservationId === reservation.id }"
              @click="selectReservation(reservation)"
            >
              <strong>{{ reservation.reservationNumber }}</strong>
              <span>{{ reservation.customerName }}</span>
              <small>{{ reservation.vehiclePlate }} | {{ reservation.status }}</small>
            </button>

            <div v-if="filteredReservations.length === 0" class="rental-empty">
              Nenhuma reserva corresponde ao filtro atual.
            </div>
          </div>
        </aside>

        <main class="rental-main">
          <article v-if="selectedReservation" class="rental-card rental-main-card">
            <div class="rental-summary-strip">
              <article>
                <span>Numero</span>
                <strong>{{ selectedReservation.reservationNumber }}</strong>
              </article>
              <article>
                <span>Estado</span>
                <strong>{{ selectedReservation.status }}</strong>
              </article>
              <article>
                <span>Viatura</span>
                <strong>{{ selectedReservation.vehiclePlate }}</strong>
              </article>
              <article>
                <span>Cliente</span>
                <strong>{{ selectedReservation.customerName }}</strong>
              </article>
            </div>

            <form class="rental-form" @submit.prevent="submitUpdate">
              <div class="rental-field-grid rental-field-grid-2">
                <label class="rental-field">
                  <span>Novo fim previsto</span>
                  <input v-model="editForm.expectedReturnAt" type="datetime-local" />
                </label>

                <label class="rental-field">
                  <span>Estacao devolucao</span>
                  <select v-model.number="editForm.returnStationId">
                    <option v-for="station in stations" :key="`station-${station.id}`" :value="station.id">
                      {{ station.name }}
                    </option>
                  </select>
                </label>
              </div>

              <div class="rental-field-grid rental-field-grid-2">
                <label class="rental-field">
                  <span>Cliente</span>
                  <input v-model.trim="editForm.customerName" type="text" />
                </label>

                <label class="rental-field">
                  <span>Email</span>
                  <input v-model.trim="editForm.customerEmail" type="email" />
                </label>
              </div>

              <label class="rental-field">
                <span>Notas</span>
                <input v-model.trim="editForm.notes" type="text" />
              </label>

              <div class="rental-actions rental-form-actions">
                <button class="rental-submit-button" type="submit" :disabled="isUpdating || !selectedReservationCanEdit">
                  {{ isUpdating ? 'A guardar...' : 'Guardar alteracoes' }}
                </button>

                <button
                  type="button"
                  class="rental-ghost-button"
                  :disabled="isCancelling || !selectedReservationCanCancel"
                  @click="submitCancel"
                >
                  {{ isCancelling ? 'A cancelar...' : 'Cancelar reserva' }}
                </button>
              </div>
            </form>
          </article>

          <div v-else class="rental-empty">
            Selecione uma reserva para gerir.
          </div>
        </main>
      </div>
    </section>
  </section>
</template>

<script>
import {
  cancelReservation,
  createReservation,
  fetchReservations,
  updateReservation,
} from '../../services/reservationsApi'
import { fetchRentalContext } from '../../services/rentalsApi'
import { formatRentalDateTimeLocal } from '../../utils/rentalFormatting'

function createCreateForm() {
  return {
    customerName: '',
    customerEmail: '',
    stationId: 0,
    vehicleId: 0,
    pickupAt: '',
    expectedReturnAt: '',
    notes: '',
  }
}

function createEditForm() {
  return {
    expectedReturnAt: '',
    returnStationId: 0,
    customerName: '',
    customerEmail: '',
    notes: '',
  }
}

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
      reservations: [],
      stations: [],
      selectedReservationId: 0,
      searchTerm: '',
      createForm: createCreateForm(),
      editForm: createEditForm(),
      isCreating: false,
      isUpdating: false,
      isCancelling: false,
      banner: {
        message: '',
        type: 'info',
      },
    }
  },
  computed: {
    confirmedCount() {
      return this.reservations.filter((item) => item.status === 'CONFIRMED').length
    },
    cancelledCount() {
      return this.reservations.filter((item) => item.status === 'CANCELLED').length
    },
    filteredReservations() {
      const term = this.searchTerm.trim().toLowerCase()

      if (!term) {
        return this.reservations
      }

      return this.reservations.filter((reservation) => {
        const searchable = [
          reservation.reservationNumber,
          reservation.customerName,
          reservation.customerEmail,
          reservation.vehiclePlate,
          reservation.status,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return searchable.includes(term)
      })
    },
    selectedReservation() {
      return this.reservations.find((item) => item.id === this.selectedReservationId) || null
    },
    selectedReservationCanEdit() {
      return this.selectedReservation && !['CANCELLED', 'COMPLETED'].includes(this.selectedReservation.status)
    },
    selectedReservationCanCancel() {
      return this.selectedReservation && !['CANCELLED', 'COMPLETED'].includes(this.selectedReservation.status)
    },
  },
  async mounted() {
    await this.loadContext()
    await this.loadReservations()
  },
  methods: {
    showBanner(message, type) {
      this.banner = { message, type }
    },
    normalizeText(value) {
      return String(value || '').trim()
    },
    extractApiError(error, fallbackMessage) {
      const details = error?.errors

      if (Array.isArray(details) && details.length > 0) {
        return details.join(' | ')
      }

      return error?.message || fallbackMessage
    },
    async loadContext() {
      try {
        const context = await fetchRentalContext(this.sessionToken)
        this.stations = context.stations || []
      } catch {
        this.stations = []
      }
    },
    async loadReservations() {
      try {
        const reservations = await fetchReservations(this.sessionToken)
        this.reservations = reservations

        if (!this.selectedReservationId && reservations.length > 0) {
          this.selectReservation(reservations[0])
        }
      } catch (error) {
        this.showBanner(
          this.extractApiError(error, 'Nao foi possivel carregar as reservas.'),
          'error',
        )
      }
    },
    selectReservation(reservation) {
      this.selectedReservationId = reservation.id
      this.editForm = {
        expectedReturnAt: formatRentalDateTimeLocal(reservation.expectedReturnAt),
        returnStationId: reservation.returnStationId,
        customerName: reservation.customerName || '',
        customerEmail: reservation.customerEmail || '',
        notes: reservation.notes || '',
      }
    },
    validateCreate() {
      if (!this.createForm.customerName) {
        return 'Indique o nome do cliente.'
      }

      if (!Number.isInteger(Number(this.createForm.stationId)) || Number(this.createForm.stationId) < 1) {
        return 'Selecione uma estacao valida.'
      }

      if (!Number.isInteger(Number(this.createForm.vehicleId)) || Number(this.createForm.vehicleId) < 1) {
        return 'Indique um ID de viatura valido.'
      }

      if (!this.createForm.pickupAt || !this.createForm.expectedReturnAt) {
        return 'Preencha as datas da reserva.'
      }

      return ''
    },
    async submitCreate() {
      const validationError = this.validateCreate()

      if (validationError) {
        this.showBanner(validationError, 'error')
        return
      }

      this.isCreating = true

      try {
        await createReservation(
          {
            customerName: this.normalizeText(this.createForm.customerName),
            customerEmail: this.normalizeText(this.createForm.customerEmail),
            stationId: Number(this.createForm.stationId),
            vehicleId: Number(this.createForm.vehicleId),
            pickupAt: new Date(this.createForm.pickupAt).toISOString(),
            expectedReturnAt: new Date(this.createForm.expectedReturnAt).toISOString(),
            notes: this.normalizeText(this.createForm.notes),
          },
          this.sessionToken,
        )

        this.createForm = createCreateForm()
        await this.loadReservations()
        this.showBanner('Reserva criada com sucesso.', 'success')
      } catch (error) {
        this.showBanner(
          this.extractApiError(error, 'Nao foi possivel criar a reserva.'),
          'error',
        )
      } finally {
        this.isCreating = false
      }
    },
    async submitUpdate() {
      if (!this.selectedReservation || !this.selectedReservationCanEdit) {
        this.showBanner('Selecione uma reserva editavel.', 'error')
        return
      }

      this.isUpdating = true

      try {
        await updateReservation(
          this.selectedReservation.id,
          {
            expectedReturnAt: new Date(this.editForm.expectedReturnAt).toISOString(),
            returnStationId: Number(this.editForm.returnStationId),
            customerName: this.normalizeText(this.editForm.customerName),
            customerEmail: this.normalizeText(this.editForm.customerEmail),
            notes: this.normalizeText(this.editForm.notes),
          },
          this.sessionToken,
        )

        await this.loadReservations()
        const updated = this.reservations.find((item) => item.id === this.selectedReservationId)

        if (updated) {
          this.selectReservation(updated)
        }

        this.showBanner('Reserva atualizada com sucesso.', 'success')
      } catch (error) {
        this.showBanner(
          this.extractApiError(error, 'Nao foi possivel atualizar a reserva.'),
          'error',
        )
      } finally {
        this.isUpdating = false
      }
    },
    async submitCancel() {
      if (!this.selectedReservation || !this.selectedReservationCanCancel) {
        this.showBanner('Selecione uma reserva cancelavel.', 'error')
        return
      }

      this.isCancelling = true

      try {
        await cancelReservation(this.selectedReservation.id, this.sessionToken)
        await this.loadReservations()
        const updated = this.reservations.find((item) => item.id === this.selectedReservationId)

        if (updated) {
          this.selectReservation(updated)
        }

        this.showBanner('Reserva cancelada com sucesso.', 'success')
      } catch (error) {
        this.showBanner(
          this.extractApiError(error, 'Nao foi possivel cancelar a reserva.'),
          'error',
        )
      } finally {
        this.isCancelling = false
      }
    },
  },
}
</script>

<style scoped src="../../styles/components/rental-contracts.css"></style>
