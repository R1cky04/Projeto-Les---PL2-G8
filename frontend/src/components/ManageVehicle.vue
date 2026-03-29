<template>
  <div class="dark-viewport-manage">
    <header class="dashboard-header">
      <div class="title-section">
        <h1>Gestao de Veiculos</h1>
        <p>Edicao operacional de viaturas e respetivo estado.</p>
      </div>
    </header>

    <div class="main-layout">
      <aside class="sidebar-list">
        <div class="list-status">
          <span>{{ vehicles.length }} Veiculos</span>
          <span class="status-hint">Ctrl+K para filtrar</span>
        </div>

        <div class="filter-sticky">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              ref="searchInput"
              v-model="searchTerm"
              type="text"
              placeholder="Filtrar por matricula, marca ou modelo..."
              @input="handleSearchInput"
            />

            <button
              v-if="searchTerm"
              class="clear-search"
              type="button"
              @click="clearSearch"
            >
              Limpar
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
              <span class="capacity-tag">{{ vehicle.status }}</span>
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
                <span class="meta-label">Ficha de Veiculo</span>
                <h2>{{ selectedVehicle.plateNumber }}</h2>
              </div>

              <div class="timestamps">
                <div class="time-item">
                  <span class="time-label">Criacao</span>
                  <span class="time-val">{{ formatDate(selectedVehicle.createdAt) }}</span>
                </div>
                <div class="time-item highlight-time">
                  <span class="time-label">Ultima Edicao</span>
                  <span class="time-val">
                    {{ selectedVehicle.updatedAt ? formatDate(selectedVehicle.updatedAt) : 'Sem alteracoes' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="pane-body">
              <div class="input-row">
                <div class="input-block flex-2">
                  <label>Matricula</label>
                  <input v-model="editForm.plateNumber" type="text" />
                </div>
                <div class="input-block flex-1">
                  <label>Estado</label>
                  <select v-model="editForm.status">
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RESERVED">RESERVED</option>
                    <option value="RENTED">RENTED</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div class="input-row">
                <div class="input-block flex-1">
                  <label>Marca</label>
                  <input v-model="editForm.brand" type="text" />
                </div>
                <div class="input-block flex-1">
                  <label>Modelo</label>
                  <input v-model="editForm.model" type="text" />
                </div>
              </div>

              <div class="input-row">
                <div class="input-block flex-1">
                  <label>Preco Diario (EUR)</label>
                  <input v-model.number="editForm.dailyRate" type="number" min="0.01" step="0.01" />
                </div>
                <div class="input-block flex-1">
                  <label>Quilometragem</label>
                  <input v-model.number="editForm.odometerKm" type="number" min="0" />
                </div>
              </div>
            </div>

            <footer class="pane-footer">
              <button @click="updateVehicle" class="btn btn-save" :disabled="submitting">
                {{ submitting ? 'A processar...' : 'Atualizar Dados' }}
              </button>
              <button
                @click="deleteVehicle"
                class="btn btn-danger"
                :disabled="!canDeleteVehicle()"
              >
                Remover Veiculo
              </button>
              <button @click="selectedVehicle = null" class="btn btn-ghost">Fechar</button>
            </footer>

            <p v-if="!canDeleteVehicle()" class="feature-reason" style="margin-top: 10px;">
              Apenas o perfil IT pode eliminar veiculos.
            </p>
          </div>

          <div v-else class="empty-state">
            <div class="empty-content">
              <div class="empty-icon">🚙</div>
              <h3>Selecao Pendente</h3>
              <p>Selecione um veiculo na lista lateral para visualizar ou editar.</p>
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

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:3000'

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
        this.showToast(this.extractApiError(err, 'Erro na ligacao ao servidor.'), 'error')
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
        this.showToast(this.extractApiError(err, 'Erro ao filtrar veiculos.'), 'error')
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
        this.showToast('Selecione um veiculo para editar.', 'error')
        return
      }

      if (!this.editForm.dailyRate || this.editForm.dailyRate <= 0) {
        this.showToast('Preco diario invalido.', 'error')
        return
      }

      if ((this.editForm.odometerKm || 0) < 0) {
        this.showToast('Quilometragem invalida: deve ser >= 0.', 'error')
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
          this.showToast(`Atualizacao parcial: ${response.data.partialWarnings.join(' | ')}`, 'error')
        } else {
          this.showToast('Dados atualizados com sucesso.', 'success')
        }

        this.loadVehicles()
      } catch (err) {
        this.showToast(this.extractApiError(err, 'Erro ao atualizar veiculo.'), 'error')
      } finally {
        this.submitting = false
      }
    },
    async deleteVehicle() {
      if (!this.canDeleteVehicle()) {
        this.showToast('Apenas o perfil IT pode eliminar veiculos.', 'error')
        return
      }

      if (confirm('Confirmar a remocao permanente deste veiculo?')) {
        try {
          await axios.delete(
            `${API_BASE_URL}/vehicles/${this.selectedVehicle.id}`,
            this.buildAuthConfig(),
          )
          this.showToast('Veiculo removido do sistema.', 'success')
          this.selectedVehicle = null
          this.loadVehicles()
        } catch (err) {
          this.showToast(this.extractApiError(err, 'Erro ao remover veiculo.'), 'error')
        }
      }
    },
    formatDate(value) {
      if (!value) {
        return null
      }

      return new Date(value).toLocaleDateString('pt-PT', {
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