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
        await axios.post('http://localhost:3000/stations', this.form, this.buildAuthConfig());
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

.super-modern-wrapper {
  font-family: 'Poppins', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* Gradiente estático de alta performance */
  background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
  margin: 0;
  padding: 20px;
}

.glass-card {
  background: rgba(30, 41, 59, 0.7);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  padding: 40px;
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 10;
}

.card-header {
  text-align: center;
  margin-bottom: 40px;
}

.icon-wrap {
  width: 70px;
  height: 70px;
  background: rgba(56, 189, 248, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.icon { font-size: 2.2rem; }
.card-header h2 { color: #fff; margin: 0; font-size: 1.6rem; font-weight: 700; }
.card-header p { color: #94a3b8; font-size: 0.95rem; margin-top: 8px; }

.modern-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.input-group {
  position: relative;
  display: flex;
  flex-direction: column;
}

.input-group input {
  width: 100%;
  padding: 10px 0;
  background: transparent;
  border: none;
  border-bottom: 2px solid #334155;
  color: #f8fafc;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.input-group label {
  position: absolute;
  top: 10px;
  left: 0;
  color: #64748b;
  pointer-events: none;
  transition: all 0.3s ease;
}

/* Lógica da Label Flutuante corrigida para não empurrar o texto */
.input-group input:focus ~ label,
.input-group input:not(:placeholder-shown) ~ label {
  transform: translateY(-28px);
  font-size: 0.8rem;
  color: #38bdf8;
  font-weight: 600;
}

.highlight {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #38bdf8;
  transition: 0.3s ease;
}

.input-group input:focus ~ .highlight {
  width: 100%;
}

.capacity-group {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.cap-visual {
  background: rgba(56, 189, 248, 0.1);
  padding: 6px 14px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.cap-count { color: #38bdf8; font-weight: 700; font-size: 0.95rem; }

.btn-gradient {
  background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 15px;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
}

.btn-gradient:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.5);
}

.btn-gradient:disabled { opacity: 0.5; cursor: not-allowed; }

.modern-alert {
  margin-top: 25px;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 600;
}

.modern-alert.success { background: rgba(16, 185, 129, 0.1); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.2); }
.modern-alert.error { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }

/* Spinner */
.lds-ellipsis { display: inline-block; position: relative; width: 64px; height: 20px; }
.lds-ellipsis div { position: absolute; top: 0; width: 10px; height: 10px; border-radius: 50%; background: #fff; animation: lds-ellipsis 0.6s infinite; }
.lds-ellipsis div:nth-child(1) { left: 8px; animation-delay: -0.24s; }
.lds-ellipsis div:nth-child(2) { left: 8px; animation-delay: -0.12s; }
.lds-ellipsis div:nth-child(3) { left: 32px; animation-delay: 0s; }
.lds-ellipsis div:nth-child(4) { left: 56px; animation-delay: 0.12s; }

@keyframes lds-ellipsis { 0% { transform: scale(0); opacity: 0; } 50% { opacity: 1; } 100% { transform: scale(1); opacity: 0; } }

.slide-fade-enter-active { transition: all 0.3s ease; }
.slide-fade-enter { transform: translateY(10px); opacity: 0; }
</style>