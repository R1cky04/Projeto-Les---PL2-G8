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
            Novo Utilizador
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
import { fetchCurrentSession, loginInternalUser, logoutInternalUser } from '../services/authApi'
import {
  clearStoredSessionToken,
  readStoredSessionToken,
  storeSessionToken,
} from '../services/authStorage'
import {
  buildLoginPayload,
  createLoginForm,
  mapLoginApiErrors,
  validateLoginForm,
} from '../utils/loginForm'
import InternalUsersView from './InternalUsersView.vue'

// Root authenticated container. It owns session restore, login/logout and the
// high-level navigation between the workspace and the IT module.
export default {
  name: 'InternalPortalView',
  components: {
    InternalLoginPanel,
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
      workspaceMessage: '',
    }
  },
  async created() {
    await this.restoreSession()
  },
  methods: {
    async restoreSession() {
      this.isRestoringSession = true

      const storedToken = readStoredSessionToken()

      if (!storedToken) {
        this.isRestoringSession = false
        return
      }

      try {
        const response = await fetchCurrentSession(storedToken)
        this.applyAuthenticatedState(response, storedToken)
      } catch {
        clearStoredSessionToken()
        this.sessionToken = ''
        this.authState = null
      } finally {
        this.isRestoringSession = false
      }
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
        this.workspaceMessage = ''
        this.fieldErrors = {}
        this.submitError = ''
      }
    },
    openFeature(featureKey) {
      if (featureKey === 'INTERNAL_USERS') {
        this.currentFeature = featureKey
        this.workspaceMessage = ''
        return
      }

      this.workspaceMessage =
        'A autenticacao e as permissoes deste modulo ja estao resolvidas, mas a interface funcional ainda nao faz parte desta sprint.'
    },
    returnToWorkspace() {
      this.currentFeature = ''
    },
    applyAuthenticatedState(response, sessionToken) {
      this.authState = response
      this.sessionToken = sessionToken
      this.currentFeature = ''
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
