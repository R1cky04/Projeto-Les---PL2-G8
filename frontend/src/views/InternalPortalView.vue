<template>
  <div class="auth-portal">
    <main v-if="isRestoringSession" class="auth-loading-shell">
      <section class="auth-card auth-loading-card">
        <p class="auth-eyebrow">{{ $t('portal.loadingEyebrow') }}</p>
        <h1>{{ $t('portal.loadingTitle') }}</h1>
        <p>{{ $t('portal.loadingDescription') }}</p>
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
          <h1>{{ $t('portal.appTitle') }}</h1>
        </div>

        <div class="module-shell-actions">
          <button class="auth-secondary-button is-active" type="button" @click="returnToWorkspace">
            {{ $t('portal.backToPanel') }}
          </button>
          <button class="auth-secondary-button" type="button" @click="logout" style="padding-left: 20px; padding-right: 20px;">
            {{ $t('portal.logout') }}
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
          <h1>{{ $t('portal.appTitle') }}</h1>
        </div>

        <div class="module-shell-actions">
          <button class="auth-secondary-button is-active" type="button" @click="returnToWorkspace">
            {{ $t('portal.backToPanel') }}
          </button>
          <button class="auth-secondary-button" type="button" @click="logout" style="padding-left: 20px; padding-right: 20px;">
            {{ $t('portal.logout') }}
          </button>
        </div>
      </header>

      <section class="station-module-toolbar">
        <div class="station-module-toolbar-head">
          <div class="station-module-toolbar-copy">
            <h2>{{ $t('portal.stationsTitle') }}</h2>
            <p>
              {{
                stationModuleView === 'MANAGE'
                  ? $t('portal.stationsManageDescription')
                  : $t('portal.stationsCreateDescription')
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
              {{ $t('portal.createStation') }}
            </button>

            <button
              v-else
              class="auth-secondary-button station-toggle-back"
              type="button"
              @click="setStationModuleView('MANAGE')"
            >
              {{ $t('portal.backToManageStations') }}
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
          <h1>{{ $t('portal.appTitle') }}</h1>
        </div>

        <div class="module-shell-actions">
          <button class="auth-secondary-button is-active" type="button" @click="returnToWorkspace">
            {{ $t('portal.backToPanel') }}
          </button>
          <button class="auth-secondary-button" type="button" @click="logout" style="padding-left: 20px; padding-right: 20px;">
            {{ $t('portal.logout') }}
          </button>
        </div>
      </header>

      <section class="station-module-toolbar">
        <div class="station-module-toolbar-head">
          <div class="station-module-toolbar-copy">
            <h2>{{ $t('portal.vehiclesTitle') }}</h2>
            <p>
              {{
                vehicleModuleView === 'MANAGE'
                  ? $t('portal.vehiclesManageDescription')
                  : $t('portal.vehiclesCreateDescription')
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
              {{ $t('portal.createVehicle') }}
            </button>

            <button
              v-else-if="vehicleModuleView === 'CREATE'"
              class="auth-secondary-button station-toggle-back"
              type="button"
              @click="setVehicleModuleView('MANAGE')"
            >
              {{ $t('portal.backToManageVehicles') }}
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

    <main v-else-if="currentFeature === 'RENTALS'" class="auth-module-shell">
      <header class="module-shell-header">
        <div>
          <h1>{{ $t('portal.appTitle') }}</h1>
        </div>

        <div class="module-shell-actions">
          <button class="auth-secondary-button is-active" type="button" @click="returnToWorkspace">
            {{ $t('portal.backToPanel') }}
          </button>
          <button class="auth-secondary-button" type="button" @click="logout" style="padding-left: 20px; padding-right: 20px;">
            {{ $t('portal.logout') }}
          </button>
        </div>
      </header>

      <section class="station-module-toolbar">
        <div class="station-module-toolbar-head">
          <div class="station-module-toolbar-copy">
            <h2>{{ $t('portal.rentalsTitle') }}</h2>
            <p>
              {{ $t('portal.rentalsDescription') }}
            </p>
          </div>
        </div>
      </section>

      <RentalContractsView
        :session-token="sessionToken"
        :session-user-role="authState?.user?.role || ''"
      />
    </main>

    <main v-else-if="currentFeature === 'IMPRO_MANAGEMENT'" class="auth-module-shell">
      <header class="module-shell-header">
        <div>
          <h1>{{ $t('portal.appTitle') }}</h1>
        </div>

        <div class="module-shell-actions">
          <button class="auth-secondary-button is-active" type="button" @click="returnToWorkspace">
            {{ $t('portal.backToPanel') }}
          </button>
          <button class="auth-secondary-button" type="button" @click="logout" style="padding-left: 20px; padding-right: 20px;">
            {{ $t('portal.logout') }}
          </button>
        </div>
      </header>

      <section class="station-module-toolbar">
        <div class="station-module-toolbar-head">
          <div class="station-module-toolbar-copy">
            <h2>{{ $t('portal.improsTitle') }}</h2>
            <p>
              {{ $t('portal.improsDescription') }}
            </p>
          </div>
        </div>
      </section>

      <ImproOperationsView :session-token="sessionToken" />
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
import ImproOperationsView from '../components/impro/ImproOperationsView.vue'
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
import RentalContractsView from '../components/rentals/RentalContractsView.vue'
import InternalUsersView from './InternalUsersView.vue'

// Root authenticated container. It owns session restore, login/logout and the
// high-level navigation between the workspace and the IT module.
export default {
  name: 'InternalPortalView',
  components: {
    CreateVehicle,
    CreateStation,
    ImproOperationsView,
    InternalLoginPanel,
    ManageVehicle,
    ManageStation,
    RentalContractsView,
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
        this.submitError = error.message || this.$t('portal.genericLoginError')
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
        featureKey === 'CUSTOMERS' ||
        featureKey === 'RESERVATIONS' ||
        featureKey === 'STATION_MANAGEMENT' ||
        featureKey === 'IMPRO_MANAGEMENT' ||
        featureKey === 'RENTALS' ||
        featureKey === 'FLEET_OPERATIONS' ||
        featureKey === 'VEHICLE_MANAGEMENT' ||
        featureKey === 'VEHICLES'
      ) {
        const normalizedFeatureKey =
          featureKey === 'FLEET_OPERATIONS'
            ? 'IMPRO_MANAGEMENT'
            : featureKey === 'VEHICLES'
              ? 'VEHICLE_MANAGEMENT'
              : featureKey

        if (
          normalizedFeatureKey === 'STATION_MANAGEMENT' &&
          this.authState?.user?.role !== 'IT'
        ) {
          this.workspaceMessage = this.$t('portal.stationOnlyIt')
          return
        }

        if (
          normalizedFeatureKey === 'IMPRO_MANAGEMENT' &&
          !['FLEET', 'ADMIN', 'IT'].includes(this.authState?.user?.role)
        ) {
          this.workspaceMessage = this.$t('portal.improOnlyRoles')
          return
        }

        if (
          normalizedFeatureKey === 'VEHICLE_MANAGEMENT' &&
          !['IT', 'ADMIN', 'STAFF', 'FLEET'].includes(this.authState?.user?.role)
        ) {
          this.workspaceMessage = this.$t('portal.vehicleOnlyRoles')
          return
        }

        if (
          normalizedFeatureKey === 'RENTALS' &&
          !['IT', 'ADMIN', 'STAFF', 'FLEET'].includes(this.authState?.user?.role)
        ) {
          this.workspaceMessage = this.$t('portal.rentalsOnlyRoles')
          return
        }

        this.currentFeature = normalizedFeatureKey
        if (normalizedFeatureKey === 'STATION_MANAGEMENT') {
          this.stationModuleView = 'MANAGE'
          this.$nextTick(() => {
            this.scrollToModuleTop()
          })
        }

        if (normalizedFeatureKey === 'VEHICLE_MANAGEMENT') {
          this.vehicleModuleView = 'MANAGE'
          this.$nextTick(() => {
            this.scrollToModuleTop()
          })
        }

        if (normalizedFeatureKey === 'IMPRO_MANAGEMENT') {
          this.$nextTick(() => {
            this.scrollToModuleTop()
          })
        }

        if (normalizedFeatureKey === 'RENTALS') {
          this.$nextTick(() => {
            this.scrollToModuleTop()
          })
        }

        this.workspaceMessage = ''
        return
      }

      this.workspaceMessage = this.$t('portal.futureSprint')
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

<style scoped src="../styles/views/internal-portal-view.css"></style>
