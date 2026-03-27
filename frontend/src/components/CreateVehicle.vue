<template>
  <div class="super-modern-wrapper">
    <div class="glass-card">
      <header class="card-header">
        <div class="icon-wrap">
          <span class="icon">🚗</span>
        </div>
        <h2>Novo Veiculo</h2>
        <p>Registe novas viaturas no parque interno.</p>
      </header>

      <form @submit.prevent="submitForm" class="modern-form">
        <div class="input-group">
          <input
            id="plateNumber"
            v-model="form.plateNumber"
            type="text"
            required
            placeholder=" "
          />
          <label for="plateNumber">Matricula</label>
          <span class="highlight"></span>
        </div>

        <div class="input-group">
          <input
            id="brand"
            v-model="form.brand"
            type="text"
            required
            placeholder=" "
          />
          <label for="brand">Marca</label>
          <span class="highlight"></span>
        </div>

        <div class="input-group">
          <input
            id="model"
            v-model="form.model"
            type="text"
            required
            placeholder=" "
          />
          <label for="model">Modelo</label>
          <span class="highlight"></span>
        </div>

        <div class="input-group">
          <input
            id="dailyRate"
            v-model.number="form.dailyRate"
            type="number"
            min="0.01"
            step="0.01"
            required
            placeholder=" "
          />
          <label for="dailyRate">Preco Diario (EUR)</label>
          <span class="highlight"></span>
        </div>

        <button type="submit" class="btn-gradient" :disabled="loading">
          <span v-if="!loading">Registar Veiculo</span>
          <div v-else class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </button>
      </form>

      <transition name="slide-fade">
        <div v-if="message" :class="['modern-alert', messageType]">
          <span class="alert-icon">{{ messageType === 'success' ? '✅' : '⚠️' }}</span>
          {{ message }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:3000'

export default {
  name: 'CreateVehicle',
  props: {
    sessionToken: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      form: {
        plateNumber: '',
        brand: '',
        model: '',
        dailyRate: null,
      },
      loading: false,
      message: '',
      messageType: '',
    }
  },
  methods: {
    buildAuthConfig() {
      if (!this.sessionToken) {
        return {}
      }

      return {
        headers: {
          Authorization: `Bearer ${this.sessionToken}`,
        },
      }
    },
    async submitForm() {
      if (!this.form.dailyRate || this.form.dailyRate <= 0) {
        this.showFeedback('O preco diario deve ser superior a zero.', 'error')
        return
      }

      this.loading = true
      try {
        await axios.post(
          `${API_BASE_URL}/vehicles`,
          {
            plateNumber: this.form.plateNumber,
            brand: this.form.brand,
            model: this.form.model,
            dailyRate: this.form.dailyRate,
          },
          this.buildAuthConfig(),
        )
        this.showFeedback('Veiculo criado com sucesso!', 'success')
        this.resetForm()
      } catch (err) {
        const details = err?.response?.data?.details
        const backendMessage =
          (Array.isArray(details) && details.length > 0 ? details.join(' | ') : null) ||
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message

        this.showFeedback(
          backendMessage ? `Erro: ${backendMessage}` : 'Erro ao comunicar com o servidor.',
          'error',
        )
      } finally {
        this.loading = false
      }
    },
    showFeedback(text, type) {
      this.message = text
      this.messageType = type
      setTimeout(() => (this.message = ''), 4000)
    },
    resetForm() {
      this.form = {
        plateNumber: '',
        brand: '',
        model: '',
        dailyRate: null,
      }
    },
  },
}
</script>

<style scoped src="../styles/create-station.css"></style>