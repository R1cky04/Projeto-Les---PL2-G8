<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <h1><span>Rent-a-Car</span> Management</h1>
        </div>
        <div class="nav-menu">
          <button
            @click="currentView = 'create'"
            class="nav-btn"
            :class="{ active: currentView === 'create' }"
          >
            Criar Estação
          </button>
          <button
            @click="currentView = 'manage'"
            class="nav-btn"
            :class="{ active: currentView === 'manage' }"
          >
            Gerir Estações
          </button>
        </div>
      </div>
    </nav>

    <div class="app-content">
      <CreateStation v-if="currentView === 'create'" />
      <ManageStation v-if="currentView === 'manage'" />
    </div>
  </div>
</template>

<script>
import CreateStation from './components/CreateStation.vue';
import ManageStation from './components/ManageStation.vue';

export default {
  name: 'App',
  components: {
    CreateStation,
    ManageStation,
  },
  data() {
    return {
      currentView: 'manage',
    };
  },
};
</script>

<style>
/* Reset Global */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  background-color: #0b0f1a; /* Matching com o fundo das páginas */
  min-height: 100vh;
}

/**
 * Barra de navegação - Sincronizada com o Tema Dark Blue
 */
.navbar {
  background-color: #0f172a; /* Azul profundo profissional */
  color: white;
  padding: 0;
  border-bottom: 1px solid rgba(56, 189, 248, 0.15); /* Linha subtil azul */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
}

.nav-brand h1 {
  font-size: 1.4rem;
  margin: 0;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #f8fafc;
}

/* Destaque no nome para combinar com os botões das páginas */
.nav-brand h1 span {
  color: #38bdf8;
}

.nav-menu {
  display: flex;
  gap: 15px;
}

.nav-btn {
  padding: 10px 22px;
  background-color: rgba(255, 255, 255, 0.03);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-size: 0.95em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-btn:hover {
  background-color: rgba(56, 189, 248, 0.08);
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.3);
  transform: translateY(-1px);
}

/* Estado Ativo: Segue o estilo do botão principal das páginas */
.nav-btn.active {
  background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
}

.nav-btn.active:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
}

/**
 * Conteúdo principal
 */
.app-content {
  min-height: calc(100vh - 75px);
  /* Removido o padding exagerado para não criar scroll desnecessário */
}

/* Responsividade Corrigida */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 15px;
    padding: 20px;
  }
  .nav-menu {
    width: 100%;
    justify-content: center;
  }
}
</style>