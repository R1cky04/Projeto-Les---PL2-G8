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

      <section class="vehicle-builder">
        <div class="builder-step">
          <div class="step-head">
            <span class="step-index">1</span>
            <div>
              <h3>{{ tr('brandStepTitle') }}</h3>
              <p>{{ tr('brandStepDescription') }}</p>
            </div>
          </div>

          <div class="input-group">
            <select id="brand" v-model="selectedBrand">
              <option value="">{{ tr('brandPlaceholder') }}</option>
              <option v-for="brand in catalogBrands" :key="brand" :value="brand">
                {{ brand }}
              </option>
            </select>
            <label for="brand">{{ tr('brandLabel') }}</label>
            <span class="highlight"></span>
          </div>

          <p class="step-hint">{{ tr('brandHint', { count: catalogBrands.length }) }}</p>
        </div>

        <div class="builder-step" :class="{ disabled: !selectedBrand }">
          <div class="step-head">
            <span class="step-index">2</span>
            <div>
              <h3>{{ tr('modelStepTitle') }}</h3>
              <p>{{ tr('modelStepDescription') }}</p>
            </div>
          </div>

          <div class="input-group">
            <select id="model" v-model="selectedModel" :disabled="!selectedBrand">
              <option value="">{{ tr('modelPlaceholder') }}</option>
              <option v-for="model in selectedBrandModels" :key="model" :value="model">
                {{ model }}
              </option>
            </select>
            <label for="model">{{ tr('modelLabel') }}</label>
            <span class="highlight"></span>
          </div>

          <p class="step-hint">
            <span v-if="selectedBrand">{{ tr('modelCount', { count: selectedBrandModels.length }) }}</span>
            <span v-else>{{ tr('modelLockedHint') }}</span>
          </p>
        </div>

        <div class="builder-step" :class="{ disabled: !selectedModel }">
          <div class="step-head">
            <span class="step-index">3</span>
            <div>
              <h3>{{ tr('submodelStepTitle') }}</h3>
              <p>{{ tr('submodelStepDescription') }}</p>
            </div>
          </div>

          <div class="input-group">
            <select id="submodel" v-model="selectedSubmodel" :disabled="!selectedModel">
              <option value="">{{ tr('submodelPlaceholder') }}</option>
              <option v-for="submodel in selectedModelSubmodels" :key="submodel" :value="submodel">
                {{ submodel }}
              </option>
            </select>
            <label for="submodel">{{ tr('submodelLabel') }}</label>
            <span class="highlight"></span>
          </div>

          <p class="step-hint">
            <span v-if="selectedModel">{{ tr('submodelCount', { count: selectedModelSubmodels.length }) }}</span>
            <span v-else>{{ tr('submodelLockedHint') }}</span>
          </p>
        </div>
      </section>

      <section class="selected-model-card">
        <div>
          <span class="catalog-eyebrow">{{ tr('selectionEyebrow') }}</span>
          <h3>
            {{ selectedBrand && selectedModel
              ? formatSelectionSummary()
              : tr('selectionEmpty') }}
          </h3>
          <p>{{ selectedBrand && selectedModel ? tr('selectionReady') : tr('selectionPrompt') }}</p>
        </div>
        <button type="button" class="auth-secondary-button" @click="clearSelection">
          {{ tr('clearSelection') }}
        </button>
      </section>

      <form @submit.prevent="submitForm" class="modern-form">
        <div class="input-group">
          <input
            id="plateNumber"
            v-model.trim="form.plateNumber"
            @input="formatPlateInput"
            type="text"
            maxlength="8"
            inputmode="text"
            autocapitalize="characters"
            required
            placeholder="AA-11-BB"
          />
          <label for="plateNumber">{{ tr('plateLabel') }}</label>
          <span class="highlight"></span>
        </div>

        <div class="input-group">
          <input
            id="year"
            v-model.number="form.year"
            type="number"
            min="1980"
            :max="catalogYear"
            placeholder=" "
          />
          <label for="year">{{ tr('yearLabel') }}</label>
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
import { getLocaleState } from '../../services/i18n'
import {
  VEHICLE_CATALOG_YEAR,
  getCatalogBrands,
  getCatalogModels,
  getCatalogSubmodels,
} from '../../constants/vehicleCatalog'
import { formatPlateForDisplay, isValidPortuguesePlate } from '../../utils/plateFormatting'

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:3000'

