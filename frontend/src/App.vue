<template>
  <div id="app">
    <CreateStation />
  </div>
</template>

<script>
import CreateStation from './components/CreateStation.vue'

export default {
  name: 'App',
  components: {
    CreateStation
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
