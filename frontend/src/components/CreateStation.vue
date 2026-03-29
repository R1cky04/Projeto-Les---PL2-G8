<template>
  <div class="super-modern-wrapper">
    <div class="glass-card">
      <header class="card-header">
        <div class="icon-wrap">
          <span class="icon">🏢</span>
        </div>
        <h2>Nova Estação</h2>
        <p>Expanda a rede de mobilidade Rent-a-Car.</p>
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
          <label for="name">Nome da Estação</label>
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
          <label for="location">Localização / Morada</label>
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
          <label for="capacity">Capacidade Máxima</label>
          <span class="highlight"></span>
          <div class="cap-visual" v-if="form.capacity > 0">
            <span>🚘</span>
            <span class="cap-count">{{ form.capacity }}</span>
          </div>
        </div>

        <button type="submit" class="btn-gradient" :disabled="loading">
          <span v-if="!loading">Registar Estação</span>
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

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:3000';

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
      messageType: ''
    };
  },
  methods: {
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
        this.showFeedback('A capacidade deve ser positiva.', 'error');
        return;
      }

      this.loading = true;
      try {
        await axios.post(`${API_BASE_URL}/stations`, this.form, this.buildAuthConfig());
        this.showFeedback('Estação registada com sucesso!', 'success');
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
            ? `Erro: ${backendMessage}`
            : 'Erro ao comunicar com o servidor.',
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

