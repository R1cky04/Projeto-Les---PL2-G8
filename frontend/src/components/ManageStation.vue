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
          <span>{{ tr('activeUnits', { count: stations.length }) }}</span>
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
            v-for="station in stations" 
            :key="station.id" 
            :class="['station-card', { active: selectedStation?.id === station.id }]"
            @click="selectStation(station)"
          >
            <div class="card-lead">
              <span class="station-id">ID: {{ station.id }}</span>
              <span class="capacity-tag">{{ tr('slots', { used: station.allocatedVehicles || 0, total: station.capacity }) }}</span>
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
                <span class="meta-label">{{ tr('unitRecord') }}</span>
                <h2>{{ selectedStation.name }}</h2>
              </div>
              
              <div class="timestamps">
                <div class="time-item">
                  <span class="time-label">{{ tr('created') }}</span>
                  <span class="time-val">{{ formatDate(selectedStation.createdAt) }}</span>
                </div>
                <div class="time-item highlight-time">
                  <span class="time-label">{{ tr('lastEdit') }}</span>
                  <span class="time-val">
                    {{ selectedStation.updatedAt ? formatDate(selectedStation.updatedAt) : tr('noChanges') }}
                  </span>
                </div>
              </div>
            </div>

            <div class="pane-body">
              <div class="input-row">
                <div class="input-block flex-2">
                  <label>{{ tr('officialName') }}</label>
                  <input v-model="editForm.name" type="text" />
                </div>
                <div class="input-block flex-1">
                  <label>{{ tr('maxCapacity') }}</label>
                  <input v-model.number="editForm.capacity" type="number" />
                </div>
              </div>

              <div class="input-block">
                <label>{{ tr('coordinatesLocation') }}</label>
                <input v-model="editForm.location" type="text" />
              </div>

              <div class="input-block flex-1">
                <label>{{ tr('allocatedVehicles') }}</label>
                <input v-model.number="editForm.allocatedVehicles" type="number" min="0" />
              </div>
            </div>

            <footer class="pane-footer">
              <button @click="updateStation" class="btn btn-save" :disabled="submitting">
                {{ submitting ? tr('processing') : tr('updateData') }}
              </button>
              <button @click="deleteStation" class="btn btn-danger">
                {{ tr('removeUnit') }}
              </button>
              <button @click="selectedStation = null" class="btn btn-ghost">{{ tr('close') }}</button>
            </footer>
          </div>

          <div v-else class="empty-state">
            <div class="empty-content">
              <div class="empty-icon">📂</div>
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
import axios from 'axios';
import { getDateLocale, getLocaleState } from '../services/i18n';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:3000';

