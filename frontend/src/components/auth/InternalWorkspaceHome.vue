<template>
  <section class="auth-workspace">
    <header class="workspace-header">
      <div>
        <p class="auth-eyebrow">{{ $t('workspace.sessionInternal') }}</p>
        <h1>{{ authState.user.fullName || authState.user.userId }}</h1>
        <p class="workspace-subtitle">
          {{ roleLabel(authState.user.role) }} | {{ accessLevelLabel(authState.user.accessLevel) }}
        </p>
      </div>

      <div class="workspace-header-actions">
        <label class="workspace-language-picker" for="workspace-language-select">
          <span>{{ $t('language.label') }}</span>
          <select
            id="workspace-language-select"
            :value="$localeState.locale"
            @change="handleLocaleChange"
          >
            <option v-for="locale in $supportedLocales" :key="locale" :value="locale">
              {{ languageLabel(locale) }}
            </option>
          </select>
        </label>

        <button class="auth-secondary-button" type="button" @click="$emit('logout')">
          {{ $t('portal.logout') }}
        </button>
      </div>
    </header>

    <section class="workspace-summary-grid">
      <article class="auth-card summary-card">
        <p class="summary-label">{{ $t('workspace.userId') }}</p>
        <strong>{{ authState.user.userId }}</strong>
      </article>

      <article class="auth-card summary-card">
        <p class="summary-label">{{ $t('workspace.status') }}</p>
        <strong>{{ authState.user.status }}</strong>
      </article>

      <article class="auth-card summary-card">
        <p class="summary-label">{{ $t('workspace.expiresAt') }}</p>
        <strong>{{ formatExpiry(authState.session.expiresAt) }}</strong>
      </article>

    </section>

    <section class="feature-grid">
      <article
        v-for="feature in visibleFeatures"
        :key="feature.key"
        class="auth-card feature-card"
        :class="`feature-card-${feature.status.toLowerCase()}`"
      >
        <div class="feature-head">
          <div>
            <h2>{{ featureTitle(feature) }}</h2>
            <p>{{ featureDescription(feature) }}</p>
          </div>
          <span class="feature-status">
            {{ featureStatusLabel(feature.status) }}
          </span>
        </div>

        <p v-if="feature.reason" class="feature-reason">
          {{ featureReason(feature) }}
        </p>

        <button
          class="auth-primary-button feature-action"
          type="button"
          :disabled="feature.status !== 'AVAILABLE'"
          @click="$emit('open-feature', feature.key)"
        >
          {{ feature.status === 'AVAILABLE' ? $t('workspace.openModule') : $t('workspace.unavailable') }}
        </button>
      </article>

      <article class="auth-card feature-card feature-card-available">
        <div class="feature-head">
          <div>
            <h2>{{ $t('workspace.manageStations') }}</h2>
            <p>{{ $t('workspace.manageStationsDesc') }}</p>
          </div>
          <span class="feature-status">
            {{ canManageStations() ? featureStatusLabel('AVAILABLE') : $t('workspace.accessIt') }}
          </span>
        </div>

        <p v-if="!canManageStations()" class="feature-reason">
          {{ $t('workspace.manageStationsReason') }}
        </p>

        <button
          class="auth-primary-button feature-action"
          type="button"
          :disabled="!canManageStations()"
          @click="$emit('open-feature', 'STATION_MANAGEMENT')"
        >
          {{ canManageStations() ? $t('workspace.openModule') : $t('workspace.notAuthorized') }}
        </button>
      </article>

      <article class="auth-card feature-card feature-card-available">
        <div class="feature-head">
          <div>
            <h2>{{ $t('workspace.manageImpros') }}</h2>
            <p>{{ $t('workspace.manageImprosDesc') }}</p>
          </div>
          <span class="feature-status">
            {{ canManageImpros() ? featureStatusLabel('AVAILABLE') : $t('workspace.accessFleetAdmin') }}
          </span>
        </div>

        <p v-if="!canManageImpros()" class="feature-reason">
          {{ $t('workspace.manageImprosReason') }}
        </p>

        <button
          class="auth-primary-button feature-action"
          type="button"
          :disabled="!canManageImpros()"
          @click="$emit('open-feature', 'IMPRO_MANAGEMENT')"
        >
          {{ canManageImpros() ? $t('workspace.openModule') : $t('workspace.notAuthorized') }}
        </button>
      </article>

      <article class="auth-card feature-card feature-card-available">
        <div class="feature-head">
          <div>
            <h2>{{ $t('workspace.manageVehicles') }}</h2>
            <p>{{ $t('workspace.manageVehiclesDesc') }}</p>
          </div>
          <span class="feature-status">
            {{ canManageVehicles() ? featureStatusLabel('AVAILABLE') : $t('workspace.noProfile') }}
          </span>
        </div>

        <p v-if="!canManageVehicles()" class="feature-reason">
          {{ $t('workspace.manageVehiclesReason') }}
        </p>

        <button
          class="auth-primary-button feature-action"
          type="button"
          :disabled="!canManageVehicles()"
          @click="$emit('open-feature', 'VEHICLE_MANAGEMENT')"
        >
          {{ canManageVehicles() ? $t('workspace.openModule') : $t('workspace.notAuthorized') }}
        </button>
      </article>

      <!-- Reservations removed from workspace panel; use Gerir Reservas module in navigation instead -->
    </section>
  </section>
