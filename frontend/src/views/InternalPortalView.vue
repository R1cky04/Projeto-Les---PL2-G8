<template>
  <div class="auth-portal">
    <main v-if="isRestoringSession" class="auth-loading-shell">
      <section class="auth-card auth-loading-card">
        <p class="auth-eyebrow">Portal interno</p>
        <h1>A restaurar sessao</h1>
        <p>Validacao em curso das credenciais atuais e das funcionalidades disponiveis.</p>
      </section>
    </main>

    <main v-else-if="!authState" class="auth-login-shell">
      <InternalLoginPanel
        :user-id="loginForm.userId"
        :password="loginForm.password"
        :field-errors="fieldErrors"
        :submit-error="submitError"
        :is-submitting="isSubmitting"
        @submit="submitLogin"
        @update:user-id="loginForm.userId = $event"
        @update:userId="loginForm.userId = $event"
        @update:password="loginForm.password = $event"
      />
    </main>

    <main v-else-if="currentFeature === 'INTERNAL_USERS'" class="auth-module-shell">
      <header class="module-shell-header">
        <div>
          <h1>Rent-a-<span class="brand-blue">Car</span> Management</h1>
        </div>

        <div class="module-shell-actions">
          <button class="auth-secondary-button is-active" type="button" @click="returnToWorkspace">
            Voltar ao painel
          </button>
          <button class="auth-secondary-button" type="button" @click="logout" style="padding-left: 20px; padding-right: 20px;">
            Terminar sessão
          </button>
        </div>
      </header>

      <InternalUsersView
        :embedded="true"
        :session-token="sessionToken"
        :session-user="authState.user"
      />
    </main>

    <main v-else-if="currentFeature === 'STATION_MANAGEMENT'" class="auth-module-shell">
      <header class="module-shell-header">
        <div>
          <h1>Rent-a-<span class="brand-blue">Car</span> Management</h1>
        </div>

        <div class="module-shell-actions">
          <button class="auth-secondary-button is-active" type="button" @click="returnToWorkspace">
            Voltar ao painel
          </button>
          <button class="auth-secondary-button" type="button" @click="logout" style="padding-left: 20px; padding-right: 20px;">
            Terminar sessão
          </button>
        </div>
      </header>

      <section class="station-module-toolbar">
        <div class="station-module-toolbar-head">
          <div class="station-module-toolbar-copy">
            <h2>Estacoes</h2>
            <p>
              {{
                stationModuleView === 'MANAGE'
                  ? 'Consulte e atualize estacoes existentes. Use o atalho de criacao quando precisar de registar uma nova estacao.'
                  : 'Preencha os dados obrigatorios e submeta para registar uma nova estacao na rede.'
              }}
            </p>
          </div>

          <div class="station-module-toolbar-actions">
            <button
              class="auth-primary-button station-toggle-create"
              v-if="stationModuleView === 'MANAGE'"
              type="button"
              @click="setStationModuleView('CREATE')"
            >
              Criar estacao
            </button>

            <button
              v-else
              class="auth-secondary-button station-toggle-back"
              type="button"
              @click="setStationModuleView('MANAGE')"
            >
              Voltar a gerir estacoes
            </button>
          </div>
        </div>
      </section>

      <ManageStation
        v-if="stationModuleView === 'MANAGE'"
        :session-token="sessionToken"
      />
      <CreateStation
        v-else
        :session-token="sessionToken"
      />
    </main>

    <main v-else-if="currentFeature === 'VEHICLE_MANAGEMENT'" class="auth-module-shell">
      <header class="module-shell-header">
        <div>
          <h1>Rent-a-<span class="brand-blue">Car</span> Management</h1>
        </div>

        <div class="module-shell-actions">
          <button class="auth-secondary-button is-active" type="button" @click="returnToWorkspace">
            Voltar ao painel
          </button>
          <button class="auth-secondary-button" type="button" @click="logout" style="padding-left: 20px; padding-right: 20px;">
            Terminar sessao
          </button>
        </div>
      </header>

      <section class="station-module-toolbar">
        <div class="station-module-toolbar-head">
          <div class="station-module-toolbar-copy">
            <h2>Veiculos</h2>
            <p>
              {{
                vehicleModuleView === 'MANAGE'
                  ? 'Consulte e edite veiculos existentes, incluindo estado, quilometragem e preco diario.'
                  : 'Preencha os dados obrigatorios para criar um novo veiculo no sistema.'
              }}
            </p>
          </div>

          <div class="station-module-toolbar-actions">
            <button
              class="auth-primary-button station-toggle-create"
              v-if="vehicleModuleView === 'MANAGE' && authState?.user?.role === 'IT'"
              type="button"
              @click="setVehicleModuleView('CREATE')"
            >
              Criar veiculo
            </button>

            <button
              v-else-if="vehicleModuleView === 'CREATE'"
              class="auth-secondary-button station-toggle-back"
              type="button"
              @click="setVehicleModuleView('MANAGE')"
            >
              Voltar a gerir veiculos
            </button>
          </div>
        </div>
      </section>

      <ManageVehicle
        v-if="vehicleModuleView === 'MANAGE'"
        :session-token="sessionToken"
        :session-user-role="authState?.user?.role || ''"
      />
      <CreateVehicle
        v-else
        :session-token="sessionToken"
      />
    </main>

    <main v-else class="auth-workspace-shell">
      <p v-if="workspaceMessage" class="auth-banner auth-banner-info">
        {{ workspaceMessage }}
      </p>

      <InternalWorkspaceHome
        :auth-state="authState"
        @logout="logout"
        @open-feature="openFeature"
      />
    </main>
  </div>
