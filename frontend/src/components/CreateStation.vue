<template>
  <div class="create-station">
    <h2>Criar Nova Estação</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Nome da Estação:</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Ex: Estação Central"
        />
      </div>

      <div class="form-group">
        <label for="location">Localização/Endereço:</label>
        <input
          id="location"
          v-model="form.location"
          type="text"
          required
          placeholder="Ex: Rua Principal, 123, Cidade"
        />
      </div>

      <div class="form-group">
        <label for="capacity">Capacidade Máxima:</label>
        <input
          id="capacity"
          v-model.number="form.capacity"
          type="number"
          min="1"
          required
          placeholder="Ex: 50"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Criando...' : 'Criar Estação' }}
      </button>
    </form>

    <!-- Mensagens de feedback -->
    <div v-if="message" :class="messageType" class="message">
      {{ message }}
    </div>

    <!-- Lista de estações existentes (opcional) -->
    <div v-if="stations.length > 0" class="stations-list">
      <h3>Estações Existentes</h3>
      <ul>
        <li v-for="station in stations" :key="station.id">
          {{ station.name }} - {{ station.location }} (Cap: {{ station.capacity }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CreateStation',
  data() {
    return {
      form: {
        name: '',
        location: '',
        capacity: null,
      },
      loading: false,
      message: '',
      messageType: '', // 'success' ou 'error'
      stations: [], // Para listar estações existentes
    };
  },
  mounted() {
    this.loadStations(); // Carregar estações existentes ao montar
  },
  methods: {
    async submitForm() {
      this.loading = true;
      this.message = '';
      try {
        await axios.post('http://localhost:3000/stations', this.form);
        this.message = 'Estação criada com sucesso!';
        this.messageType = 'success';
        this.resetForm();
        this.loadStations(); // Recarregar lista
      } catch (error) {
        this.messageType = 'error';
        if (error.response && error.response.data && error.response.data.message) {
          this.message = error.response.data.message;
        } else {
          this.message = 'Erro ao criar estação. Tente novamente.';
        }
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.form.name = '';
      this.form.location = '';
      this.form.capacity = null;
    },
    async loadStations() {
      try {
        const response = await axios.get('http://localhost:3000/stations');
        this.stations = response.data;
      } catch (error) {
        console.error('Erro ao carregar estações:', error);
      }
    },
  },
};
</script>

<style scoped>
.create-station {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.stations-list {
  margin-top: 30px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f8f9fa;
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 4px;
}
</style>