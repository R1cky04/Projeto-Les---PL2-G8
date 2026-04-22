<template>
  <article class="panel panel-guidance">
    <div class="panel-head">
      <div>
        <p class="panel-label">{{ $t('internalUsers.hierarchy') }}</p>
        <h2>{{ $t('internalUsers.rolesAndInheritedPermissions') }}</h2>
      </div>
    </div>

    <div class="role-list">
      <article
        v-for="role in roleOptions"
        :key="role.value"
        class="role-card"
        :class="{ 'role-card-selected': selectedRole === role.value }"
      >
        <div class="role-topline">
          <strong>{{ role.label }}</strong>
          <span>{{ role.activationLabel }}</span>
        </div>
        <p>{{ role.description }}</p>
      </article>
    </div>
  </article>
</template>

<script>
// Read-only role guide driven by the shared role catalog.
export default {
  name: 'InternalUserRoleGuide',
  props: {
    roleOptions: {
      type: Array,
      required: true,
    },
    selectedRole: {
      type: String,
      required: true,
    },
  },
}
</script>