</template>

<script>
import InternalLoginPanel from '../components/auth/InternalLoginPanel.vue'
import InternalWorkspaceHome from '../components/auth/InternalWorkspaceHome.vue'
import { loginInternalUser, logoutInternalUser } from '../services/authApi'
import {
  clearStoredSessionToken,
  storeSessionToken,
} from '../services/authStorage'
import {
  buildLoginPayload,
  createLoginForm,
  mapLoginApiErrors,
  validateLoginForm,
} from '../utils/loginForm'
import CreateVehicle from '../components/CreateVehicle.vue'
import CreateStation from '../components/CreateStation.vue'
import ManageVehicle from '../components/ManageVehicle.vue'
import ManageStation from '../components/ManageStation.vue'
import InternalUsersView from './InternalUsersView.vue'

// Root authenticated container. It owns session restore, login/logout and the
// high-level navigation between the workspace and the IT module.
export default {
  name: 'InternalPortalView',
  components: {
    CreateVehicle,
    CreateStation,
    InternalLoginPanel,
    ManageVehicle,
    ManageStation,
    InternalUsersView,
    InternalWorkspaceHome,
  },
  data() {
    return {
      loginForm: createLoginForm(),
      fieldErrors: {},
      submitError: '',
      isSubmitting: false,
      isRestoringSession: true,
      authState: null,
      sessionToken: '',
      currentFeature: '',
      stationModuleView: 'MANAGE',
      vehicleModuleView: 'MANAGE',
      workspaceMessage: '',
    }
  },
  async created() {
    await this.restoreSession()
  },
  methods: {
    async restoreSession() {
      this.isRestoringSession = true

      // Force manual authentication on each desktop start.
      clearStoredSessionToken()
      this.sessionToken = ''
      this.authState = null
      this.isRestoringSession = false
    },
    async submitLogin() {
      this.submitError = ''
      this.workspaceMessage = ''

      const validationErrors = validateLoginForm(this.loginForm)

      if (Object.keys(validationErrors).length > 0) {
        this.fieldErrors = validationErrors
        return
      }

      this.fieldErrors = {}
      this.isSubmitting = true

      try {
        const response = await loginInternalUser(
          buildLoginPayload(this.loginForm),
        )
        const sessionToken = response?.session?.token || ''

        this.applyAuthenticatedState(response, sessionToken)
        this.loginForm = createLoginForm()
      } catch (error) {
        this.fieldErrors = mapLoginApiErrors(error.errors)
        this.submitError = error.message || 'Nao foi possivel efetuar login.'
      } finally {
        this.isSubmitting = false
      }
    },
    async logout() {
      try {
        if (this.sessionToken) {
          await logoutInternalUser(this.sessionToken)
        }
      } catch {
        // Logout should still clear local state even if the backend no longer
        // considers the session valid.
      } finally {
        clearStoredSessionToken()
        this.sessionToken = ''
        this.authState = null
        this.loginForm = createLoginForm()
        this.currentFeature = ''
        this.vehicleModuleView = 'MANAGE'
        this.workspaceMessage = ''
        this.fieldErrors = {}
        this.submitError = ''
      }
    },
    openFeature(featureKey) {
      if (
        featureKey === 'INTERNAL_USERS' ||
        featureKey === 'STATION_MANAGEMENT' ||
        featureKey === 'VEHICLE_MANAGEMENT'
      ) {
        if (
          featureKey === 'STATION_MANAGEMENT' &&
          this.authState?.user?.role !== 'IT'
        ) {
          this.workspaceMessage =
            'A funcionalidade de estacoes esta disponivel apenas para o perfil IT autenticado.'
          return
        }

        if (
          featureKey === 'VEHICLE_MANAGEMENT' &&
          !['IT', 'ADMIN', 'STAFF', 'FLEET'].includes(this.authState?.user?.role)
        ) {
          this.workspaceMessage =
            'A funcionalidade de veiculos exige perfil IT, ADMIN, STAFF ou FLEET.'
          return
        }

        this.currentFeature = featureKey
        if (featureKey === 'STATION_MANAGEMENT') {
          this.stationModuleView = 'MANAGE'
          this.$nextTick(() => {
            this.scrollToModuleTop()
          })
        }
        if (featureKey === 'VEHICLE_MANAGEMENT') {
          this.vehicleModuleView = 'MANAGE'
          this.$nextTick(() => {
            this.scrollToModuleTop()
          })
        }
        this.workspaceMessage = ''
        return
      }

      this.workspaceMessage =
        'A autenticacao e as permissoes deste modulo ja estao resolvidas, mas a interface funcional ainda nao faz parte desta sprint.'
    },
    returnToWorkspace() {
      this.currentFeature = ''
    },
    setStationModuleView(view) {
      this.stationModuleView = view
      this.$nextTick(() => {
        this.scrollToModuleTop()
      })
    },
    setVehicleModuleView(view) {
      this.vehicleModuleView = view
      this.$nextTick(() => {
        this.scrollToModuleTop()
      })
    },
    scrollToModuleTop() {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      if (document?.documentElement) {
        document.documentElement.scrollTop = 0
      }
      if (document?.body) {
        document.body.scrollTop = 0
      }
    },
    applyAuthenticatedState(response, sessionToken) {
      this.authState = response
      this.sessionToken = sessionToken
      this.currentFeature = ''
      this.stationModuleView = 'MANAGE'
      this.vehicleModuleView = 'MANAGE'
      this.workspaceMessage = ''
      this.submitError = ''
      this.fieldErrors = {}

      if (sessionToken) {
        storeSessionToken(sessionToken)
      }
    },
  },
}
</script>

<style scoped>
.station-module-toolbar {
  max-width: 1400px;
  margin: 18px auto 12px;
  padding: 0 32px;
}

.station-module-toolbar-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.station-module-toolbar-copy {
  flex: 1;
}

.station-module-toolbar-head h2 {
  margin: 0;
  font-size: 1.35rem;
}

.station-module-toolbar-head p {
  margin: 6px 0 0;
  color: var(--auth-muted);
  font-size: 0.92rem;
}

.station-module-toolbar-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  align-items: center;
}

.station-toggle-create,
.station-toggle-back {
  min-height: 44px;
}

.station-toggle-create {
  min-width: 180px;
}

.station-toggle-back {
  margin-left: 0;
}

@media (max-width: 720px) {
  .station-module-toolbar {
    padding-left: 16px;
    padding-right: 16px;
  }

  .station-module-toolbar-head {
    flex-direction: column;
    align-items: stretch;
  }

  .station-module-toolbar-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
