<template>
  <main class="app-shell">
    <section v-if="currentView === 'login'" class="panel login-window">
      <header class="top-header">
        <span class="top-header-title">UalgCar - Login</span>
        <button class="window-close" type="button" aria-label="Close app" @click="closeWindow">X</button>
      </header>

      <h1 class="login-title">Sign In</h1>
      <p class="login-subtitle">Enter your username and password.</p>

      <form class="login-form" autocomplete="off" @submit.prevent="handleLogin">
        <label for="username">Username</label>
        <input
          id="username"
          v-model="username"
          name="username"
          type="text"
          spellcheck="false"
          required
        />

        <label for="password">Password</label>
        <input id="password" v-model="password" name="password" type="password" required />

        <button class="login-button" type="submit">Login</button>
        <p class="login-message" :class="{ ok: isAuthenticated, error: !isAuthenticated && statusMessage }">
          {{ statusMessage }}
        </p>
      </form>
    </section>

    <section v-else-if="currentView === 'modules'" class="panel modules-window">
      <header class="top-header">
        <span class="top-header-title">UalgCar - Modules</span>
        <button class="window-close" type="button" aria-label="Close app" @click="closeWindow">X</button>
      </header>

      <header class="modules-header">
        <h1 class="modules-title">Modules</h1>
        <button class="logout-button" type="button" @click="logout">Logout</button>
      </header>

      <p class="modules-subtitle">Choose a module to continue.</p>

      <div class="modules-grid">
        <button
          v-for="module in modules"
          :key="module.key"
          type="button"
          class="module-card"
          :class="{ active: module.enabled }"
          :disabled="!module.enabled"
          @click="openModule(module)"
        >
          <span class="module-name">{{ module.name }}</span>
          <span class="module-status">{{ module.enabled ? 'Active' : 'Soon' }}</span>
        </button>
      </div>
    </section>

    <section v-else class="stations-window">
      <header class="top-header stations-toolbar">
        <span class="top-header-title">UalgCar - Stations</span>
        <div class="stations-actions">
          <button class="toolbar-button" type="button" @click="backToModules">Back</button>
          <button class="toolbar-button" type="button" @click="logout">Logout</button>
        </div>
      </header>

      <div class="stations-switch">
        <button
          type="button"
          class="switch-btn"
          :class="{ active: stationTab === 'create' }"
          @click="stationTab = 'create'"
        >
          Criar Estacao
        </button>
        <button
          type="button"
          class="switch-btn"
          :class="{ active: stationTab === 'manage' }"
          @click="stationTab = 'manage'"
        >
          Gerir Estacoes
        </button>
      </div>

      <div class="stations-content">
        <CreateStation v-if="stationTab === 'create'" />
        <ManageStation v-else />
      </div>
    </section>
  </main>
</template>

<script>
import { LOGIN_CREDENTIALS } from './config/loginCredentials'
import CreateStation from './components/CreateStation.vue'
import ManageStation from './components/ManageStation.vue'

export default {
  name: 'App',
  components: {
    CreateStation,
    ManageStation,
  },
  data() {
    return {
      username: '',
      password: '',
      isAuthenticated: false,
      statusMessage: '',
      currentView: 'login',
      stationTab: 'manage',
      modules: [
        { key: 'stations', name: 'Stations', enabled: true },
        { key: 'internal-users', name: 'Internal Users', enabled: false },
        { key: 'customers', name: 'Customers', enabled: false },
        { key: 'vehicles', name: 'Vehicles', enabled: false },
        { key: 'reservations', name: 'Reservations', enabled: false },
        { key: 'payments', name: 'Payments', enabled: false },
      ],
    }
  },
  methods: {
    handleLogin() {
      const matchesUser = this.username === LOGIN_CREDENTIALS.username
      const matchesPass = this.password === LOGIN_CREDENTIALS.password

      this.isAuthenticated = matchesUser && matchesPass
      this.statusMessage = this.isAuthenticated
        ? 'Login successful.'
        : 'Invalid username or password.'

      if (this.isAuthenticated) {
        this.currentView = 'modules'
      }
    },
    openModule(module) {
      if (!module.enabled) {
        return
      }

      if (module.key === 'stations') {
        this.currentView = 'stations'
      }
    },
    backToModules() {
      this.currentView = 'modules'
      this.stationTab = 'manage'
    },
    logout() {
      this.currentView = 'login'
      this.isAuthenticated = false
      this.password = ''
      this.statusMessage = ''
    },
    closeWindow() {
      if (typeof window !== 'undefined' && typeof window.close === 'function') {
        window.close()
      }
    },
  },
}
</script>

