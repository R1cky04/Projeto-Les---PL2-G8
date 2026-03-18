<template>
  <article class="panel panel-result">
    <div class="panel-head">
      <div>
        <p class="panel-label">Resultado</p>
        <h2>Conta criada</h2>
      </div>
    </div>

    <div class="result-grid">
      <div>
        <span class="result-key">User ID</span>
        <strong>{{ createdUser.userId }}</strong>
      </div>
      <div>
        <span class="result-key">Perfil</span>
        <strong>{{ roleLabel(createdUser.role) }}</strong>
      </div>
      <div>
        <span class="result-key">Estado</span>
        <strong>{{ createdUser.status }}</strong>
      </div>
      <div>
        <span class="result-key">Ativa</span>
        <strong>{{ createdUser.isActive ? 'Sim' : 'Nao' }}</strong>
      </div>
    </div>

    <div class="permissions-block">
      <span class="result-key">Permissoes associadas</span>
      <div class="permission-list">
        <span
          v-for="permission in createdUser.permissions"
          :key="permission"
          class="permission-tag"
        >
          {{ formatPermission(permission) }}
        </span>
      </div>
    </div>
  </article>
</template>

<script>
// Renders the success payload returned by the API.
import {
  formatInternalPermission,
  getInternalUserRoleLabel,
} from '../../utils/internalUserPresentation'

export default {
  name: 'InternalUserCreatedCard',
  props: {
    createdUser: {
      type: Object,
      required: true,
    },
    roleOptions: {
      type: Array,
      required: true,
    },
  },
  methods: {
    roleLabel(role) {
      return getInternalUserRoleLabel(this.roleOptions, role)
    },
    formatPermission(permission) {
      return formatInternalPermission(permission)
    },
  },
}
</script>
