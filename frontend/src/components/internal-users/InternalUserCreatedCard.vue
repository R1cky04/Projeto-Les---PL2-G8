<template>
  <article class="panel panel-result">
    <div class="panel-head">
      <div>
        <p class="panel-label">{{ $t('internalUsers.resultLabel') }}</p>
        <h2>{{ $t('internalUsers.accountCreated') }}</h2>
      </div>
    </div>

    <div class="result-grid">
      <div>
        <span class="result-key">{{ $t('internalUsers.userIdLabel') }}</span>
        <strong>{{ createdUser.userId }}</strong>
      </div>
      <div>
        <span class="result-key">{{ $t('internalUsers.profile') }}</span>
        <strong>{{ roleLabel(createdUser.role) }}</strong>
      </div>
      <div>
        <span class="result-key">{{ $t('internalUsers.status') }}</span>
        <strong>{{ createdUser.status }}</strong>
      </div>
      <div>
        <span class="result-key">{{ $t('internalUsers.active') }}</span>
        <strong>{{ createdUser.isActive ? $t('internalUsers.yes') : $t('internalUsers.no') }}</strong>
      </div>
    </div>

    <div class="permissions-block">
      <span class="result-key">{{ $t('internalUsers.permissionsAssigned') }}</span>
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
