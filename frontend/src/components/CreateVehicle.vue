<template>
  <div class="super-modern-wrapper">
    <div class="glass-card">
      <header class="card-header">
        <div class="icon-wrap">
          <span class="icon">🚗</span>
        </div>
        <h2>{{ tr('title') }}</h2>
        <p>{{ tr('subtitle') }}</p>
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
          <label for="plateNumber">{{ tr('plateLabel') }}</label>
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
          <label for="brand">{{ tr('brandLabel') }}</label>
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
          <label for="model">{{ tr('modelLabel') }}</label>
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
          <label for="dailyRate">{{ tr('dailyRateLabel') }}</label>
          <span class="highlight"></span>
        </div>

        <button type="submit" class="btn-gradient" :disabled="loading">
          <span v-if="!loading">{{ tr('submit') }}</span>
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
import { getLocaleState } from '../services/i18n'

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:3000'

const TRANSLATIONS = {
  pt: {
    title: 'Novo Veiculo',
    subtitle: 'Registe novas viaturas no parque interno.',
    plateLabel: 'Matricula',
    brandLabel: 'Marca',
    modelLabel: 'Modelo',
    dailyRateLabel: 'Preco Diario (EUR)',
    submit: 'Registar Veiculo',
    dailyRatePositive: 'O preco diario deve ser superior a zero.',
    createdSuccess: 'Veiculo criado com sucesso!',
    serverErrorPrefix: 'Erro: {message}',
    serverCommunicationError: 'Erro ao comunicar com o servidor.',
  },
  en: {
    title: 'New Vehicle',
    subtitle: 'Register new vehicles in the internal fleet.',
    plateLabel: 'Plate Number',
    brandLabel: 'Brand',
    modelLabel: 'Model',
    dailyRateLabel: 'Daily Rate (EUR)',
    submit: 'Register Vehicle',
    dailyRatePositive: 'Daily rate must be greater than zero.',
    createdSuccess: 'Vehicle created successfully!',
    serverErrorPrefix: 'Error: {message}',
    serverCommunicationError: 'Unable to communicate with the server.',
  },
  es: {
    title: 'Nuevo Vehiculo',
    subtitle: 'Registre nuevos vehiculos en la flota interna.',
    plateLabel: 'Matricula',
    brandLabel: 'Marca',
    modelLabel: 'Modelo',
    dailyRateLabel: 'Precio Diario (EUR)',
    submit: 'Registrar Vehiculo',
    dailyRatePositive: 'El precio diario debe ser mayor que cero.',
    createdSuccess: 'Vehiculo creado con exito.',
    serverErrorPrefix: 'Error: {message}',
    serverCommunicationError: 'No se pudo comunicar con el servidor.',
  },
}

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
      localeState: getLocaleState(),
    }
  },
  methods: {
    tr(key, params = {}) {
      const locale = this.localeState.locale
      const template =
        (TRANSLATIONS[locale] && TRANSLATIONS[locale][key]) ||
        TRANSLATIONS.pt[key] ||
        key

      return Object.entries(params).reduce(
        (result, [paramKey, value]) =>
          result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value)),
        template,
      )
    },
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
        this.showFeedback(this.tr('dailyRatePositive'), 'error')
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
        this.showFeedback(this.tr('createdSuccess'), 'success')
        this.resetForm()
      } catch (err) {
        const details = err?.response?.data?.details
        const backendMessage =
          (Array.isArray(details) && details.length > 0 ? details.join(' | ') : null) ||
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message

        this.showFeedback(
          backendMessage
            ? this.tr('serverErrorPrefix', { message: backendMessage })
            : this.tr('serverCommunicationError'),
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