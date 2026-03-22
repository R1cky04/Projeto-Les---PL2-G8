<template>
  <ManageStation />
</template>

<script>
import ManageStation from './components/ManageStation.vue'

// Temporary root for direct desktop testing of station management.
export default {
  name: 'App',
  components: {
    ManageStation,
  },
}
</script>
