<template>
  <div class="dark-viewport-manage">
    <header class="dashboard-header">
      <div class="title-section">
        <h1>{{ tr('title') }}</h1>
        <p>{{ tr('subtitle') }}</p>
      </div>
    </header>

    <div class="main-layout">
      <aside class="sidebar-list">
        <div class="list-status">
          <span>{{ tr('vehiclesCount', { count: vehicles.length }) }}</span>
          <span class="status-hint">{{ tr('shortcutHint') }}</span>
        </div>

        <div class="filter-sticky">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              ref="searchInput"
              v-model="searchTerm"
              type="text"
              :placeholder="tr('filterPlaceholder')"
              @input="handleSearchInput"
            />

            <button
              v-if="searchTerm"
              class="clear-search"
              type="button"
              @click="clearSearch"
            >
              {{ tr('clear') }}
            </button>
          </div>
        </div>

        <div class="scroll-area">
          <div
            v-for="vehicle in vehicles"
            :key="vehicle.id"
            :class="['station-card', { active: selectedVehicle?.id === vehicle.id }]"
            @click="selectVehicle(vehicle)"
          >
            <div class="card-lead">
              <span class="station-id">#{{ vehicle.id }}</span>
              <span class="capacity-tag">{{ formatStatusLabel(vehicle.status) }}</span>
            </div>
            <h3 class="station-name">{{ vehicle.plateNumber }}</h3>
            <span class="station-loc">{{ vehicle.brand }} {{ vehicle.model }}</span>
          </div>
        </div>
      </aside>

      <main class="details-view">
        <transition name="fade-fast" mode="out-in">
          <div v-if="selectedVehicle" :key="selectedVehicle.id" class="editor-pane">
            <div class="pane-header">
              <div class="header-main">
                <span class="meta-label">{{ tr('vehicleRecord') }}</span>
                <h2>{{ selectedVehicle.plateNumber }}</h2>
              </div>

              <div class="timestamps">
                <div class="time-item">
                  <span class="time-label">{{ tr('created') }}</span>
                  <span class="time-val">{{ formatDate(selectedVehicle.createdAt) }}</span>
                </div>
                <div class="time-item highlight-time">
                  <span class="time-label">{{ tr('lastEdit') }}</span>
                  <span class="time-val">
                    {{ selectedVehicle.updatedAt ? formatDate(selectedVehicle.updatedAt) : tr('noChanges') }}
                  </span>
                </div>
              </div>
            </div>

            <div class="pane-body">
              <div class="input-row">
                <div class="input-block flex-2">
                  <label>{{ tr('plate') }}</label>
                  <input v-model="editForm.plateNumber" type="text" />
                </div>
                <div class="input-block flex-1">
                  <label>{{ tr('status') }}</label>
                  <select v-model="editForm.status">
                    <option value="AVAILABLE">{{ formatStatusLabel('AVAILABLE') }}</option>
                    <option value="RESERVED">{{ formatStatusLabel('RESERVED') }}</option>
                    <option value="RENTED">{{ formatStatusLabel('RENTED') }}</option>
                    <option value="MAINTENANCE">{{ formatStatusLabel('MAINTENANCE') }}</option>
                    <option value="INACTIVE">{{ formatStatusLabel('INACTIVE') }}</option>
                  </select>
                </div>
              </div>

              <div class="input-row">
                <div class="input-block flex-1">
                  <label>{{ tr('brand') }}</label>
                  <input v-model="editForm.brand" type="text" />
                </div>
                <div class="input-block flex-1">
                  <label>{{ tr('model') }}</label>
                  <input v-model="editForm.model" type="text" />
                </div>
              </div>

              <div class="input-row">
                <div class="input-block flex-1">
                  <label>{{ tr('dailyRate') }}</label>
                  <input v-model.number="editForm.dailyRate" type="number" min="0.01" step="0.01" />
                </div>
                <div class="input-block flex-1">
                  <label>{{ tr('odometer') }}</label>
                  <input v-model.number="editForm.odometerKm" type="number" min="0" />
                </div>
              </div>
            </div>

            <footer class="pane-footer">
              <button @click="updateVehicle" class="btn btn-save" :disabled="submitting">
                {{ submitting ? tr('processing') : tr('updateData') }}
              </button>
              <button
                @click="deleteVehicle"
                class="btn btn-danger"
                :disabled="!canDeleteVehicle()"
              >
                {{ tr('removeVehicle') }}
              </button>
              <button @click="selectedVehicle = null" class="btn btn-ghost">{{ tr('close') }}</button>
            </footer>

            <p v-if="!canDeleteVehicle()" class="feature-reason" style="margin-top: 10px;">
              {{ tr('itDeleteOnly') }}
            </p>
          </div>

          <div v-else class="empty-state">
            <div class="empty-content">
              <div class="empty-icon">🚙</div>
              <h3>{{ tr('pendingSelection') }}</h3>
              <p>{{ tr('pendingSelectionDescription') }}</p>
            </div>
          </div>
        </transition>
      </main>
    </div>

    <transition name="toast">
      <div v-if="toast.show" :class="['toast', toast.type]">
        {{ toast.text }}
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'
import { getDateLocale, getLocaleState } from '../services/i18n'

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:3000'