<style scoped>
:global(html),
:global(body),
:global(#app) {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}

.app-shell {
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: #ffffff;
}

.panel {
  position: relative;
  width: 400px;
  height: 400px;
  box-sizing: border-box;
  padding: 0;
  border: 1px solid rgba(16, 24, 40, 0.12);
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
  overflow: hidden;
  display: grid;
  grid-template-rows: 42px 1fr;
}

.top-header {
  height: 42px;
  background: #d1d5db;
  border-bottom: 1px solid #b8bec8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  -webkit-app-region: drag;
  user-select: none;
}

.top-header-title {
  color: #0f172a;
  font-size: 13px;
  font-weight: 700;
}

.window-close {
  width: 28px;
  height: 28px;
  border: 1px solid #9ca3af;
  border-radius: 6px;
  background: #e5e7eb;
  color: #111827;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  -webkit-app-region: no-drag;
}

.window-close:hover {
  background: #fecaca;
  border-color: #ef4444;
  color: #7f1d1d;
}

.login-window {
  align-content: start;
}

.login-window .login-title,
.login-window .login-subtitle,
.login-window .login-form {
  margin-left: 24px;
  margin-right: 24px;
}

.login-window .login-title {
  margin-top: 22px;
}

.login-title {
  margin: 0;
  font-size: 26px;
  letter-spacing: 0.02em;
  color: #0f172a;
  font-weight: 700;
}

.login-subtitle {
  margin: 8px 0 18px;
  color: #334155;
  font-size: 13px;
}

.login-form {
  height: auto;
  display: grid;
  grid-template-rows: auto auto auto auto auto auto;
  gap: 10px;
}

.login-form label {
  font-size: 12px;
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.login-form input {
  height: 42px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  background: #ffffff;
  color: #0f172a;
  outline: none;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.login-form input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
}

.login-button {
  margin-top: 8px;
  height: 42px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(90deg, #0891b2 0%, #0ea5e9 100%);
  color: #f8fafc;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
}

.login-button:hover {
  filter: brightness(1.05);
}

.login-message {
  margin: 4px 0 0;
  min-height: 18px;
  font-size: 12px;
  color: #475569;
}

.login-message.ok {
  color: #15803d;
}

.login-message.error {
  color: #b91c1c;
}

.modules-window {
  display: grid;
  grid-template-rows: 42px auto auto 1fr;
  gap: 12px;
}

.modules-header {
  margin: 6px 24px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modules-title {
  margin: 0;
  font-size: 24px;
  color: #0f172a;
}

.logout-button {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #334155;
  font-size: 12px;
  height: 30px;
  padding: 0 10px;
  cursor: pointer;
}

.modules-subtitle {
  margin: 0 24px;
  color: #475569;
  font-size: 12px;
}

.modules-grid {
  margin: 0 24px 18px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
  gap: 10px;
  min-height: 0;
}

.module-card {
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 6px;
  padding: 10px;
  text-align: left;
  cursor: not-allowed;
  color: #64748b;
}

.module-card.active {
  border-color: #0891b2;
  background: linear-gradient(180deg, rgba(14, 165, 233, 0.18) 0%, rgba(6, 182, 212, 0.22) 100%);
  color: #0f172a;
  cursor: pointer;
}

.module-name {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
}

.module-status {
  font-size: 11px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.stations-window {
  width: 100vw;
  height: 100vh;
  background: #f8fafc;
  display: grid;
  grid-template-rows: 42px auto 1fr;
}

.stations-toolbar {
  padding: 0 14px;
}

.stations-actions {
  display: flex;
  gap: 8px;
  -webkit-app-region: no-drag;
}

.toolbar-button {
  border: 1px solid #9ca3af;
  border-radius: 6px;
  background: #f3f4f6;
  color: #111827;
  font-size: 12px;
  font-weight: 600;
  height: 28px;
  padding: 0 10px;
  cursor: pointer;
}

.stations-switch {
  display: flex;
  gap: 10px;
  padding: 14px;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}

.switch-btn {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
  height: 34px;
  padding: 0 14px;
  cursor: pointer;
}

.switch-btn.active {
  border-color: #0891b2;
  background: #e0f2fe;
  color: #0c4a6e;
}

.stations-content {
  overflow: auto;
}

@media (max-width: 440px) {
  .panel {
    width: 96vw;
    height: 400px;
  }

  .modules-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, minmax(0, 1fr));
  }
}
</style>
