<template>
  <section class="impro-shell">
    <header class="impro-header">
      <div>
        <p class="impro-eyebrow">Operacoes de transferencia</p>
        <h2>Criar e gerir impros</h2>
        <p class="impro-intro">
          Fluxo rapido e intuitivo para criar, gerir, encerrar e consultar historico de impros.
        </p>
      </div>

      <div class="impro-pill-row">
        <span class="impro-pill">Ativos: {{ activeImprosCount }}</span>
        <span class="impro-pill impro-pill-strong">Total: {{ totalImprosCount }}</span>
      </div>
    </header>

    <p v-if="banner.message" :class="['impro-banner', `impro-banner-${banner.type}`]">
      {{ banner.message }}
    </p>

    <section class="impro-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="impro-tab"
        :class="{ 'is-active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </section>

    <section v-if="activeTab === 'CREATE'" class="impro-grid">
      <article class="impro-panel impro-panel-main">
        <h3>Criar Impro</h3>
        <form class="impro-form" @submit.prevent="handleCreateImpro">
          <div class="impro-field impro-field-full">
            <span>Pesquisar veiculo por matricula</span>
            <input
              v-model.trim="vehicleSearchDraft"
              type="search"
              placeholder="Ex: AA-11-BB"
              @input="handleVehicleSearchInput"
            />

            <div v-if="createForm.vehicleId" class="impro-selected-vehicle">
              <strong>Veiculo selecionado:</strong>
              <span>
                #{{ selectedCreateVehicle.id }} | {{ selectedCreateVehicle.plate }} | {{ selectedCreateVehicle.model }}
              </span>
              <small>
                Origem automatica: {{ getStationName(selectedCreateVehicle.currentStationId) }}
              </small>
            </div>

            <div class="impro-vehicle-results">
              <button
                v-for="vehicle in filteredAvailableVehicles"
                :key="vehicle.id"
                type="button"
                class="impro-vehicle-option"
                :class="{ 'is-active': createForm.vehicleId === vehicle.id }"
                @click="selectVehicle(vehicle.id)"
              >
                <strong>{{ vehicle.plate }}</strong>
                <small>#{{ vehicle.id }} | {{ vehicle.model }}</small>
              </button>
            </div>

            <p
              v-if="filteredAvailableVehicles.length === 0"
              class="impro-empty"
            >
              Nenhum veiculo disponivel para a matricula pesquisada.
            </p>
          </div>

          <label class="impro-field">
            <span>Estacao de destino</span>
            <select v-model.number="createForm.destinationStationId" required>
              <option :value="0" disabled>Selecionar destino</option>
              <option
                v-for="station in createDestinationStations"
                :key="`destination-${station.id}`"
                :value="station.id"
              >
                {{ station.name }}
              </option>
            </select>
          </label>

          <div class="impro-split-grid">
            <label class="impro-field">
              <span>Data de transferencia</span>
              <input v-model="createForm.transferDate" type="datetime-local" />
              <div class="impro-date-actions">
                <button type="button" class="impro-ghost" @click="applyDateShortcut('createTransfer', 'NOW')">
                  Agora
                </button>
                <button type="button" class="impro-ghost" @click="applyDateShortcut('createTransfer', 'PLUS_2H')">
                  +2h
                </button>
                <button type="button" class="impro-ghost" @click="applyDateShortcut('createTransfer', 'PLUS_1D')">
                  +1 dia
                </button>
              </div>
            </label>

            <label class="impro-field">
              <span>Chegada prevista</span>
              <input v-model="createForm.plannedArrivalDate" type="datetime-local" />
              <div class="impro-date-actions">
                <button type="button" class="impro-ghost" @click="applyDateShortcut('createArrival', 'PLUS_2H')">
                  +2h
                </button>
                <button type="button" class="impro-ghost" @click="applyDateShortcut('createArrival', 'PLUS_1D')">
                  +1 dia
                </button>
                <button type="button" class="impro-ghost" @click="applyDateShortcut('createArrival', 'CLEAR')">
                  Limpar
                </button>
              </div>
            </label>
          </div>

          <label class="impro-field impro-field-full">
            <span>Notas</span>
            <textarea
              v-model="createForm.notes"
              rows="3"
              placeholder="Observacoes da transferencia"
            ></textarea>
          </label>

          <button class="impro-primary" type="submit" :disabled="loading.create">
            {{ loading.create ? 'A criar...' : 'Confirmar criacao do impro' }}
          </button>
        </form>
      </article>

      <article class="impro-panel">
        <h3>Regras validadas</h3>
        <ul class="impro-check-list">
          <li>Pesquisa do veiculo por matricula.</li>
          <li>Origem definida automaticamente pela estacao atual do veiculo.</li>
          <li>Apenas selecao da estacao de destino.</li>
          <li>Destino deve ser diferente da origem automatica.</li>
        </ul>
      </article>
    </section>

    <section v-else-if="activeTab === 'MANAGE'" class="impro-grid">
      <article class="impro-panel impro-panel-main">
        <div class="impro-panel-head">
          <h3>Gerir Impro</h3>
          <label class="impro-search">
            <span>Pesquisar</span>
            <input
              v-model="searchDraft"
              type="search"
              placeholder="codigo, matricula, estado"
              @keyup.enter="refreshImpros"
            />
          </label>
        </div>

        <div class="impro-list-wrap">
          <div
            v-for="item in impros"
            :key="item.id"
            class="impro-row"
            :class="{ 'is-selected': selectedImproId === item.id }"
            @click="selectImpro(item.id)"
          >
            <div>
              <strong>{{ item.improCode }}</strong>
              <p>{{ item.vehiclePlate }} | {{ formatStatus(item.status) }}</p>
            </div>
            <small>{{ formatDate(item.transferDate) }}</small>
          </div>

          <p v-if="impros.length === 0" class="impro-empty">Nenhum impro encontrado.</p>
        </div>
      </article>

      <article class="impro-panel" v-if="selectedImpro">
        <section class="impro-manage-section">
          <h3>Atualizar movimento</h3>
          <form class="impro-form" @submit.prevent="handleUpdateImpro">
          <label class="impro-field">
            <span>Destino</span>
            <select v-model.number="updateForm.destinationStationId" :disabled="selectedImpro.status === 'CLOSED'">
              <option :value="0">Sem alteracao</option>
              <option
                v-for="station in stations"
                :key="`update-destination-${station.id}`"
                :value="station.id"
              >
                {{ station.name }}
              </option>
            </select>
          </label>

          <label class="impro-field">
            <span>Data prevista de chegada</span>
            <input v-model="updateForm.plannedArrivalDate" type="datetime-local" :disabled="selectedImpro.status === 'CLOSED'" />
            <div class="impro-date-actions">
              <button type="button" class="impro-ghost" :disabled="selectedImpro.status === 'CLOSED'" @click="applyDateShortcut('updateArrival', 'PLUS_2H')">
                +2h
              </button>
              <button type="button" class="impro-ghost" :disabled="selectedImpro.status === 'CLOSED'" @click="applyDateShortcut('updateArrival', 'PLUS_1D')">
                +1 dia
              </button>
              <button type="button" class="impro-ghost" :disabled="selectedImpro.status === 'CLOSED'" @click="applyDateShortcut('updateArrival', 'CLEAR')">
                Limpar
              </button>
            </div>
          </label>

          <label class="impro-field">
            <span>Data de transferencia</span>
            <input v-model="updateForm.transferDate" type="datetime-local" :disabled="selectedImpro.status === 'CLOSED'" />
            <div class="impro-date-actions">
              <button type="button" class="impro-ghost" :disabled="selectedImpro.status === 'CLOSED'" @click="applyDateShortcut('updateTransfer', 'NOW')">
                Agora
              </button>
              <button type="button" class="impro-ghost" :disabled="selectedImpro.status === 'CLOSED'" @click="applyDateShortcut('updateTransfer', 'PLUS_2H')">
                +2h
              </button>
              <button type="button" class="impro-ghost" :disabled="selectedImpro.status === 'CLOSED'" @click="applyDateShortcut('updateTransfer', 'PLUS_1D')">
                +1 dia
              </button>
            </div>
          </label>

          <label class="impro-field impro-field-full">
            <span>Notas</span>
            <textarea v-model="updateForm.notes" rows="3" :disabled="selectedImpro.status === 'CLOSED'"></textarea>
          </label>

          <button class="impro-primary" type="submit" :disabled="loading.update || selectedImpro.status === 'CLOSED'">
            {{ loading.update ? 'A atualizar...' : 'Guardar alteracoes' }}
          </button>
          </form>
        </section>

        <section class="impro-manage-section impro-manage-divider">
          <div class="impro-section-head">
            <h3>Encerrar impro</h3>
            <span class="impro-status-chip" :class="selectedImpro.status === 'CLOSED' ? 'is-closed' : 'is-open'">
              {{ selectedImpro.status === 'CLOSED' ? 'Encerrado' : 'Ativo' }}
            </span>
          </div>

          <form class="impro-form" @submit.prevent="handleCloseImpro">
            <label class="impro-field">
              <span>Data real de chegada</span>
              <input v-model="closeForm.actualArrivalDate" type="datetime-local" :disabled="selectedImpro.status === 'CLOSED'" />
              <div class="impro-date-actions">
                <button type="button" class="impro-ghost" @click="applyDateShortcut('closeArrival', 'NOW')" :disabled="selectedImpro.status === 'CLOSED'">
                  Agora
                </button>
                <button type="button" class="impro-ghost" @click="applyDateShortcut('closeArrival', 'PLUS_2H')" :disabled="selectedImpro.status === 'CLOSED'">
                  +2h
                </button>
                <button type="button" class="impro-ghost" @click="applyDateShortcut('closeArrival', 'CLEAR')" :disabled="selectedImpro.status === 'CLOSED'">
                  Limpar
                </button>
              </div>
            </label>

            <label class="impro-field impro-field-full">
              <span>Notas de encerramento</span>
              <textarea v-model="closeForm.closureNotes" rows="2" :disabled="selectedImpro.status === 'CLOSED'"></textarea>
            </label>

            <label class="impro-check-toggle">
              <input v-model="closeForm.vehicleDamaged" type="checkbox" :disabled="selectedImpro.status === 'CLOSED'" />
              <span>Veiculo chegou com dano e deve seguir para manutencao.</span>
            </label>

            <button class="impro-primary impro-danger" type="submit" :disabled="loading.close || selectedImpro.status === 'CLOSED'">
              {{ loading.close ? 'A encerrar...' : 'Encerrar impro' }}
            </button>
          </form>
        </section>
      </article>

      <article class="impro-panel" v-else>
        <p class="impro-empty">Selecione um impro na lista para atualizar dados ou encerrar o movimento.</p>
      </article>
    </section>

    <section v-else class="impro-grid impro-grid-history">
      <article class="impro-panel impro-panel-main">
        <div class="impro-panel-head">
          <h3>Historico de Impros</h3>
          <div class="impro-history-actions">
            <button class="impro-ghost" type="button" @click="resetHistoryFilters">
              Limpar filtros
            </button>
            <button class="impro-primary impro-export" type="button" @click="exportHistoryCsv">
              Exportar CSV
            </button>
          </div>
        </div>

        <form class="impro-filter-grid" @submit.prevent="refreshHistory">
          <label class="impro-field">
            <span>Matricula</span>
            <input v-model.trim="historyFilters.vehiclePlate" type="search" placeholder="Ex: AA-11-BB" />
          </label>

          <label class="impro-field">
            <span>Estacao (origem ou destino)</span>
            <select v-model.number="historyFilters.stationId">
              <option :value="0">Todas</option>
              <option
                v-for="station in stations"
                :key="`history-station-${station.id}`"
                :value="station.id"
              >
                {{ station.name }}
              </option>
            </select>
          </label>

          <label class="impro-field">
            <span>Estado</span>
            <select v-model="historyFilters.status">
              <option value="">Todos</option>
              <option value="SCHEDULED">Agendado</option>
              <option value="IN_TRANSFER">Em transferencia</option>
              <option value="CLOSED">Encerrado</option>
            </select>
          </label>

          <label class="impro-field">
            <span>Data inicial</span>
            <input v-model="historyFilters.fromDate" type="datetime-local" />
          </label>

          <label class="impro-field">
            <span>Data final</span>
            <input v-model="historyFilters.toDate" type="datetime-local" />
          </label>

          <label class="impro-field impro-field-full">
            <span>Pesquisa livre</span>
            <input v-model.trim="historySearchDraft" type="search" placeholder="codigo, estado ou matricula" />
          </label>

          <button class="impro-primary" type="submit" :disabled="loading.history">
            {{ loading.history ? 'A filtrar...' : 'Aplicar filtros' }}
          </button>
        </form>

        <div class="impro-list-wrap impro-history-list">
          <article v-for="item in historyItems" :key="`history-${item.id}`" class="impro-row impro-row-history">
            <div>
              <strong>{{ item.improCode }} | {{ item.vehiclePlate }}</strong>
              <p>
                {{ getStationName(item.originStationId) }} -> {{ getStationName(item.destinationStationId) }}
              </p>
              <p>
                Transferencia: {{ formatDate(item.transferDate) }} | Estado: {{ formatStatus(item.status) }}
              </p>
            </div>
            <small>
              Atualizado em {{ formatDate(item.updatedAt) }}
            </small>
          </article>

          <p v-if="historyItems.length === 0" class="impro-empty">
            Nenhum impro encontrado para os filtros selecionados.
          </p>
        </div>
      </article>

      <article class="impro-panel">
        <h3>Leitura rapida</h3>
        <ul class="impro-check-list">
          <li>Filtro por matricula, estacao, estado e intervalo de datas.</li>
          <li>Pesquisa livre para acelerar localizacao de movimentos.</li>
          <li>Exportacao em CSV pronta para relatorio de operacao.</li>
          <li>Estado e datas visiveis na lista para decisao imediata.</li>
        </ul>
      </article>
    </section>
  </section>
