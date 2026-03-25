<template>
  <article class="panel panel-form panel-manage">
    <div class="panel-head">
      <div>
        <div class="management-icon">IT</div>
        <h2>Gerir Utilizador</h2>
        <p class="management-intro">
          Visualize os dados atuais e ajuste o acesso do utilizador selecionado.
        </p>
      </div>

      <button class="ghost-button" type="button" @click="$emit('clear-selection')">
        Novo Utilizador
      </button>
    </div>

    <div v-if="!selectedUser" class="management-empty">
      Selecione um utilizador da lista para editar o User ID, a password, o tipo e o estado da conta.
    </div>

    <template v-else>
      <div class="management-overview">
        <div class="overview-card">
          <span>Conta selecionada</span>
          <strong>{{ selectedUser.userId }}</strong>
        </div>

        <div class="overview-card">
          <span>Perfil atual</span>
          <strong>{{ roleLabel(selectedUser.internalRole) }}</strong>
        </div>

        <div class="overview-card">
          <span>Estado atual</span>
          <strong>{{ statusLabel(selectedUser.internalStatus) }}</strong>
        </div>

        <div class="overview-card">
          <span>Criado em</span>
          <strong>{{ formatDate(selectedUser.createdAt) }}</strong>
        </div>
      </div>

      <form class="form-grid" novalidate @submit.prevent="$emit('submit')">
        <label class="field">
          <span>User ID</span>
          <input
            :value="userId"
            autocomplete="username"
            type="text"
            @input="emitUserIdUpdate($event.target.value)"
          >
          <small v-if="fieldErrors.userId" class="field-error">
            {{ fieldErrors.userId }}
          </small>
        </label>

        <label class="field">
          <span>Nova password</span>
          <input
            :value="password"
            autocomplete="new-password"
            type="password"
            @input="$emit('update:password', $event.target.value)"
          >
          <small class="field-hint">
            Deixe em branco para manter a password atual.
          </small>
          <small v-if="fieldErrors.password" class="field-error">
            {{ fieldErrors.password }}
          </small>
        </label>

        <label class="field">
          <span>Tipo de utilizador</span>
          <select
            :value="role"
            :disabled="isProtectedItAccount"
            @change="$emit('update:role', $event.target.value)"
          >
            <option
              v-for="roleOption in availableRoleOptions"
              :key="roleOption.value"
              :value="roleOption.value"
            >
              {{ roleOption.label }}
            </option>
          </select>
          <small v-if="fieldErrors.role" class="field-error">
            {{ fieldErrors.role }}
          </small>
        </label>

        <label class="field">
          <span>Estado da conta</span>
          <select
            :value="status"
            :disabled="isProtectedItAccount"
            @change="$emit('update:status', $event.target.value)"
          >
            <option
              v-for="statusOption in statusOptions"
              :key="statusOption.value"
              :value="statusOption.value"
            >
              {{ statusOption.label }}
            </option>
          </select>
          <small v-if="fieldErrors.status" class="field-error">
            {{ fieldErrors.status }}
          </small>
        </label>

        <div class="field field-boolean">
          <span>Disponibilidade da conta</span>
          <label class="toggle-field">
            <input
              :checked="isActive"
              :disabled="isProtectedItAccount"
              type="checkbox"
              @change="emitIsActiveUpdate($event.target.checked)"
            >
            <span>{{ isActive ? 'Conta ativa' : 'Conta desativada' }}</span>
          </label>
          <small v-if="fieldErrors.isActive" class="field-error">
            {{ fieldErrors.isActive }}
          </small>
        </div>

        <div class="field field-full">
          <span>Permissoes atuais</span>
          <div class="current-permissions">
            <span
              v-for="permission in selectedUser.permissions"
              :key="permission"
              class="permission-chip"
            >
              {{ formatPermission(permission) }}
            </span>
          </div>
        </div>

        <div class="field field-full">
          <span>Permissoes herdadas pelo tipo selecionado</span>
          <p class="field-hint">
            Estas permissoes sao aplicadas automaticamente com base no tipo escolhido.
          </p>
          <div class="current-permissions">
            <span
              v-for="permission in effectivePermissions"
              :key="`effective-${permission}`"
              class="permission-chip"
            >
              {{ formatPermission(permission) }}
            </span>
          </div>
        </div>

        <ul v-if="warnings.length > 0" class="banner banner-warning warning-list">
          <li v-for="warning in warnings" :key="warning">
            {{ warning }}
          </li>
        </ul>

        <p v-if="isProtectedItAccount" class="banner banner-info">
          A conta selecionada pertence ao perfil IT reservado. O User ID e a password podem ser atualizados, mas o tipo, o estado e a ativacao ficam protegidos, e as permissoes continuam herdadas automaticamente do perfil IT.
        </p>

        <details class="permission-guide">
          <summary>Ver permissoes disponiveis por perfil</summary>

          <div class="permission-guide-grid">
            <article
              v-for="roleGuide in rolePermissionGuide"
              :key="roleGuide.role"
              class="permission-guide-card"
            >
              <h3>{{ roleGuide.label }}</h3>

              <div class="permission-guide-list">
                <span
                  v-for="permissionLabel in roleGuide.permissionLabels"
                  :key="`${roleGuide.role}-${permissionLabel}`"
                  class="permission-chip"
                >
                  {{ permissionLabel }}
                </span>
              </div>
            </article>
          </div>
        </details>

        <p v-if="submitError" class="banner banner-error">
          {{ submitError }}
        </p>

        <p v-if="successMessage" class="banner banner-success">
          {{ successMessage }}
        </p>

        <div class="form-actions form-actions-inline">
          <button class="ghost-button" type="button" :disabled="isSubmitting" @click="$emit('reset')">
            Repor dados
          </button>

          <button class="primary-button" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'A guardar...' : 'Guardar alteracoes' }}
          </button>
        </div>
      </form>
    </template>
  </article>
