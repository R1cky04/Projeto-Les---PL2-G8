<template>
  <section class="rental-card rental-history-panel">
    <div class="rental-card-head">
      <div>
        <span class="rental-card-eyebrow">Historico</span>
        <h3>Consultar historico de contratos</h3>
      </div>

      <div class="rental-role-pill">
        {{ historyContracts.length }} registos
      </div>
    </div>

    <div class="rental-history-toolbar">
      <label class="rental-field">
        <span>Estado</span>
        <select v-model="filters.status" @change="loadHistory">
          <option value="HISTORY">Historico (fechados + cancelados)</option>
          <option value="CLOSED">Fechados</option>
          <option value="CANCELLED">Cancelados</option>
          <option value="OPEN">Ativos</option>
          <option value="">Todos</option>
        </select>
      </label>

      <label class="rental-field">
        <span>Data inicial</span>
        <input v-model="filters.createdFrom" type="date" @change="loadHistory" />
      </label>

      <label class="rental-field">
        <span>Data final</span>
        <input v-model="filters.createdTo" type="date" @change="loadHistory" />
      </label>

      <label class="rental-field rental-field-history-search">
        <span>Pesquisa</span>
        <input
          v-model.trim="filters.search"
          type="search"
          placeholder="Contrato, cliente, matricula, estacao"
          @keyup.enter="loadHistory"
        />
      </label>

      <div class="rental-actions rental-history-actions">
        <button type="button" class="rental-ghost-button" @click="clearFilters">
          Limpar filtros
        </button>
        <button type="button" class="rental-secondary-button" @click="exportHistoryCsv" :disabled="isLoading || historyContracts.length === 0">
          Exportar CSV
        </button>
        <button type="button" class="rental-submit-button" @click="loadHistory" :disabled="isLoading">
          {{ isLoading ? 'A atualizar...' : 'Atualizar historico' }}
        </button>
      </div>
    </div>

    <p v-if="errorMessage" class="rental-banner rental-banner-error">
      {{ errorMessage }}
    </p>

    <div class="rental-history-grid">
      <article
        v-for="contract in historyContracts"
        :key="contract.id"
        class="recent-card rental-history-card"
      >
        <div class="recent-card-head">
          <strong>{{ contract.contractNumber }}</strong>
          <span>{{ resolveAmount(contract) }}</span>
        </div>

        <p>{{ contract.customerFullName }} · {{ contract.vehiclePlate }}</p>
        <small>
          {{ contract.stationName }} -> {{ contract.returnStationName }}
        </small>

        <div class="rental-history-meta">
          <span class="rental-status-chip" :class="`is-${contract.status.toLowerCase()}`">
            {{ statusLabel(contract.status) }}
          </span>
          <span>Criado: {{ formatDate(contract.createdAt) }}</span>
          <span v-if="contract.closedAt">Encerrado: {{ formatDate(contract.closedAt) }}</span>
        </div>
      </article>

      <div v-if="!isLoading && historyContracts.length === 0" class="rental-empty">
        Nenhum contrato encontrado para os filtros aplicados.
      </div>
    </div>
  </section>
</template>

<script>
import { fetchRentalContracts } from '../../services/rentalsApi'
import {
  formatRentalCurrency,
  formatRentalDisplayDate,
} from '../../utils/rentalFormatting'

function createDefaultFilters() {
  return {
    status: 'HISTORY',
    search: '',
    createdFrom: '',
    createdTo: '',
  }
}

export default {
  name: 'RentalHistoryPanel',
  props: {
    sessionToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      filters: createDefaultFilters(),
      historyContracts: [],
      isLoading: false,
      errorMessage: '',
    }
  },
  watch: {
    refreshToken() {
      this.loadHistory()
    },
  },
  async mounted() {
    await this.loadHistory()
  },
  methods: {
    formatDate(value) {
      return formatRentalDisplayDate(value)
    },
    resolveAmount(contract) {
      const finalAmount = Number(contract.finalAmount)

      if (Number.isFinite(finalAmount) && finalAmount > 0) {
        return formatRentalCurrency(finalAmount)
      }

      return formatRentalCurrency(contract.estimatedAmount)
    },
    statusLabel(status) {
      if (status === 'OPEN') {
        return 'Ativo'
      }

      if (status === 'CLOSED') {
        return 'Fechado'
      }

      if (status === 'CANCELLED') {
        return 'Cancelado'
      }

      return status || 'Desconhecido'
    },
    clearFilters() {
      this.filters = createDefaultFilters()
      this.loadHistory()
    },
    async loadHistory() {
      this.isLoading = true
      this.errorMessage = ''

      try {
        this.historyContracts = await fetchRentalContracts(this.sessionToken, {
          status: this.filters.status,
          search: this.filters.search,
          createdFrom: this.filters.createdFrom,
          createdTo: this.filters.createdTo,
        })
      } catch {
        this.historyContracts = []
        this.errorMessage = 'Nao foi possivel carregar o historico de contratos.'
      } finally {
        this.isLoading = false
      }
    },
    exportHistoryCsv() {
      if (this.historyContracts.length === 0) {
        this.errorMessage = 'Nao existem contratos para exportar.'
        return
      }

      const escapeCsv = (value) => {
        const text = value === null || value === undefined ? '' : String(value)
        return `"${text.replace(/"/g, '""')}"`
      }

      const header = [
        'Contrato',
        'Cliente',
        'Matricula',
        'Estado',
        'Estacao',
        'Estacao devolucao',
        'Inicio previsto',
        'Fim previsto',
        'Valor estimado',
        'Valor final',
        'Criado em',
        'Encerrado em',
        'Notas',
      ]

      const rows = this.historyContracts.map((contract) => [
        contract.contractNumber,
        contract.customerFullName,
        contract.vehiclePlate,
        this.statusLabel(contract.status),
        contract.stationName,
        contract.returnStationName,
        this.formatDate(contract.pickupAt),
        this.formatDate(contract.expectedReturnAt),
        this.resolveAmount(contract),
        contract.finalAmount ? contract.finalAmount.toFixed(2) : '',
        this.formatDate(contract.createdAt),
        contract.closedAt ? this.formatDate(contract.closedAt) : '',
        contract.notes || contract.finalNotes || '',
      ])

      const csv = [header.join(','), ...rows.map((row) => row.map(escapeCsv).join(','))].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `historico-contratos-${Date.now()}.csv`
      link.click()
      URL.revokeObjectURL(link.href)
    },
  },
}
</script>

<style scoped src="../../styles/components/rental-contracts.css"></style>
