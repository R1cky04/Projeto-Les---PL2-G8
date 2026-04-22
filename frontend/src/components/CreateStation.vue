<template>
  <div class="super-modern-wrapper">
    <div class="glass-card">
      <header class="card-header">
        <div class="icon-wrap">
          <span class="icon">🏢</span>
        </div>
        <h2>{{ tr('title') }}</h2>
        <p>{{ tr('subtitle') }}</p>
      </header>

      <form @submit.prevent="submitForm" class="modern-form">
        <div class="input-group">
          <input 
            id="name"
            v-model="form.name" 
            type="text" 
            required 
            placeholder=" "
          />
          <label for="name">{{ tr('nameLabel') }}</label>
          <span class="highlight"></span>
        </div>

        <div class="input-group">
          <input 
            id="location"
            v-model="form.location" 
            type="text" 
            required 
            placeholder=" "
          />
          <label for="location">{{ tr('locationLabel') }}</label>
          <span class="highlight"></span>
        </div>

        <div class="input-group capacity-group">
          <input 
            id="capacity"
            v-model.number="form.capacity" 
            type="number" 
            min="1" 
            required 
            placeholder=" "
          />
          <label for="capacity">{{ tr('capacityLabel') }}</label>
          <span class="highlight"></span>
          <div class="cap-visual" v-if="form.capacity > 0">
            <span>🚘</span>
            <span class="cap-count">{{ form.capacity }}</span>
          </div>
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
import axios from 'axios';
import { getLocaleState } from '../services/i18n';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:3000';

const TRANSLATIONS = {
  pt: {
    title: 'Nova Estacao',
    subtitle: 'Expanda a rede de mobilidade Rent-a-Car.',
    nameLabel: 'Nome da Estacao',
    locationLabel: 'Localizacao / Morada',
    capacityLabel: 'Capacidade Maxima',
    submit: 'Registar Estacao',
    capacityPositive: 'A capacidade deve ser positiva.',
    createdSuccess: 'Estacao registada com sucesso!',
    serverErrorPrefix: 'Erro: {message}',
    serverCommunicationError: 'Erro ao comunicar com o servidor.',
  },
  en: {
    title: 'New Station',
    subtitle: 'Expand the Rent-a-Car mobility network.',
    nameLabel: 'Station Name',
    locationLabel: 'Location / Address',
    capacityLabel: 'Maximum Capacity',
    submit: 'Register Station',
    capacityPositive: 'Capacity must be positive.',
    createdSuccess: 'Station registered successfully!',
    serverErrorPrefix: 'Error: {message}',
    serverCommunicationError: 'Unable to communicate with the server.',
  },
  es: {
    title: 'Nueva Estacion',
    subtitle: 'Amplie la red de movilidad Rent-a-Car.',
    nameLabel: 'Nombre de la Estacion',
    locationLabel: 'Ubicacion / Direccion',
    capacityLabel: 'Capacidad Maxima',
    submit: 'Registrar Estacion',
    capacityPositive: 'La capacidad debe ser positiva.',
    createdSuccess: 'Estacion registrada con exito.',
    serverErrorPrefix: 'Error: {message}',
    serverCommunicationError: 'No se pudo comunicar con el servidor.',
  },
};

export default {
  name: 'CreateStation',
  props: {
    sessionToken: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      form: { name: '', location: '', capacity: null },
      loading: false,
      message: '',
      messageType: '',
      localeState: getLocaleState(),
    };
  },
  methods: {
    tr(key, params = {}) {
      const locale = this.localeState.locale;
      const template =
        (TRANSLATIONS[locale] && TRANSLATIONS[locale][key]) ||
        TRANSLATIONS.pt[key] ||
        key;

      return Object.entries(params).reduce(
        (result, [paramKey, value]) => result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value)),
        template,
      );
    },
    buildAuthConfig() {
      if (!this.sessionToken) {
        return {};
      }

      return {
        headers: {
          Authorization: `Bearer ${this.sessionToken}`,
        },
      };
    },
    async submitForm() {
      if (this.form.capacity <= 0) {
        this.showFeedback(this.tr('capacityPositive'), 'error');
        return;
      }

      this.loading = true;
      try {
        await axios.post(`${API_BASE_URL}/stations`, this.form, this.buildAuthConfig());
        this.showFeedback(this.tr('createdSuccess'), 'success');
        this.resetForm();
      } catch (err) {
        const details = err?.response?.data?.details;
        const backendMessage =
          (Array.isArray(details) && details.length > 0 ? details.join(' | ') : null) ||
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message;

        this.showFeedback(
          backendMessage
            ? this.tr('serverErrorPrefix', { message: backendMessage })
            : this.tr('serverCommunicationError'),
          'error'
        );
      } finally {
        this.loading = false;
      }
    },
    showFeedback(text, type) {
      this.message = text;
      this.messageType = type;
      setTimeout(() => this.message = '', 4000);
    },
    resetForm() {
      this.form = { name: '', location: '', capacity: null };
    }
  }
};
</script>

<style scoped src="../styles/components/create-station.css"></style>