const TRANSLATIONS = {
  pt: {
    title: 'Gestao de Veiculos',
    subtitle: 'Edicao operacional de viaturas e respetivo estado.',
    vehiclesCount: '{count} Veiculos',
    shortcutHint: 'Ctrl+K para filtrar',
    filterPlaceholder: 'Filtrar por matricula, marca ou modelo...',
    clear: 'Limpar',
    vehicleRecord: 'Ficha de Veiculo',
    created: 'Criacao',
    lastEdit: 'Ultima Edicao',
    noChanges: 'Sem alteracoes',
    plate: 'Matricula',
    status: 'Estado',
    brand: 'Marca',
    model: 'Modelo',
    dailyRate: 'Preco Diario (EUR)',
    odometer: 'Quilometragem',
    processing: 'A processar...',
    updateData: 'Atualizar Dados',
    removeVehicle: 'Remover Veiculo',
    close: 'Fechar',
    itDeleteOnly: 'Apenas o perfil IT pode eliminar veiculos.',
    pendingSelection: 'Selecao Pendente',
    pendingSelectionDescription: 'Selecione um veiculo na lista lateral para visualizar ou editar.',
    serverConnectionError: 'Erro na ligacao ao servidor.',
    filterError: 'Erro ao filtrar veiculos.',
    selectVehicleToEdit: 'Selecione um veiculo para editar.',
    invalidDailyRate: 'Preco diario invalido.',
    invalidOdometer: 'Quilometragem invalida: deve ser >= 0.',
    partialUpdate: 'Atualizacao parcial: {warnings}',
    updateSuccess: 'Dados atualizados com sucesso.',
    updateError: 'Erro ao atualizar veiculo.',
    deleteForbidden: 'Apenas o perfil IT pode eliminar veiculos.',
    confirmDelete: 'Confirmar a remocao permanente deste veiculo?',
    deleteSuccess: 'Veiculo removido do sistema.',
    deleteError: 'Erro ao remover veiculo.',
    statusAVAILABLE: 'Disponivel',
    statusRESERVED: 'Reservado',
    statusRENTED: 'Em Aluguer',
    statusMAINTENANCE: 'Manutencao',
    statusINACTIVE: 'Inativo',
  },
  en: {
    title: 'Vehicle Management',
    subtitle: 'Operational editing of vehicles and current status.',
    vehiclesCount: '{count} Vehicles',
    shortcutHint: 'Ctrl+K to filter',
    filterPlaceholder: 'Filter by plate, brand or model...',
    clear: 'Clear',
    vehicleRecord: 'Vehicle Record',
    created: 'Created',
    lastEdit: 'Last Edit',
    noChanges: 'No changes',
    plate: 'Plate',
    status: 'Status',
    brand: 'Brand',
    model: 'Model',
    dailyRate: 'Daily Rate (EUR)',
    odometer: 'Mileage',
    processing: 'Processing...',
    updateData: 'Update Data',
    removeVehicle: 'Remove Vehicle',
    close: 'Close',
    itDeleteOnly: 'Only IT profile can delete vehicles.',
    pendingSelection: 'Pending Selection',
    pendingSelectionDescription: 'Select a vehicle from the side list to view or edit.',
    serverConnectionError: 'Server connection error.',
    filterError: 'Error filtering vehicles.',
    selectVehicleToEdit: 'Select a vehicle to edit.',
    invalidDailyRate: 'Invalid daily rate.',
    invalidOdometer: 'Invalid mileage: must be >= 0.',
    partialUpdate: 'Partial update: {warnings}',
    updateSuccess: 'Data updated successfully.',
    updateError: 'Error updating vehicle.',
    deleteForbidden: 'Only IT profile can delete vehicles.',
    confirmDelete: 'Confirm permanent removal of this vehicle?',
    deleteSuccess: 'Vehicle removed from the system.',
    deleteError: 'Error removing vehicle.',
    statusAVAILABLE: 'Available',
    statusRESERVED: 'Reserved',
    statusRENTED: 'Rented',
    statusMAINTENANCE: 'Maintenance',
    statusINACTIVE: 'Inactive',
  },
  es: {
    title: 'Gestion de Vehiculos',
    subtitle: 'Edicion operativa de vehiculos y su estado actual.',
    vehiclesCount: '{count} Vehiculos',
    shortcutHint: 'Ctrl+K para filtrar',
    filterPlaceholder: 'Filtrar por matricula, marca o modelo...',
    clear: 'Limpiar',
    vehicleRecord: 'Ficha de Vehiculo',
    created: 'Creacion',
    lastEdit: 'Ultima Edicion',
    noChanges: 'Sin cambios',
    plate: 'Matricula',
    status: 'Estado',
    brand: 'Marca',
    model: 'Modelo',
    dailyRate: 'Precio Diario (EUR)',
    odometer: 'Kilometraje',
    processing: 'Procesando...',
    updateData: 'Actualizar Datos',
    removeVehicle: 'Eliminar Vehiculo',
    close: 'Cerrar',
    itDeleteOnly: 'Solo el perfil IT puede eliminar vehiculos.',
    pendingSelection: 'Seleccion Pendiente',
    pendingSelectionDescription: 'Seleccione un vehiculo en la lista lateral para ver o editar.',
    serverConnectionError: 'Error de conexion al servidor.',
    filterError: 'Error al filtrar vehiculos.',
    selectVehicleToEdit: 'Seleccione un vehiculo para editar.',
    invalidDailyRate: 'Precio diario invalido.',
    invalidOdometer: 'Kilometraje invalido: debe ser >= 0.',
    partialUpdate: 'Actualizacion parcial: {warnings}',
    updateSuccess: 'Datos actualizados con exito.',
    updateError: 'Error al actualizar vehiculo.',
    deleteForbidden: 'Solo el perfil IT puede eliminar vehiculos.',
    confirmDelete: 'Confirmar la eliminacion permanente de este vehiculo?',
    deleteSuccess: 'Vehiculo eliminado del sistema.',
    deleteError: 'Error al eliminar vehiculo.',
    statusAVAILABLE: 'Disponible',
    statusRESERVED: 'Reservado',
    statusRENTED: 'En Alquiler',
    statusMAINTENANCE: 'Mantenimiento',
    statusINACTIVE: 'Inactivo',
  },
}