</template>

<script>
import {
  closeImpro,
  createImpro,
  fetchImpros,
  fetchImproStations,
  fetchImproVehicles,
  updateImpro,
} from '../../services/improApi'

function toIsoDateTime(localDateTime) {
  if (!localDateTime) {
    return undefined
  }

  const parsed = new Date(localDateTime)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString()
}

function toLocalInputValue(dateValue) {
  if (!dateValue) {
    return ''
  }

  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) {
    return ''
  }

  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}T${String(parsed.getHours()).padStart(2, '0')}:${String(parsed.getMinutes()).padStart(2, '0')}`
}

export default {
  name: 'ImproOperationsView',
  props: {
    sessionToken: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tabs: [
        { key: 'CREATE', label: 'Criar Impro' },
        { key: 'MANAGE', label: 'Gerir Impro' },
        { key: 'HISTORY', label: 'Historico' },
      ],
      activeTab: 'CREATE',
      stations: [],
      vehicles: [],
      impros: [],
      historyItems: [],
      searchDraft: '',
      vehicleSearchDraft: '',
      historySearchDraft: '',
      selectedImproId: null,
      banner: {
        message: '',
        type: 'info',
      },
      loading: {
        bootstrap: false,
        create: false,
        update: false,
        close: false,
        history: false,
      },
      createForm: {
        vehicleId: 0,
        destinationStationId: 0,
        transferDate: '',
        plannedArrivalDate: '',
        notes: '',
      },
      updateForm: {
        destinationStationId: 0,
        transferDate: '',
        plannedArrivalDate: '',
        notes: '',
      },
      closeForm: {
        improId: 0,
        actualArrivalDate: '',
        closureNotes: '',
        vehicleDamaged: false,
      },
      historyFilters: {
        vehiclePlate: '',
        stationId: 0,
        status: '',
        fromDate: '',
        toDate: '',
      },
    }
  },
  computed: {
    selectedImpro() {
      return this.impros.find((item) => item.id === this.selectedImproId) || null
    },
    activeImpros() {
      return this.impros.filter((item) => item.status !== 'CLOSED')
    },
    activeImprosCount() {
      return this.activeImpros.length
    },
    totalImprosCount() {
      return this.historyItems.length > 0 ? this.historyItems.length : this.impros.length
    },
    availableVehicles() {
      return this.vehicles.filter((vehicle) => vehicle.status === 'AVAILABLE')
    },
    filteredAvailableVehicles() {
      return this.availableVehicles
    },
    selectedCreateVehicle() {
      return this.availableVehicles.find((vehicle) => vehicle.id === this.createForm.vehicleId) || null
    },
    createDestinationStations() {
      if (!this.selectedCreateVehicle) {
        return this.stations
      }

      return this.stations.filter(
        (station) => station.id !== this.selectedCreateVehicle.currentStationId,
      )
    },
  },
  async created() {
    await this.bootstrap()
  },
  methods: {
    async bootstrap() {
      this.loading.bootstrap = true
      try {
        const [stations, vehicles] = await Promise.all([
          fetchImproStations(this.sessionToken),
          fetchImproVehicles(this.sessionToken, { plate: '' }),
        ])

        this.stations = stations
        this.vehicles = vehicles

        await Promise.all([this.refreshImpros(), this.refreshHistory()])
      } catch (error) {
        this.showBanner(error.message || 'Falha ao inicializar modulo de impros.', 'error')
      } finally {
        this.loading.bootstrap = false
      }
    },
    async handleVehicleSearchInput() {
      try {
        const vehicles = await fetchImproVehicles(this.sessionToken, {
          plate: this.vehicleSearchDraft,
        })
        this.vehicles = Array.isArray(vehicles) ? vehicles : []

        if (
          this.createForm.vehicleId &&
          !this.vehicles.some((vehicle) => vehicle.id === this.createForm.vehicleId)
        ) {
          this.createForm.vehicleId = 0
          this.createForm.destinationStationId = 0
        }
      } catch (error) {
        this.showBanner(error.message || 'Nao foi possivel pesquisar veiculos.', 'error')
      }
    },
    async refreshImpros() {
      try {
        const response = await fetchImpros(this.sessionToken, {
          search: this.searchDraft,
        })
        this.impros = Array.isArray(response?.items) ? response.items : []

        if (!this.selectedImproId && this.impros.length > 0) {
          this.selectImpro(this.impros[0].id)
        }

        if (
          this.selectedImproId &&
          !this.impros.some((item) => item.id === this.selectedImproId)
        ) {
          this.selectedImproId = this.impros[0]?.id || null
        }
      } catch (error) {
        this.showBanner(error.message || 'Nao foi possivel carregar os impros.', 'error')
      }
    },
    buildHistoryFiltersPayload() {
      return {
        search: this.historySearchDraft,
        vehiclePlate: this.historyFilters.vehiclePlate,
        stationId: this.historyFilters.stationId > 0 ? this.historyFilters.stationId : undefined,
        status: this.historyFilters.status || undefined,
        fromDate: toIsoDateTime(this.historyFilters.fromDate),
        toDate: toIsoDateTime(this.historyFilters.toDate),
      }
    },
    async refreshHistory() {
      this.loading.history = true

      try {
        const response = await fetchImpros(this.sessionToken, this.buildHistoryFiltersPayload())
        this.historyItems = Array.isArray(response?.items) ? response.items : []
      } catch (error) {
        this.showBanner(error.message || 'Nao foi possivel carregar o historico de impros.', 'error')
      } finally {
        this.loading.history = false
      }
    },
    resetHistoryFilters() {
      this.historySearchDraft = ''
      this.historyFilters = {
        vehiclePlate: '',
        stationId: 0,
        status: '',
        fromDate: '',
        toDate: '',
      }
      this.refreshHistory()
    },
    exportHistoryCsv() {
      if (!this.historyItems.length) {
        this.showBanner('Nao existem registos para exportar.', 'error')
        return
      }

      const escapeCsv = (value) => {
        const normalized = value === undefined || value === null ? '' : String(value)
        const escaped = normalized.replace(/"/g, '""')
        return `"${escaped}"`
      }

      const rows = this.historyItems.map((item) => {
        return [
          item.improCode,
          item.vehiclePlate,
          item.status,
          this.getStationName(item.originStationId),
          this.getStationName(item.destinationStationId),
          this.formatDate(item.transferDate),
          this.formatDate(item.plannedArrivalDate),
          this.formatDate(item.actualArrivalDate),
          item.notes || '',
        ]
          .map(escapeCsv)
          .join(',')
      })

      const csvHeader = [
        'Codigo Impro',
        'Matricula',
        'Estado',
        'Estacao Origem',
        'Estacao Destino',
        'Data Transferencia',
        'Chegada Prevista',
        'Chegada Real',
        'Notas',
      ]
        .map(escapeCsv)
        .join(',')

      const csv = [csvHeader, ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `historico-impros-${Date.now()}.csv`
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      window.URL.revokeObjectURL(url)

      this.showBanner('Historico exportado com sucesso.', 'success')
    },
    selectImpro(id) {
      this.selectedImproId = id
      const selected = this.impros.find((item) => item.id === id)

      if (!selected) {
        return
      }

      this.updateForm.destinationStationId = selected.destinationStationId || 0
      this.updateForm.transferDate = toLocalInputValue(selected.transferDate)
      this.updateForm.plannedArrivalDate = toLocalInputValue(selected.plannedArrivalDate)
      this.updateForm.notes = selected.notes || ''
      this.closeForm.improId = selected.status === 'CLOSED' ? 0 : selected.id
      this.closeForm.actualArrivalDate = ''
      this.closeForm.closureNotes = ''
      this.closeForm.vehicleDamaged = false
      this.historySearchDraft = ''
    },
    selectVehicle(vehicleId) {
      this.createForm.vehicleId = vehicleId
      if (
        this.selectedCreateVehicle &&
        this.createForm.destinationStationId === this.selectedCreateVehicle.currentStationId
      ) {
        this.createForm.destinationStationId = 0
      }
    },
    getStationName(stationId) {
      const station = this.stations.find((item) => item.id === stationId)
      return station?.name || `Estacao #${stationId}`
    },
    applyDateShortcut(target, strategy) {
      const current = new Date()
      const adjusted = new Date(current)

      if (strategy === 'PLUS_2H') {
        adjusted.setHours(adjusted.getHours() + 2)
      }

      if (strategy === 'PLUS_1D') {
        adjusted.setDate(adjusted.getDate() + 1)
      }

      const resolvedValue = strategy === 'CLEAR' ? '' : toLocalInputValue(adjusted)

      if (target === 'createTransfer') {
        this.createForm.transferDate = resolvedValue
      }

      if (target === 'createArrival') {
        this.createForm.plannedArrivalDate = resolvedValue
      }

      if (target === 'updateTransfer') {
        this.updateForm.transferDate = resolvedValue
      }

      if (target === 'updateArrival') {
        this.updateForm.plannedArrivalDate = resolvedValue
      }

      if (target === 'closeArrival') {
        this.closeForm.actualArrivalDate = resolvedValue
      }
    },
    async handleCreateImpro() {
      if (!this.createForm.vehicleId || !this.selectedCreateVehicle) {
        this.showBanner('Selecione um veiculo para criar o impro.', 'error')
        return
      }

      if (!this.createForm.destinationStationId) {
        this.showBanner('Selecione uma estacao de destino.', 'error')
        return
      }

      if (this.createForm.destinationStationId === this.selectedCreateVehicle.currentStationId) {
        this.showBanner('A estacao de destino deve ser diferente da origem automatica.', 'error')
        return
      }

      this.loading.create = true
      try {
        const created = await createImpro(
          {
            vehicleId: this.createForm.vehicleId,
            originStationId: this.selectedCreateVehicle.currentStationId,
            destinationStationId: this.createForm.destinationStationId,
            transferDate: toIsoDateTime(this.createForm.transferDate),
            plannedArrivalDate: toIsoDateTime(this.createForm.plannedArrivalDate),
            notes: this.createForm.notes,
          },
          this.sessionToken,
        )

        this.showBanner(`Impro ${created.improCode} criado com sucesso.`, 'success')

        if (Array.isArray(created.warnings) && created.warnings.length > 0) {
          this.showBanner(
            `Impro ${created.improCode} criado com avisos: ${created.warnings.join(' ')}`,
            'success',
          )
        }

        this.createForm = {
          vehicleId: 0,
          destinationStationId: 0,
          transferDate: '',
          plannedArrivalDate: '',
          notes: '',
        }
        this.vehicleSearchDraft = ''

        await this.bootstrap()
        this.activeTab = 'MANAGE'
      } catch (error) {
        this.showBanner(error.message || 'Nao foi possivel criar o impro.', 'error')
      } finally {
        this.loading.create = false
      }
    },
    async handleUpdateImpro() {
      if (!this.selectedImproId) {
        this.showBanner('Selecione um impro para atualizar.', 'error')
        return
      }

      this.loading.update = true
      try {
        await updateImpro(
          this.selectedImproId,
          {
            destinationStationId:
              this.updateForm.destinationStationId > 0
                ? this.updateForm.destinationStationId
                : undefined,
            transferDate: toIsoDateTime(this.updateForm.transferDate),
            plannedArrivalDate: toIsoDateTime(this.updateForm.plannedArrivalDate),
            notes: this.updateForm.notes,
          },
          this.sessionToken,
        )

        this.showBanner('Impro atualizado com sucesso.', 'success')
        await this.refreshImpros()
      } catch (error) {
        this.showBanner(error.message || 'Nao foi possivel atualizar o impro.', 'error')
      } finally {
        this.loading.update = false
      }
    },
    async handleCloseImpro() {
      if (!this.selectedImproId || !this.closeForm.improId) {
        this.showBanner('Selecione um impro ativo para encerrar.', 'error')
        return
      }

      this.loading.close = true
      try {
        await closeImpro(
          this.closeForm.improId,
          {
            actualArrivalDate: toIsoDateTime(this.closeForm.actualArrivalDate),
            closureNotes: this.closeForm.closureNotes,
            vehicleDamaged: this.closeForm.vehicleDamaged,
          },
          this.sessionToken,
        )

        this.showBanner('Impro encerrado com sucesso.', 'success')
        await this.refreshImpros()
        this.selectImpro(this.selectedImproId)
      } catch (error) {
        this.showBanner(error.message || 'Nao foi possivel encerrar o impro.', 'error')
      } finally {
        this.loading.close = false
      }
    },
    formatDate(dateValue) {
      if (!dateValue) {
        return 'N/A'
      }

      const parsed = new Date(dateValue)
      if (Number.isNaN(parsed.getTime())) {
        return 'N/A'
      }

      return parsed.toLocaleString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    showBanner(message, type) {
      this.banner = { message, type }
    },
    formatStatus(status) {
      if (status === 'IN_TRANSFER') {
        return 'Em transferencia'
      }

      if (status === 'SCHEDULED') {
        return 'Agendado'
      }

      if (status === 'CLOSED') {
        return 'Encerrado'
      }

      return status
    },
  },
}
</script>

<style scoped src="../../styles/components/impro-operations.css"></style>