</template>

<script>
import {
  formatSessionExpiry,
  getAccessLevelLabel,
  getFeatureStatusLabel,
  getRoleLabel,
} from '../../utils/authPresentation'

// Workspace home focuses on authenticated session presentation and feature
// discovery; navigation remains in the parent container.
export default {
  name: 'InternalWorkspaceHome',
  props: {
    authState: {
      type: Object,
      required: true,
    },
  },
  emits: ['logout', 'open-feature'],
  methods: {
    handleLocaleChange(event) {
      this.$setLocale(event.target.value)
    },
    languageLabel(locale) {
      if (locale === 'en') {
        return this.$t('language.english')
      }
      if (locale === 'es') {
        return this.$t('language.spanish')
      }
      return this.$t('language.portuguese')
    },
    roleLabel(role) {
      return getRoleLabel(role)
    },
    accessLevelLabel(accessLevel) {
      return getAccessLevelLabel(accessLevel)
    },
    featureStatusLabel(status) {
      return getFeatureStatusLabel(status)
    },
    formatExpiry(value) {
      return formatSessionExpiry(value)
    },
    featureTitle(feature) {
      const mapped = this.$t(`workspace.feature.${feature.key}.title`)
      return mapped.startsWith('workspace.feature.') ? feature.label : mapped
    },
    featureDescription(feature) {
      const mapped = this.$t(`workspace.feature.${feature.key}.description`)
      return mapped.startsWith('workspace.feature.') ? feature.description : mapped
    },
    featureReason(feature) {
      const mapped = this.$t(`workspace.feature.${feature.key}.reason`)
      return mapped.startsWith('workspace.feature.') ? feature.reason : mapped
    },
    canManageStations() {
      return this.authState?.user?.role === 'IT'
    },
    canManageImpros() {
      const role = this.authState?.user?.role
      return role === 'FLEET' || role === 'ADMIN' || role === 'IT'
    },
    canManageVehicles() {
      return ['IT', 'ADMIN', 'STAFF', 'FLEET'].includes(this.authState?.user?.role)
    },
    canManageReservations() {
      return ['IT', 'ADMIN', 'STAFF', 'FLEET'].includes(this.authState?.user?.role)
    },
  },
  computed: {
    // Hide CUSTOMER feature from the workspace panel — it's currently non-functional.
    visibleFeatures() {
      return (this.authState?.features || []).filter((f) => f.key !== 'CUSTOMERS' && f.key !== 'RESERVATIONS')
    },
  },
}
</script>