const TRANSLATIONS = {
  pt: {
    title: 'Novo Veiculo',
    subtitle: 'Primeiro escolhe a marca. Depois o modelo. Por fim o submodelo.',
    brandStepTitle: 'Marca',
    brandStepDescription: 'Escolhe primeiro a marca do veiculo.',
    modelStepTitle: 'Modelo',
    modelStepDescription: 'Os modelos aparecem apenas depois de escolheres a marca.',
    submodelStepTitle: 'Submodelo',
    submodelStepDescription: 'Escolhe a versao especifica do modelo selecionado.',
    brandPlaceholder: 'Selecionar marca',
    modelPlaceholder: 'Selecionar modelo',
    submodelPlaceholder: 'Selecionar submodelo',
    brandHint: '{count} marcas disponiveis.',
    modelCount: '{count} modelos disponiveis para esta marca.',
    submodelCount: '{count} submodelos disponiveis para este modelo.',
    modelLockedHint: 'Seleciona uma marca para desbloquear os modelos.',
    submodelLockedHint: 'Seleciona um modelo para desbloquear os submodelos.',
    selectionEyebrow: 'Selecao atual',
    selectionEmpty: 'Nenhum modelo selecionado',
    selectionPrompt: 'Escolhe marca, modelo e submodelo para preencher a ficha do veiculo.',
    selectionReady: 'A selecao esta pronta para registo.',
    clearSelection: 'Limpar selecao',
    plateLabel: 'Matricula',
    brandLabel: 'Marca',
    modelLabel: 'Modelo',
    submodelLabel: 'Submodelo',
    yearLabel: 'Ano',
    dailyRateLabel: 'Preco Diario (EUR)',
    submit: 'Registar Veiculo',
    dailyRatePositive: 'O preco diario deve ser superior a zero.',
    createdSuccess: 'Veiculo criado com sucesso!',
    selectBrandFirst: 'Seleciona primeiro uma marca.',
    selectModelFirst: 'Seleciona primeiro um modelo.',
    selectSubmodelFirst: 'Seleciona primeiro um submodelo.',
    serverErrorPrefix: 'Erro: {message}',
    serverCommunicationError: 'Erro ao comunicar com o servidor.',
  },
  en: {
    title: 'New Vehicle',
    subtitle: 'Pick brand first, then model, then the specific submodel.',
    brandStepTitle: 'Brand',
    brandStepDescription: 'Choose the vehicle brand first.',
    modelStepTitle: 'Model',
    modelStepDescription: 'Models appear only after selecting a brand.',
    submodelStepTitle: 'Submodel',
    submodelStepDescription: 'Choose the specific version of the selected model.',
    brandPlaceholder: 'Select brand',
    modelPlaceholder: 'Select model',
    submodelPlaceholder: 'Select submodel',
    brandHint: '{count} brands available.',
    modelCount: '{count} models available for this brand.',
    submodelCount: '{count} submodels available for this model.',
    modelLockedHint: 'Select a brand to unlock the models.',
    submodelLockedHint: 'Select a model to unlock the submodels.',
    selectionEyebrow: 'Current selection',
    selectionEmpty: 'No model selected',
    selectionPrompt: 'Choose brand, model and submodel to fill the vehicle record.',
    selectionReady: 'The selection is ready to register.',
    clearSelection: 'Clear selection',
    plateLabel: 'Plate Number',
    brandLabel: 'Brand',
    modelLabel: 'Model',
    submodelLabel: 'Submodel',
    yearLabel: 'Year',
    dailyRateLabel: 'Daily Rate (EUR)',
    submit: 'Register Vehicle',
    dailyRatePositive: 'Daily rate must be greater than zero.',
    createdSuccess: 'Vehicle created successfully!',
    selectBrandFirst: 'Select a brand first.',
    selectModelFirst: 'Select a model first.',
    selectSubmodelFirst: 'Select a submodel first.',
    serverErrorPrefix: 'Error: {message}',
    serverCommunicationError: 'Unable to communicate with the server.',
  },
  es: {
    title: 'Nuevo Vehiculo',
    subtitle: 'Primero la marca, luego el modelo y despues el submodelo.',
    brandStepTitle: 'Marca',
    brandStepDescription: 'Elija primero la marca del vehiculo.',
    modelStepTitle: 'Modelo',
    modelStepDescription: 'Los modelos aparecen solo despues de elegir la marca.',
    submodelStepTitle: 'Submodelo',
    submodelStepDescription: 'Elija la version especifica del modelo seleccionado.',
    brandPlaceholder: 'Seleccionar marca',
    modelPlaceholder: 'Seleccionar modelo',
    submodelPlaceholder: 'Seleccionar submodelo',
    brandHint: '{count} marcas disponibles.',
    modelCount: '{count} modelos disponibles para esta marca.',
    submodelCount: '{count} submodelos disponibles para este modelo.',
    modelLockedHint: 'Seleccione una marca para desbloquear los modelos.',
    submodelLockedHint: 'Seleccione un modelo para desbloquear los submodelos.',
    selectionEyebrow: 'Seleccion actual',
    selectionEmpty: 'Ningun modelo seleccionado',
    selectionPrompt: 'Elija marca, modelo y submodelo para completar la ficha del vehiculo.',
    selectionReady: 'La seleccion esta lista para registrar.',
    clearSelection: 'Limpiar seleccion',
    plateLabel: 'Matricula',
    brandLabel: 'Marca',
    modelLabel: 'Modelo',
    submodelLabel: 'Submodelo',
    yearLabel: 'Ano',
    dailyRateLabel: 'Precio Diario (EUR)',
    submit: 'Registrar Vehiculo',
    dailyRatePositive: 'El precio diario debe ser mayor que cero.',
    createdSuccess: 'Vehiculo creado con exito.',
    selectBrandFirst: 'Seleccione primero una marca.',
    selectModelFirst: 'Seleccione primero un modelo.',
    selectSubmodelFirst: 'Seleccione primero un submodelo.',
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
        submodel: '',
        year: VEHICLE_CATALOG_YEAR,
        dailyRate: null,
      },
      selectedBrand: '',
      selectedModel: '',
      selectedSubmodel: '',
      loading: false,
      message: '',
      messageType: '',
      localeState: getLocaleState(),
      catalogYear: VEHICLE_CATALOG_YEAR,
    }
  },
  computed: {
    catalogBrands() {
      return getCatalogBrands()
    },
    selectedBrandModels() {
      return getCatalogModels(this.selectedBrand)
    },
    selectedModelSubmodels() {
      return getCatalogSubmodels(this.selectedBrand, this.selectedModel)
    },
  },
  watch: {
    selectedBrand(newBrand) {
      this.form.brand = newBrand || ''
      this.selectedModel = ''
      this.selectedSubmodel = ''
      this.form.model = ''
      this.form.submodel = ''
    },
    selectedModel(newModel) {
      this.form.model = newModel || ''
      this.selectedSubmodel = ''
      this.form.submodel = ''
    },
    selectedSubmodel(newSubmodel) {
      this.form.submodel = newSubmodel || ''
    },
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
    formatSelectionSummary() {
      return [this.selectedBrand, this.selectedModel, this.selectedSubmodel]
        .filter(Boolean)
        .join(' • ')
    },
    clearSelection() {
      this.selectedBrand = ''
      this.selectedModel = ''
      this.selectedSubmodel = ''
      this.form.brand = ''
      this.form.model = ''
      this.form.submodel = ''
      this.form.year = VEHICLE_CATALOG_YEAR
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
      if (!this.selectedBrand) {
        this.showFeedback(this.tr('selectBrandFirst'), 'error')
        return
      }

      if (!this.selectedModel) {
        this.showFeedback(this.tr('selectModelFirst'), 'error')
        return
      }

      if (!this.selectedSubmodel) {
        this.showFeedback(this.tr('selectSubmodelFirst'), 'error')
        return
      }

      if (!this.form.dailyRate || this.form.dailyRate <= 0) {
        this.showFeedback(this.tr('dailyRatePositive'), 'error')
        return
      }

      // Validate Portuguese plate format: AA-11-BB
      if (!isValidPortuguesePlate(this.form.plateNumber)) {
        this.showFeedback('Matricula inválida — use o formato AA-11-BB', 'error')
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
            submodel: this.form.submodel,
            year: this.form.year,
            dailyRate: this.form.dailyRate,
          },
          this.buildAuthConfig(),
        )
        this.showFeedback(this.tr('createdSuccess'), 'success')
        this.clearSelection()
        this.form.plateNumber = ''
        this.form.dailyRate = null
      } catch (error) {
        const details = error?.response?.data?.details
        const backendMessage =
          (Array.isArray(details) && details.length > 0 ? details.join(' | ') : null) ||
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message

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
    formatPlateInput(event) {
      this.form.plateNumber = formatPlateForDisplay(event.target.value)
    },
    showFeedback(text, type) {
      this.message = text
      this.messageType = type
      setTimeout(() => (this.message = ''), 4000)
    },
  },
}
</script>

<style scoped src="../../styles/create-station.css"></style>

<style scoped>
.vehicle-builder {
  display: grid;
  gap: 18px;
  margin-bottom: 22px;
}

.builder-step,
.selected-model-card {
  padding: 18px;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(15, 23, 42, 0.74);
}

.builder-step.disabled {
  opacity: 0.65;
}

.step-head {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 14px;
}

.step-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: rgba(96, 165, 250, 0.18);
  color: #bfdbfe;
  font-weight: 800;
}

.step-head h3,
.selected-model-card h3 {
  margin: 0;
  color: #f8fafc;
  font-size: 1.05rem;
}

.step-head p,
.selected-model-card p,
.step-hint {
  margin: 6px 0 0;
  color: rgba(226, 232, 240, 0.72);
}

.step-hint {
  font-size: 0.92rem;
}

.selected-model-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.catalog-eyebrow {
  display: inline-block;
  margin-bottom: 6px;
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #93c5fd;
}

@media (max-width: 720px) {
  .selected-model-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
