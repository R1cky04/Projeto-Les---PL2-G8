<template>
  <div class="dark-viewport-manage">
    <header class="dashboard-header">
      <div class="title-section">
        <h1>Gestão de Infraestrutura</h1>
        <p>Monitorização e edição de unidades da rede operacional.</p>
      </div>
    </header>

    <div class="main-layout">
      <aside class="sidebar-list">
        <div class="list-status">
          <span>{{ stations.length }} Unidades Ativas</span>
          <span class="status-hint">Ctrl+K para filtrar</span>
        </div>

        <div class="filter-sticky">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              ref="searchInput"
              v-model="searchTerm"
              type="text"
              placeholder="Filtrar por nome ou ID..."
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
            v-for="station in stations" 
            :key="station.id" 
            :class="['station-card', { active: selectedStation?.id === station.id }]"
            @click="selectStation(station)"
          >
            <div class="card-lead">
              <span class="station-id">ID: {{ station.id }}</span>
              <span class="capacity-tag">{{ station.allocatedVehicles || 0 }}/{{ station.capacity }} Vagas</span>
            </div>
            <h3 class="station-name">{{ station.name }}</h3>
            <span class="station-loc">{{ station.location }}</span>
          </div>
        </div>
      </aside>

      <main class="details-view">
        <transition name="fade-fast" mode="out-in">
          <div v-if="selectedStation" :key="selectedStation.id" class="editor-pane">
            
            <div class="pane-header">
              <div class="header-main">
                <span class="meta-label">Ficha de Unidade</span>
                <h2>{{ selectedStation.name }}</h2>
              </div>
              
              <div class="timestamps">
                <div class="time-item">
                  <span class="time-label">Criação</span>
                  <span class="time-val">{{ formatDate(selectedStation.createdAt) }}</span>
                </div>
                <div class="time-item highlight-time">
                  <span class="time-label">Última Edição</span>
                  <span class="time-val">
                    {{ selectedStation.updatedAt ? formatDate(selectedStation.updatedAt) : 'Sem alterações' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="pane-body">
              <div class="input-row">
                <div class="input-block flex-2">
                  <label>Designação Oficial</label>
                  <input v-model="editForm.name" type="text" />
                </div>
                <div class="input-block flex-1">
                  <label>Lotação Máxima</label>
                  <input v-model.number="editForm.capacity" type="number" />
                </div>
              </div>

              <div class="input-block">
                <label>Coordenadas / Localização</label>
                <input v-model="editForm.location" type="text" />
              </div>

              <div class="input-block flex-1">
                <label>Veículos Alocados</label>
                <input v-model.number="editForm.allocatedVehicles" type="number" min="0" />
              </div>
            </div>

            <footer class="pane-footer">
              <button @click="updateStation" class="btn btn-save" :disabled="submitting">
                {{ submitting ? 'A processar...' : 'Atualizar Dados' }}
              </button>
              <button @click="deleteStation" class="btn btn-danger">
                Remover Unidade
              </button>
              <button @click="selectedStation = null" class="btn btn-ghost">Fechar</button>
            </footer>
          </div>

          <div v-else class="empty-state">
            <div class="empty-content">
              <div class="empty-icon">📂</div>
              <h3>Seleção Pendente</h3>
              <p>Selecione uma estação na lista lateral para visualizar ou editar os parâmetros técnicos.</p>
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
import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:3000';

export default {
  name: 'ManageStation',
  props: {
    sessionToken: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      stations: [],
      selectedStation: null,
      searchTerm: '',
      searchDebounceTimer: null,
      submitting: false,
      toast: { show: false, text: '', type: '' },
      editForm: { name: '', location: '', capacity: 0, allocatedVehicles: 0 }
    };
  },
  methods: {
    buildAuthConfig() {
      if (!this.sessionToken) {
        return {};
      }

      return {
        headers: {
          Authorization: `Bearer ${this.sessionToken}`,
        },
      };
    },
    extractApiError(err, fallbackMessage) {
      const details = err?.response?.data?.details;
      if (Array.isArray(details) && details.length > 0) {
        return details.join(' | ');
      }

      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;

      if (Array.isArray(apiMessage)) {
        return apiMessage.join(' | ');
      }

      return apiMessage || fallbackMessage;
    },
    async loadStations() {
      try {
        const res = await axios.get(`${API_BASE_URL}/stations`, this.buildAuthConfig());
        this.stations = res.data;

        if (!this.selectedStation && this.stations.length > 0) {
          this.selectStation(this.stations[0]);
        }
      } catch (err) {
        this.showToast(this.extractApiError(err, 'Erro na ligação ao servidor.'), 'error');
      }
    },
    selectStation(station) {
      this.selectedStation = station;
      this.editForm = {
        ...station,
        allocatedVehicles: station?.allocatedVehicles || 0,
      };
    },
    handleSearchInput() {
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }

      this.searchDebounceTimer = setTimeout(() => {
        this.handleSearch();
      }, 250);
    },
    async handleSearch() {
      const url = this.searchTerm 
        ? `${API_BASE_URL}/stations/search/${this.searchTerm}` 
        : `${API_BASE_URL}/stations`;
      try {
        const res = await axios.get(url, this.buildAuthConfig());
        this.stations = res.data;

        if (
          this.selectedStation &&
          !this.stations.some((station) => station.id === this.selectedStation.id)
        ) {
          this.selectedStation = null;
        }
      } catch (err) {
        this.showToast(this.extractApiError(err, 'Erro ao filtrar estacoes.'), 'error');
      }
    },
    clearSearch() {
      this.searchTerm = '';
      this.handleSearch();
      this.$nextTick(() => {
        this.$refs.searchInput?.focus();
      });
    },
    handleGlobalShortcut(event) {
      const isFilterShortcut = event.ctrlKey && event.key.toLowerCase() === 'k';

      if (!isFilterShortcut) {
        return;
      }

      event.preventDefault();
      this.$refs.searchInput?.focus();
    },
    async updateStation() {
      if (!this.selectedStation?.id) {
        this.showToast('Selecione uma estacao para editar.', 'error');
        return;
      }

      if (this.editForm.capacity <= 0) {
        this.showToast('Capacidade invalida: deve ser maior que zero.', 'error');
        return;
      }

      if ((this.editForm.allocatedVehicles || 0) < 0) {
        this.showToast('Veiculos alocados invalidos: deve ser >= 0.', 'error');
        return;
      }

      if ((this.editForm.allocatedVehicles || 0) > this.editForm.capacity) {
        this.showToast('Veiculos alocados nao podem exceder a capacidade.', 'error');
        return;
      }

      this.submitting = true;
      try {
        const res = await axios.put(
          `${API_BASE_URL}/stations/${this.selectedStation.id}`,
          this.editForm,
          this.buildAuthConfig(),
        );
        // Atualiza a estação selecionada com os novos dados (incluindo updatedAt do servidor)
        this.selectedStation = res.data;
        if (Array.isArray(res.data?.partialWarnings) && res.data.partialWarnings.length > 0) {
          this.showToast(`Atualizacao parcial: ${res.data.partialWarnings.join(' | ')}`, 'error');
        } else {
          this.showToast('Dados atualizados com sucesso.', 'success');
        }
        this.loadStations();
      } catch (err) {
        this.showToast(this.extractApiError(err, 'Erro ao atualizar registo.'), 'error');
      } finally {
        this.submitting = false;
      }
    },
    async deleteStation() {
      if (confirm("Confirmar a remoção permanente desta unidade?")) {
        try {
          await axios.delete(
            `${API_BASE_URL}/stations/${this.selectedStation.id}`,
            this.buildAuthConfig(),
          );
          this.showToast('Unidade removida do sistema.', 'success');
          this.selectedStation = null;
          this.loadStations();
        } catch (err) {
          this.showToast(this.extractApiError(err, 'Erro ao remover unidade.'), 'error');
        }
      }
    },
    formatDate(ds) {
      if (!ds) return null;
      return new Date(ds).toLocaleDateString('pt-PT', { 
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
    },
    showToast(text, type) {
      this.toast = { show: true, text, type };
      setTimeout(() => this.toast.show = false, 3000);
    }
  },
  mounted() {
    this.loadStations();
    window.addEventListener('keydown', this.handleGlobalShortcut);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleGlobalShortcut);
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
  }
};
</script>

<style scoped src="../styles/components/manage-station.css"></style>
