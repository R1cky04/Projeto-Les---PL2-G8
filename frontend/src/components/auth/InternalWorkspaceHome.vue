<template>
  <section class="auth-workspace">
    <header class="workspace-header">
      <div>
        <p class="auth-eyebrow">Sessao interna</p>
        <h1>{{ authState.user.fullName || authState.user.userId }}</h1>
        <p class="workspace-subtitle">
          {{ roleLabel(authState.user.role) }} | {{ accessLevelLabel(authState.user.accessLevel) }}
        </p>
      </div>

      <button class="auth-secondary-button" type="button" @click="$emit('logout')">
        Terminar sessao
      </button>
    </header>

    <section class="workspace-summary-grid">
      <article class="auth-card summary-card">
        <p class="summary-label">User ID</p>
        <strong>{{ authState.user.userId }}</strong>
      </article>

      <article class="auth-card summary-card">
        <p class="summary-label">Estado</p>
        <strong>{{ authState.user.status }}</strong>
      </article>

      <article class="auth-card summary-card">
        <p class="summary-label">Expira em</p>
        <strong>{{ formatExpiry(authState.session.expiresAt) }}</strong>
      </article>

      <article class="auth-card summary-card">
        <p class="summary-label">Sessoes paralelas</p>
        <strong>{{ authState.session.concurrentSessionCount }}</strong>
      </article>
    </section>

    <article v-if="authState.session.warnings.length > 0" class="auth-card workspace-alerts">
      <p class="summary-label">Avisos da sessao</p>
      <ul class="alert-list">
        <li v-for="warning in authState.session.warnings" :key="warning">
          {{ warning }}
        </li>
      </ul>
    </article>

    <section class="feature-grid">
      <article
        v-for="feature in authState.features"
        :key="feature.key"
        class="auth-card feature-card"
        :class="`feature-card-${feature.status.toLowerCase()}`"
      >
        <div class="feature-head">
          <div>
            <h2>{{ feature.label }}</h2>
            <p>{{ feature.description }}</p>
          </div>
          <span class="feature-status">
            {{ featureStatusLabel(feature.status) }}
          </span>
        </div>

        <p v-if="feature.reason" class="feature-reason">
          {{ feature.reason }}
        </p>

        <button
          class="auth-primary-button feature-action"
          type="button"
          :disabled="feature.status !== 'AVAILABLE'"
          @click="$emit('open-feature', feature.key)"
        >
          {{
            feature.key === 'INTERNAL_USERS' || feature.key === 'FLEET_OPERATIONS'
              ? 'Abrir modulo'
              : 'Autorizado'
          }}
        </button>
      </article>

      <article class="auth-card feature-card feature-card-available">
        <div class="feature-head">
          <div>
            <h2>Gerir Estacoes</h2>
            <p>Aceda a um unico modulo para consultar, editar e, se necessario, criar novas estacoes.</p>
          </div>
          <span class="feature-status">
            {{ canManageStations() ? 'Disponivel' : 'Acesso IT' }}
          </span>
        </div>

        <p v-if="!canManageStations()" class="feature-reason">
          Apenas o perfil IT autenticado com permissao de gestao de estacoes pode aceder a este modulo.
        </p>

        <button
          class="auth-primary-button feature-action"
          type="button"
          :disabled="!canManageStations()"
          @click="$emit('open-feature', 'STATION_MANAGEMENT')"
        >
          {{ canManageStations() ? 'Abrir modulo' : 'Nao autorizado' }}
        </button>
      </article>

      <article class="auth-card feature-card feature-card-available">
        <div class="feature-head">
          <div>
            <h2>Gerir Impros</h2>
            <p>Crie e acompanhe transferencias de veiculos entre estacoes com historico.</p>
          </div>
          <span class="feature-status">
            {{ canManageImpros() ? 'Disponivel' : 'Acesso Frota/Admin' }}
          </span>
        </div>

        <p v-if="!canManageImpros()" class="feature-reason">
          Apenas os perfis Frota, Admin ou IT com permissao de transferencia podem aceder ao modulo de impros.
        </p>

        <button
          class="auth-primary-button feature-action"
          type="button"
          :disabled="!canManageImpros()"
          @click="$emit('open-feature', 'IMPRO_MANAGEMENT')"
        >
          {{ canManageImpros() ? 'Abrir modulo' : 'Nao autorizado' }}
        </button>
      </article>

      <article class="auth-card feature-card feature-card-available">
        <div class="feature-head">
          <div>
            <h2>Gerir Veiculos</h2>
            <p>Gestao da frota com edicao para IT, ADMIN, STAFF e FLEET; criacao e eliminacao apenas para IT.</p>
          </div>
          <span class="feature-status">
            {{ canManageVehicles() ? 'Disponivel' : 'Sem perfil' }}
          </span>
        </div>

        <p v-if="!canManageVehicles()" class="feature-reason">
          O modulo de veiculos esta disponivel para IT, ADMIN, STAFF e FLEET.
        </p>

        <button
          class="auth-primary-button feature-action"
          type="button"
          :disabled="!canManageVehicles()"
          @click="$emit('open-feature', 'VEHICLE_MANAGEMENT')"
        >
          {{ canManageVehicles() ? 'Abrir modulo' : 'Nao autorizado' }}
        </button>
      </article>
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
    canManageStations() {
      return this.authState?.user?.role === 'IT'
    },
    canManageImpros() {
      const role = this.authState?.user?.role
      return role === 'FLEET' || role === 'ADMIN' || role === 'IT'
    canManageVehicles() {
      return ['IT', 'ADMIN', 'STAFF', 'FLEET'].includes(this.authState?.user?.role)
    },
  },
}
</script>
