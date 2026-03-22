<template>
  <InternalPortalView />
</template>

<script>
import './styles/internal-auth.css'
import './styles/internal-users.css'
import InternalPortalView from './views/InternalPortalView.vue'

// Composition root for the authenticated internal portal.
export default {
  name: 'App',
  components: {
    InternalPortalView,
  },
}
</script>