export default {
  name: 'ManageVehicle',
  props: {
    sessionToken: {
      type: String,
      default: '',
    },
    sessionUserRole: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      vehicles: [],
      selectedVehicle: null,
      searchTerm: '',
      searchDebounceTimer: null,
      submitting: false,
      toast: { show: false, text: '', type: '' },
      localeState: getLocaleState(),
      editForm: {
        plateNumber: '',
        brand: '',
        model: '',
        dailyRate: 0,
        status: 'AVAILABLE',
        odometerKm: 0,
      },
    }
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
    formatStatusLabel(status) {
      return this.tr(`status${status}`)
    },
    buildAuthConfig() {
      if (!this.sessionToken) {
        return {}
      }

      return {
        headers: {
          Authorization: `Bearer ${this.sessionToken}`,
        },
      }
    },
    canDeleteVehicle() {
      return this.sessionUserRole === 'IT'
    },
    extractApiError(err, fallbackMessage) {
      const details = err?.response?.data?.details
      if (Array.isArray(details) && details.length > 0) {
        return details.join(' | ')
      }

      const apiMessage =
        err?.response?.data?.message || err?.response?.data?.error || err?.message

      if (Array.isArray(apiMessage)) {
        return apiMessage.join(' | ')
      }

      return apiMessage || fallbackMessage
    },
    async loadVehicles() {
      try {
        const response = await axios.get(`${API_BASE_URL}/vehicles`, this.buildAuthConfig())
        this.vehicles = response.data

        if (!this.selectedVehicle && this.vehicles.length > 0) {
          this.selectVehicle(this.vehicles[0])
        }
      } catch (err) {
        this.showToast(this.extractApiError(err, this.tr('serverConnectionError')), 'error')
      }
    },
    selectVehicle(vehicle) {
      this.selectedVehicle = vehicle
      this.editForm = {
        plateNumber: vehicle.plateNumber,
        brand: vehicle.brand,
        model: vehicle.model,
        dailyRate: vehicle.dailyRate,
        status: vehicle.status,
        odometerKm: vehicle.odometerKm || 0,
      }
    },
    handleSearchInput() {
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer)
      }

      this.searchDebounceTimer = setTimeout(() => {
        this.handleSearch()
      }, 250)
    },
    async handleSearch() {
      const url = this.searchTerm
        ? `${API_BASE_URL}/vehicles/search/${this.searchTerm}`
        : `${API_BASE_URL}/vehicles`

      try {
        const response = await axios.get(url, this.buildAuthConfig())
        this.vehicles = response.data

        if (
          this.selectedVehicle &&
          !this.vehicles.some((vehicle) => vehicle.id === this.selectedVehicle.id)
        ) {
          this.selectedVehicle = null
        }
      } catch (err) {
        this.showToast(this.extractApiError(err, this.tr('filterError')), 'error')
      }
    },
    clearSearch() {
      this.searchTerm = ''
      this.handleSearch()
      this.$nextTick(() => {
        this.$refs.searchInput?.focus()
      })
    },
    handleGlobalShortcut(event) {
      const isFilterShortcut = event.ctrlKey && event.key.toLowerCase() === 'k'
      if (!isFilterShortcut) {
        return
      }

      event.preventDefault()
      this.$refs.searchInput?.focus()
    },
    async updateVehicle() {
      if (!this.selectedVehicle?.id) {
        this.showToast(this.tr('selectVehicleToEdit'), 'error')
        return
      }

      if (!this.editForm.dailyRate || this.editForm.dailyRate <= 0) {
        this.showToast(this.tr('invalidDailyRate'), 'error')
        return
      }

      if ((this.editForm.odometerKm || 0) < 0) {
        this.showToast(this.tr('invalidOdometer'), 'error')
        return
      }

      this.submitting = true
      try {
        const response = await axios.put(
          `${API_BASE_URL}/vehicles/${this.selectedVehicle.id}`,
          this.editForm,
          this.buildAuthConfig(),
        )
        this.selectedVehicle = response.data

        if (
          Array.isArray(response.data?.partialWarnings) &&
          response.data.partialWarnings.length > 0
        ) {
          this.showToast(
            this.tr('partialUpdate', { warnings: response.data.partialWarnings.join(' | ') }),
            'error',
          )
        } else {
          this.showToast(this.tr('updateSuccess'), 'success')
        }

        this.loadVehicles()
      } catch (err) {
        this.showToast(this.extractApiError(err, this.tr('updateError')), 'error')
      } finally {
        this.submitting = false
      }
    },
    async deleteVehicle() {
      if (!this.canDeleteVehicle()) {
        this.showToast(this.tr('deleteForbidden'), 'error')
        return
      }

      if (confirm(this.tr('confirmDelete'))) {
        try {
          await axios.delete(
            `${API_BASE_URL}/vehicles/${this.selectedVehicle.id}`,
            this.buildAuthConfig(),
          )
          this.showToast(this.tr('deleteSuccess'), 'success')
          this.selectedVehicle = null
          this.loadVehicles()
        } catch (err) {
          this.showToast(this.extractApiError(err, this.tr('deleteError')), 'error')
        }
      }
    },
    formatDate(value) {
      if (!value) {
        return null
      }

      return new Date(value).toLocaleDateString(getDateLocale(), {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    showToast(text, type) {
      this.toast = { show: true, text, type }
      setTimeout(() => (this.toast.show = false), 3000)
    },
  },
  mounted() {
    this.loadVehicles()
    window.addEventListener('keydown', this.handleGlobalShortcut)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleGlobalShortcut)
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer)
    }
  },
}
</script>

<style scoped src="../styles/manage-station.css"></style>