</template>

<script>
import {
  formatInternalPermission,
  getInternalUserRoleLabel,
  getInternalUserStatusLabel,
} from '../../utils/internalUserPresentation'
import {
  getRolePermissionValues,
  INTERNAL_USER_ROLE_PERMISSION_GUIDE,
} from '../../constants/internalUserRolePermissionGuide'

// Stateless editor for the IT management sprint. The parent owns all state and
// decides when the selected account changes.
export default {
  name: 'InternalUserManagementPanel',
  props: {
    selectedUser: {
      type: Object,
      default: null,
    },
    userId: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'ACTIVE',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    roleOptions: {
      type: Array,
      required: true,
    },
    statusOptions: {
      type: Array,
      required: true,
    },
    fieldErrors: {
      type: Object,
      default: () => ({}),
    },
    submitError: {
      type: String,
      default: '',
    },
    successMessage: {
      type: String,
      default: '',
    },
    warnings: {
      type: Array,
      default: () => [],
    },
    isSubmitting: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'submit',
    'reset',
    'clear-selection',
    'update:user-id',
    'update:userId',
    'update:password',
    'update:role',
    'update:status',
    'update:is-active',
    'update:isActive',
  ],
  computed: {
    isProtectedItAccount() {
      return this.selectedUser?.internalRole === 'IT'
    },
    rolePermissionGuide() {
      return INTERNAL_USER_ROLE_PERMISSION_GUIDE
    },
    availableRoleOptions() {
      if (!this.isProtectedItAccount) {
        return this.roleOptions
      }

      return [
        {
          value: 'IT',
          label: 'IT (reservado)',
        },
        ...this.roleOptions,
      ]
    },
    effectivePermissions() {
      return getRolePermissionValues(this.role)
    },
  },
  methods: {
    emitUserIdUpdate(value) {
      this.$emit('update:user-id', value)
      this.$emit('update:userId', value)
    },
    emitIsActiveUpdate(value) {
      this.$emit('update:is-active', value)
      this.$emit('update:isActive', value)
    },
    roleLabel(role) {
      return getInternalUserRoleLabel(this.roleOptions, role)
    },
    statusLabel(status) {
      return getInternalUserStatusLabel(status)
    },
    formatPermission(permission) {
      return formatInternalPermission(permission)
    },
    formatDate(dateValue) {
      if (!dateValue) {
        return 'N/A'
      }

      const parsedDate = new Date(dateValue)

      return Number.isNaN(parsedDate.getTime())
        ? 'N/A'
        : parsedDate.toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
    },
  },
}
</script>

<style scoped>
.management-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  margin-bottom: 12px;
  border-radius: 18px;
  border: 1px solid rgba(59, 130, 246, 0.28);
  background: rgba(59, 130, 246, 0.12);
  box-shadow: 0 0 18px rgba(59, 130, 246, 0.16);
  font-size: 1.35rem;
  font-weight: 700;
  color: #bfdbfe;
}

.management-intro {
  margin-top: 8px;
  color: var(--muted);
  font-size: 0.95rem;
}

.management-empty {
  padding: 28px;
  border-radius: 14px;
  border: 1px dashed rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.35);
  color: #94a3b8;
  line-height: 1.7;
}

.management-overview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 28px;
}

.overview-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
}

.overview-card span {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
}

.overview-card strong {
  font-size: 1rem;
  color: #f8fafc;
}

.field-hint {
  margin: 6px 0 0;
  color: #94a3b8;
  font-size: 0.85rem;
  line-height: 1.5;
}

.field-boolean {
  justify-content: flex-end;
}

.toggle-field {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  color: #e2e8f0;
}

.toggle-field input {
  width: 18px;
  height: 18px;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 4px;
}

.permission-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  color: #e2e8f0;
}

.permission-option input {
  width: 16px;
  height: 16px;
}

.current-permissions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}

.permission-chip {
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.12);
  color: #bfdbfe;
  font-size: 0.8rem;
  font-weight: 500;
}

.banner-warning {
  background: rgba(245, 158, 11, 0.14);
  color: #fcd34d;
  border-color: rgba(245, 158, 11, 0.24);
}

.banner-info {
  background: rgba(59, 130, 246, 0.12);
  color: #bfdbfe;
  border-color: rgba(59, 130, 246, 0.24);
}

.warning-list {
  margin: 0;
  padding-left: 32px;
}

.warning-list li + li {
  margin-top: 8px;
}

.permission-guide {
  grid-column: 1 / -1;
  padding: 18px 20px;
  border-radius: 14px;
  border: 1px solid rgba(250, 204, 21, 0.18);
  background: rgba(15, 23, 42, 0.5);
}

.permission-guide summary {
  cursor: pointer;
  color: #fde68a;
  font-weight: 600;
  list-style: none;
}

.permission-guide summary::-webkit-details-marker {
  display: none;
}

.permission-guide summary::after {
  content: '+';
  float: right;
  font-size: 1rem;
}

.permission-guide[open] summary::after {
  content: '-';
}

.permission-guide-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.permission-guide-card {
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
}

.permission-guide-card h3 {
  margin: 0 0 12px;
  font-size: 0.95rem;
  color: #f8fafc;
}

.permission-guide-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.form-actions-inline {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
}

@media (max-width: 860px) {
  .management-overview,
  .permission-guide-grid,
  .permissions-grid,
  .form-actions-inline {
    grid-template-columns: 1fr;
  }
}
</style>
