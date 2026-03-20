<template>
  <div class="dark-viewport-manage">
    <header class="dashboard-header">
      <div class="title-section">
        <h1>Gestão de Infraestrutura</h1>
        <p>Monitorização e edição de unidades da rede operacional.</p>
      </div>
      
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="Filtrar por nome ou ID..." 
          @input="handleSearch"
        />
      </div>
    </header>

    <div class="main-layout">
      <aside class="sidebar-list">
        <div class="list-status">
          <span>{{ stations.length }} Unidades Ativas</span>
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
              <span class="capacity-tag">{{ station.capacity }} Vagas</span>
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

export default {
  name: 'ManageStation',
  data() {
    return {
      stations: [],
      selectedStation: null,
      searchTerm: '',
      submitting: false,
      toast: { show: false, text: '', type: '' },
      editForm: { name: '', location: '', capacity: 0 }
    };
  },
  methods: {
    async loadStations() {
      try {
        const res = await axios.get('http://localhost:3000/stations');
        this.stations = res.data;
      } catch (err) {
        this.showToast('Erro na ligação ao servidor.', 'error');
      }
    },
    selectStation(station) {
      this.selectedStation = station;
      this.editForm = { ...station };
    },
    async handleSearch() {
      const url = this.searchTerm 
        ? `http://localhost:3000/stations/search/${this.searchTerm}` 
        : 'http://localhost:3000/stations';
      const res = await axios.get(url);
      this.stations = res.data;
    },
    async updateStation() {
      this.submitting = true;
      try {
        const res = await axios.put(`http://localhost:3000/stations/${this.selectedStation.id}`, this.editForm);
        // Atualiza a estação selecionada com os novos dados (incluindo updatedAt do servidor)
        this.selectedStation = res.data;
        this.showToast('Dados atualizados com sucesso.', 'success');
        this.loadStations();
      } catch (err) {
        this.showToast('Erro ao atualizar registo.', 'error');
      } finally {
        this.submitting = false;
      }
    },
    async deleteStation() {
      if (confirm("Confirmar a remoção permanente desta unidade?")) {
        try {
          await axios.delete(`http://localhost:3000/stations/${this.selectedStation.id}`);
          this.showToast('Unidade removida do sistema.', 'success');
          this.selectedStation = null;
          this.loadStations();
        } catch (err) {
          this.showToast('Erro ao remover unidade.', 'error');
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
  mounted() { this.loadStations(); }
};
</script>

<style scoped>
/* Estética Dark Professional Otimizada */
.dark-viewport-manage {
  min-height: 100vh;
  background-color: #0b0f1a;
  color: #f1f5f9;
  font-family: 'Inter', sans-serif;
  padding: 30px;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding-bottom: 20px;
}

.title-section h1 { font-size: 1.5rem; font-weight: 700; margin: 0; color: #fff; }
.title-section p { font-size: 0.85rem; color: #64748b; margin-top: 5px; }

.search-box {
  background: #161d2f;
  border: 1px solid #2d3748;
  border-radius: 8px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  width: 320px;
}

.search-icon { margin-right: 12px; opacity: 0.5; }
.search-box input {
  background: transparent;
  border: none;
  color: #fff;
  outline: none;
  width: 100%;
  font-size: 0.9rem;
}

.main-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 30px;
  flex: 1;
  height: calc(100vh - 160px);
}

.sidebar-list {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.list-status {
  padding: 15px 20px;
  background: rgba(255,255,255,0.03);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #64748b;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.scroll-area { flex: 1; overflow-y: auto; padding: 15px; }

.station-card {
  padding: 15px;
  border-radius: 8px;
  background: #161d2f;
  border: 1px solid #2d3748;
  margin-bottom: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.station-card:hover { border-color: #3b82f6; background: #1a2337; }
.station-card.active { border-color: #3b82f6; background: #1e293b; box-shadow: 0 0 0 1px #3b82f6; }

.card-lead { display: flex; justify-content: space-between; margin-bottom: 8px; }
.station-id { font-size: 0.7rem; font-weight: 800; color: #475569; }
.capacity-tag { font-size: 0.7rem; color: #3b82f6; font-weight: 700; background: rgba(59, 130, 246, 0.1); padding: 2px 8px; border-radius: 4px; }
.station-name { font-size: 1rem; margin: 0; color: #f1f5f9; font-weight: 600; }
.station-loc { font-size: 0.8rem; color: #64748b; display: block; margin-top: 4px; }

.details-view {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  overflow-y: auto;
}

.editor-pane { padding: 40px; min-height: 100%; display: flex; flex-direction: column; }

.pane-header {
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding-bottom: 25px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.meta-label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; }
.pane-header h2 { margin: 5px 0 0; font-size: 1.8rem; color: #fff; }

/* Estilo para as datas */
.timestamps { display: flex; gap: 30px; }
.time-item { display: flex; flex-direction: column; }
.time-label { font-size: 0.65rem; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 4px; }
.time-val { font-size: 0.85rem; color: #94a3b8; }
.highlight-time .time-val { color: #3b82f6; font-weight: 500; }

.pane-body { flex: 1; display: flex; flex-direction: column; gap: 25px; }
.input-row { display: flex; gap: 20px; }
.flex-2 { flex: 2; }
.flex-1 { flex: 1; }

.input-block { display: flex; flex-direction: column; gap: 8px; }
.input-block label { font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; }
.input-block input {
  background: #161d2f;
  border: 1px solid #2d3748;
  border-radius: 6px;
  padding: 12px 16px;
  color: #fff;
  font-size: 1rem;
  transition: 0.2s;
}

.input-block input:focus { border-color: #3b82f6; outline: none; background: #1a2337; }

.pane-footer {
  margin-top: 50px;
  padding-top: 25px;
  border-top: 1px solid rgba(255,255,255,0.05);
  display: flex;
  gap: 15px;
}

.btn { padding: 14px 24px; border-radius: 6px; font-weight: 700; cursor: pointer; border: none; font-size: 0.9rem; transition: 0.2s; }
.btn-save { background: #3b82f6; color: #fff; flex: 2; }
.btn-save:hover { background: #2563eb; }
.btn-danger { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }
.btn-danger:hover { background: #ef4444; color: #fff; }
.btn-ghost { background: transparent; color: #64748b; border: 1px solid #2d3748; }

.empty-state { height: 100%; display: flex; align-items: center; justify-content: center; color: #475569; }
.empty-content { text-align: center; max-width: 300px; }
.empty-icon { font-size: 3rem; margin-bottom: 20px; opacity: 0.2; }

.toast { position: fixed; bottom: 30px; right: 30px; padding: 15px 25px; border-radius: 8px; font-weight: 600; z-index: 1000; }
.toast.success { background: #059669; color: #fff; }
.toast.error { background: #dc2626; color: #fff; }

.fade-fast-enter-active { transition: all 0.2s ease; }
.fade-fast-enter { opacity: 0; transform: translateY(5px); }
</style>