<template>
  <InternalUsersView />
</template>

<script>
// Composition root for the internal user creation flow.
import './styles/internal-users.css'
import InternalUsersView from './views/InternalUsersView.vue'

export default {
  name: 'App',
  components: {
    InternalUsersView,
  },
}
</script>