const TRANSLATIONS = {
  pt: {
    title: 'Gestao de Infraestrutura', subtitle: 'Monitorizacao e edicao de unidades da rede operacional.',
    activeUnits: '{count} Unidades Ativas', shortcutHint: 'Ctrl+K para filtrar', filterPlaceholder: 'Filtrar por nome ou ID...', clear: 'Limpar',
    slots: '{used}/{total} Vagas', unitRecord: 'Ficha de Unidade', created: 'Criacao', lastEdit: 'Ultima Edicao', noChanges: 'Sem alteracoes',
    officialName: 'Designacao Oficial', maxCapacity: 'Lotacao Maxima', coordinatesLocation: 'Coordenadas / Localizacao', allocatedVehicles: 'Veiculos Alocados',
    processing: 'A processar...', updateData: 'Atualizar Dados', removeUnit: 'Remover Unidade', close: 'Fechar',
    pendingSelection: 'Selecao Pendente', pendingSelectionDescription: 'Selecione uma estacao na lista lateral para visualizar ou editar os parametros tecnicos.',
    serverConnectionError: 'Erro na ligacao ao servidor.', filterError: 'Erro ao filtrar estacoes.', selectStationToEdit: 'Selecione uma estacao para editar.',
    invalidCapacity: 'Capacidade invalida: deve ser maior que zero.', invalidAllocatedVehicles: 'Veiculos alocados invalidos: deve ser >= 0.',
    allocatedExceedsCapacity: 'Veiculos alocados nao podem exceder a capacidade.', partialUpdate: 'Atualizacao parcial: {warnings}', updateSuccess: 'Dados atualizados com sucesso.',
    updateError: 'Erro ao atualizar registo.', confirmDelete: 'Confirmar a remocao permanente desta unidade?', deleteSuccess: 'Unidade removida do sistema.', deleteError: 'Erro ao remover unidade.',
  },
  en: {
    title: 'Infrastructure Management', subtitle: 'Monitor and edit operational network units.',
    activeUnits: '{count} Active Units', shortcutHint: 'Ctrl+K to filter', filterPlaceholder: 'Filter by name or ID...', clear: 'Clear',
    slots: '{used}/{total} Slots', unitRecord: 'Unit Record', created: 'Created', lastEdit: 'Last Edit', noChanges: 'No changes',
    officialName: 'Official Name', maxCapacity: 'Maximum Capacity', coordinatesLocation: 'Coordinates / Location', allocatedVehicles: 'Allocated Vehicles',
    processing: 'Processing...', updateData: 'Update Data', removeUnit: 'Remove Unit', close: 'Close',
    pendingSelection: 'Pending Selection', pendingSelectionDescription: 'Select a station from the side list to view or edit technical parameters.',
    serverConnectionError: 'Server connection error.', filterError: 'Error while filtering stations.', selectStationToEdit: 'Select a station to edit.',
    invalidCapacity: 'Invalid capacity: must be greater than zero.', invalidAllocatedVehicles: 'Invalid allocated vehicles: must be >= 0.',
    allocatedExceedsCapacity: 'Allocated vehicles cannot exceed capacity.', partialUpdate: 'Partial update: {warnings}', updateSuccess: 'Data updated successfully.',
    updateError: 'Error updating record.', confirmDelete: 'Confirm permanent removal of this unit?', deleteSuccess: 'Unit removed from the system.', deleteError: 'Error removing unit.',
  },
  es: {
    title: 'Gestion de Infraestructura', subtitle: 'Monitorizacion y edicion de unidades de la red operativa.',
    activeUnits: '{count} Unidades Activas', shortcutHint: 'Ctrl+K para filtrar', filterPlaceholder: 'Filtrar por nombre o ID...', clear: 'Limpiar',
    slots: '{used}/{total} Plazas', unitRecord: 'Ficha de Unidad', created: 'Creacion', lastEdit: 'Ultima Edicion', noChanges: 'Sin cambios',
    officialName: 'Denominacion Oficial', maxCapacity: 'Capacidad Maxima', coordinatesLocation: 'Coordenadas / Ubicacion', allocatedVehicles: 'Vehiculos Asignados',
    processing: 'Procesando...', updateData: 'Actualizar Datos', removeUnit: 'Eliminar Unidad', close: 'Cerrar',
    pendingSelection: 'Seleccion Pendiente', pendingSelectionDescription: 'Seleccione una estacion en la lista lateral para ver o editar los parametros tecnicos.',
    serverConnectionError: 'Error de conexion al servidor.', filterError: 'Error al filtrar estaciones.', selectStationToEdit: 'Seleccione una estacion para editar.',
    invalidCapacity: 'Capacidad invalida: debe ser mayor que cero.', invalidAllocatedVehicles: 'Vehiculos asignados invalidos: debe ser >= 0.',
    allocatedExceedsCapacity: 'Los vehiculos asignados no pueden exceder la capacidad.', partialUpdate: 'Actualizacion parcial: {warnings}', updateSuccess: 'Datos actualizados con exito.',
    updateError: 'Error al actualizar el registro.', confirmDelete: 'Confirmar la eliminacion permanente de esta unidad?', deleteSuccess: 'Unidad eliminada del sistema.', deleteError: 'Error al eliminar la unidad.',
  },
};

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
      editForm: { name: '', location: '', capacity: 0, allocatedVehicles: 0 },
      localeState: getLocaleState(),
    };
  },
  methods: {
    tr(key, params = {}) {
      const locale = this.localeState.locale;
      const template = (TRANSLATIONS[locale] && TRANSLATIONS[locale][key]) || TRANSLATIONS.pt[key] || key;
      return Object.entries(params).reduce(
        (result, [paramKey, value]) => result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value)),
        template,
      );
    },
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
        this.showToast(this.extractApiError(err, this.tr('serverConnectionError')), 'error');
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
        this.showToast(this.extractApiError(err, this.tr('filterError')), 'error');
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
        this.showToast(this.tr('selectStationToEdit'), 'error');
        return;
      }

      if (this.editForm.capacity <= 0) {
        this.showToast(this.tr('invalidCapacity'), 'error');
        return;
      }

      if ((this.editForm.allocatedVehicles || 0) < 0) {
        this.showToast(this.tr('invalidAllocatedVehicles'), 'error');
        return;
      }

      if ((this.editForm.allocatedVehicles || 0) > this.editForm.capacity) {
        this.showToast(this.tr('allocatedExceedsCapacity'), 'error');
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
          this.showToast(this.tr('partialUpdate', { warnings: res.data.partialWarnings.join(' | ') }), 'error');
        } else {
          this.showToast(this.tr('updateSuccess'), 'success');
        }
        this.loadStations();
      } catch (err) {
        this.showToast(this.extractApiError(err, this.tr('updateError')), 'error');
      } finally {
        this.submitting = false;
      }
    },
    async deleteStation() {
      if (confirm(this.tr('confirmDelete'))) {
        try {
          await axios.delete(
            `${API_BASE_URL}/stations/${this.selectedStation.id}`,
            this.buildAuthConfig(),
          );
          this.showToast(this.tr('deleteSuccess'), 'success');
          this.selectedStation = null;
          this.loadStations();
        } catch (err) {
          this.showToast(this.extractApiError(err, this.tr('deleteError')), 'error');
        }
      }
    },
    formatDate(ds) {
      if (!ds) return null;
      return new Date(ds).toLocaleDateString(getDateLocale(), {
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

