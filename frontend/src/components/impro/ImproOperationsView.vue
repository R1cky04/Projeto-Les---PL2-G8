<template>
  <section class="impro-shell">
    <header class="impro-header">
      <div>
        <p class="impro-eyebrow">{{ tr('headerEyebrow') }}</p>
        <h2>{{ tr('headerTitle') }}</h2>
        <p class="impro-intro">
          {{ tr('headerIntro') }}
        </p>
      </div>

      <div class="impro-pill-row">
        <span class="impro-pill">{{ tr('activeLabel') }}: {{ activeImprosCount }}</span>
        <span class="impro-pill impro-pill-strong">{{ tr('totalLabel') }}: {{ totalImprosCount }}</span>
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
        {{ tr(tab.labelKey) }}
      </button>
    </section>

    <section v-if="activeTab === 'CREATE'" class="impro-grid">
      <article class="impro-panel impro-panel-main">
        <h3>{{ tr('tabCreate') }}</h3>
        <form class="impro-form" @submit.prevent="handleCreateImpro">
          <div class="impro-field impro-field-full">
            <span>{{ tr('searchVehicleByPlate') }}</span>
            <input
              v-model.trim="vehicleSearchDraft"
              type="search"
              placeholder="Ex: AA-11-BB"
              @input="handleVehicleSearchInput"
            />

            <div v-if="createForm.vehicleId" class="impro-selected-vehicle">
              <strong>{{ tr('selectedVehicle') }}</strong>
              <span>
                #{{ selectedCreateVehicle.id }} | {{ selectedCreateVehicle.plate }} | {{ selectedCreateVehicle.model }}
              </span>
              <small>
                {{ tr('automaticOrigin') }}: {{ getStationName(selectedCreateVehicle.currentStationId) }}
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
              {{ tr('noVehicleForSearch') }}
            </p>
          </div>

          <label class="impro-field">
            <span>{{ tr('destinationStation') }}</span>
            <select v-model.number="createForm.destinationStationId" required>
              <option :value="0" disabled>{{ tr('selectDestination') }}</option>
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
              <span>{{ tr('transferDate') }}</span>
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
              <span>{{ tr('plannedArrival') }}</span>
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
            <span>{{ tr('notes') }}</span>
            <textarea
              v-model="createForm.notes"
              rows="3"
              placeholder="Observacoes da transferencia"
            ></textarea>
          </label>

          <button class="impro-primary" type="submit" :disabled="loading.create">
            {{ loading.create ? tr('creating') : tr('confirmImproCreation') }}
          </button>
        </form>
      </article>

      <article class="impro-panel">
        <h3>{{ tr('validatedRules') }}</h3>
        <ul class="impro-check-list">
          <li>{{ tr('ruleSearchByPlate') }}</li>
          <li>{{ tr('ruleAutomaticOrigin') }}</li>
          <li>{{ tr('ruleOnlyDestination') }}</li>
          <li>{{ tr('ruleDifferentDestination') }}</li>
        </ul>
      </article>
    </section>

    <section v-else-if="activeTab === 'MANAGE'" class="impro-grid">
      <article class="impro-panel impro-panel-main">
        <div class="impro-panel-head">
          <h3>{{ tr('tabManage') }}</h3>
          <label class="impro-search">
            <span>{{ tr('search') }}</span>
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

          <p v-if="impros.length === 0" class="impro-empty">{{ tr('noImproFound') }}</p>
        </div>
      </article>

      <article class="impro-panel" v-if="selectedImpro">
        <section class="impro-manage-section">
          <h3>{{ tr('updateMovement') }}</h3>
          <form class="impro-form" @submit.prevent="handleUpdateImpro">
          <label class="impro-field">
            <span>{{ tr('destination') }}</span>
            <select v-model.number="updateForm.destinationStationId" :disabled="selectedImpro.status === 'CLOSED'">
              <option :value="0">{{ tr('noChange') }}</option>
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
            <span>{{ tr('plannedArrivalDate') }}</span>
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
            <span>{{ tr('transferDate') }}</span>
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
            <span>{{ tr('notes') }}</span>
            <textarea v-model="updateForm.notes" rows="3" :disabled="selectedImpro.status === 'CLOSED'"></textarea>
          </label>

          <button class="impro-primary" type="submit" :disabled="loading.update || selectedImpro.status === 'CLOSED'">
            {{ loading.update ? tr('updating') : tr('saveChanges') }}
          </button>
          </form>
        </section>

        <section class="impro-manage-section impro-manage-divider">
          <div class="impro-section-head">
            <h3>{{ tr('closeImproTitle') }}</h3>
            <span class="impro-status-chip" :class="selectedImpro.status === 'CLOSED' ? 'is-closed' : 'is-open'">
              {{ selectedImpro.status === 'CLOSED' ? tr('statusClosed') : tr('activeLabel') }}
            </span>
          </div>

          <form class="impro-form" @submit.prevent="handleCloseImpro">
            <label class="impro-field">
              <span>{{ tr('actualArrivalDate') }}</span>
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
              <span>{{ tr('closureNotes') }}</span>
              <textarea v-model="closeForm.closureNotes" rows="2" :disabled="selectedImpro.status === 'CLOSED'"></textarea>
            </label>

            <label class="impro-check-toggle">
              <input v-model="closeForm.vehicleDamaged" type="checkbox" :disabled="selectedImpro.status === 'CLOSED'" />
              <span>{{ tr('vehicleDamagedHint') }}</span>
            </label>

            <button class="impro-primary impro-danger" type="submit" :disabled="loading.close || selectedImpro.status === 'CLOSED'">
              {{ loading.close ? tr('closing') : tr('closeImproTitle') }}
            </button>
          </form>
        </section>
      </article>

      <article class="impro-panel" v-else>
        <p class="impro-empty">{{ tr('selectImproToManage') }}</p>
      </article>
    </section>

    <section v-else class="impro-grid impro-grid-history">
      <article class="impro-panel impro-panel-main">
        <div class="impro-panel-head">
          <h3>{{ tr('tabHistory') }}</h3>
          <div class="impro-history-actions">
            <button class="impro-ghost" type="button" @click="resetHistoryFilters">
              {{ tr('clearFilters') }}
            </button>
            <button class="impro-primary impro-export" type="button" @click="exportHistoryCsv">
              {{ tr('exportCsv') }}
            </button>
          </div>
        </div>

        <form class="impro-filter-grid" @submit.prevent="refreshHistory">
          <label class="impro-field">
            <span>{{ tr('plate') }}</span>
            <input v-model.trim="historyFilters.vehiclePlate" type="search" placeholder="Ex: AA-11-BB" />
          </label>

          <label class="impro-field">
            <span>{{ tr('stationOriginOrDestination') }}</span>
            <select v-model.number="historyFilters.stationId">
              <option :value="0">{{ tr('all') }}</option>
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
            <span>{{ tr('status') }}</span>
            <select v-model="historyFilters.status">
              <option value="">{{ tr('all') }}</option>
              <option value="SCHEDULED">{{ tr('statusScheduled') }}</option>
              <option value="IN_TRANSFER">{{ tr('statusInTransfer') }}</option>
              <option value="CLOSED">{{ tr('statusClosed') }}</option>
            </select>
          </label>

          <label class="impro-field">
            <span>{{ tr('fromDate') }}</span>
            <input v-model="historyFilters.fromDate" type="datetime-local" />
          </label>

          <label class="impro-field">
            <span>{{ tr('toDate') }}</span>
            <input v-model="historyFilters.toDate" type="datetime-local" />
          </label>

          <label class="impro-field impro-field-full">
            <span>{{ tr('freeSearch') }}</span>
            <input v-model.trim="historySearchDraft" type="search" placeholder="codigo, estado ou matricula" />
          </label>

          <button class="impro-primary" type="submit" :disabled="loading.history">
            {{ loading.history ? tr('filtering') : tr('applyFilters') }}
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
            {{ tr('noImproForFilters') }}
          </p>
        </div>
      </article>

      <article class="impro-panel">
        <h3>{{ tr('quickRead') }}</h3>
        <ul class="impro-check-list">
          <li>{{ tr('quickReadRule1') }}</li>
          <li>{{ tr('quickReadRule2') }}</li>
          <li>{{ tr('quickReadRule3') }}</li>
          <li>{{ tr('quickReadRule4') }}</li>
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
import { getDateLocale, getLocaleState } from '../../services/i18n'

const TRANSLATIONS = {
  pt: {
    headerEyebrow: 'Operacoes de transferencia',
    headerTitle: 'Criar e gerir impros',
    headerIntro: 'Fluxo rapido e intuitivo para criar, gerir, encerrar e consultar historico de impros.',
    activeLabel: 'Ativos',
    totalLabel: 'Total',
    tabCreate: 'Criar Impro',
    tabManage: 'Gerir Impro',
    tabHistory: 'Historico de Impros',
    searchVehicleByPlate: 'Pesquisar veiculo por matricula',
    selectedVehicle: 'Veiculo selecionado:',
    automaticOrigin: 'Origem automatica',
    noVehicleForSearch: 'Nenhum veiculo disponivel para a matricula pesquisada.',
    destinationStation: 'Estacao de destino',
    selectDestination: 'Selecionar destino',
    validatedRules: 'Regras validadas',
    search: 'Pesquisar',
    noImproFound: 'Nenhum impro encontrado.',
    closeImproTitle: 'Encerrar impro',
    closing: 'A encerrar...',
    selectImproToManage: 'Selecione um impro na lista para atualizar dados ou encerrar o movimento.',
    clearFilters: 'Limpar filtros',
    exportCsv: 'Exportar CSV',
    plate: 'Matricula',
    stationOriginOrDestination: 'Estacao (origem ou destino)',
    all: 'Todos',
    status: 'Estado',
    filtering: 'A filtrar...',
    applyFilters: 'Aplicar filtros',
    noImproForFilters: 'Nenhum impro encontrado para os filtros selecionados.',
    transferDate: 'Data de transferencia',
    plannedArrival: 'Chegada prevista',
    notes: 'Notas',
    creating: 'A criar...',
    confirmImproCreation: 'Confirmar criacao do impro',
    ruleSearchByPlate: 'Pesquisa do veiculo por matricula.',
    ruleAutomaticOrigin: 'Origem definida automaticamente pela estacao atual do veiculo.',
    ruleOnlyDestination: 'Apenas selecao da estacao de destino.',
    ruleDifferentDestination: 'Destino deve ser diferente da origem automatica.',
    updateMovement: 'Atualizar movimento',
    destination: 'Destino',
    noChange: 'Sem alteracao',
    plannedArrivalDate: 'Data prevista de chegada',
    updating: 'A atualizar...',
    saveChanges: 'Guardar alteracoes',
    actualArrivalDate: 'Data real de chegada',
    closureNotes: 'Notas de encerramento',
    vehicleDamagedHint: 'Veiculo chegou com dano e deve seguir para manutencao.',
    fromDate: 'Data inicial',
    toDate: 'Data final',
    freeSearch: 'Pesquisa livre',
    quickRead: 'Leitura rapida',
    quickReadRule1: 'Filtro por matricula, estacao, estado e intervalo de datas.',
    quickReadRule2: 'Pesquisa livre para acelerar localizacao de movimentos.',
    quickReadRule3: 'Exportacao em CSV pronta para relatorio de operacao.',
    quickReadRule4: 'Estado e datas visiveis na lista para decisao imediata.',
    csvImproCode: 'Codigo Impro',
    csvPlate: 'Matricula',
    csvStatus: 'Estado',
    csvOriginStation: 'Estacao Origem',
    csvDestinationStation: 'Estacao Destino',
    csvTransferDate: 'Data Transferencia',
    csvPlannedArrival: 'Chegada Prevista',
    csvActualArrival: 'Chegada Real',
    csvNotes: 'Notas',
    csvFilenamePrefix: 'historico-impros',
    initError: 'Falha ao inicializar modulo de impros.',
    searchVehiclesError: 'Nao foi possivel pesquisar veiculos.',
    loadImprosError: 'Nao foi possivel carregar os impros.',
    loadHistoryError: 'Nao foi possivel carregar o historico de impros.',
    noRecordsToExport: 'Nao existem registos para exportar.',
    historyExported: 'Historico exportado com sucesso.',
    stationFallback: 'Estacao #{stationId}',
    selectVehicle: 'Selecione um veiculo para criar o impro.',
    selectDestinationError: 'Selecione uma estacao de destino.',
    destinationMustDiffer: 'A estacao de destino deve ser diferente da origem automatica.',
    createError: 'Nao foi possivel criar o impro.',
    updateMissingSelection: 'Selecione um impro para atualizar.',
    updateSuccess: 'Impro atualizado com sucesso.',
    updateError: 'Nao foi possivel atualizar o impro.',
    closeMissingSelection: 'Selecione um impro ativo para encerrar.',
    closeSuccess: 'Impro encerrado com sucesso.',
    closeError: 'Nao foi possivel encerrar o impro.',
    createSuccess: 'Impro {improCode} criado com sucesso.',
    createWarning: 'Impro {improCode} criado com avisos: {warnings}',
    notAvailable: 'N/A',
    statusInTransfer: 'Em transferencia',
    statusScheduled: 'Agendado',
    statusClosed: 'Encerrado',
  },
  en: {
    headerEyebrow: 'Transfer operations',
    headerTitle: 'Create and manage impros',
    headerIntro: 'Fast and intuitive flow to create, manage, close and review impro history.',
    activeLabel: 'Active',
    totalLabel: 'Total',
    tabCreate: 'Create Impro',
    tabManage: 'Manage Impro',
    tabHistory: 'Impro History',
    searchVehicleByPlate: 'Search vehicle by plate',
    selectedVehicle: 'Selected vehicle:',
    automaticOrigin: 'Automatic origin',
    noVehicleForSearch: 'No available vehicle for the searched plate.',
    destinationStation: 'Destination station',
    selectDestination: 'Select destination',
    validatedRules: 'Validated rules',
    search: 'Search',
    noImproFound: 'No impro found.',
    closeImproTitle: 'Close impro',
    closing: 'Closing...',
    selectImproToManage: 'Select an impro from the list to update data or close the movement.',
    clearFilters: 'Clear filters',
    exportCsv: 'Export CSV',
    plate: 'Plate',
    stationOriginOrDestination: 'Station (origin or destination)',
    all: 'All',
    status: 'Status',
    filtering: 'Filtering...',
    applyFilters: 'Apply filters',
    noImproForFilters: 'No impro found for the selected filters.',
    transferDate: 'Transfer date',
    plannedArrival: 'Planned arrival',
    notes: 'Notes',
    creating: 'Creating...',
    confirmImproCreation: 'Confirm impro creation',
    ruleSearchByPlate: 'Vehicle search by plate number.',
    ruleAutomaticOrigin: 'Origin is set automatically from current vehicle station.',
    ruleOnlyDestination: 'Only destination station is selected manually.',
    ruleDifferentDestination: 'Destination must differ from automatic origin.',
    updateMovement: 'Update movement',
    destination: 'Destination',
    noChange: 'No change',
    plannedArrivalDate: 'Planned arrival date',
    updating: 'Updating...',
    saveChanges: 'Save changes',
    actualArrivalDate: 'Actual arrival date',
    closureNotes: 'Closure notes',
    vehicleDamagedHint: 'Vehicle arrived damaged and should move to maintenance.',
    fromDate: 'Start date',
    toDate: 'End date',
    freeSearch: 'Free search',
    quickRead: 'Quick view',
    quickReadRule1: 'Filter by plate, station, status and date interval.',
    quickReadRule2: 'Free search to speed up movement lookup.',
    quickReadRule3: 'CSV export ready for operations reporting.',
    quickReadRule4: 'Status and dates visible in list for quick decisions.',
    csvImproCode: 'Impro Code',
    csvPlate: 'Plate',
    csvStatus: 'Status',
    csvOriginStation: 'Origin Station',
    csvDestinationStation: 'Destination Station',
    csvTransferDate: 'Transfer Date',
    csvPlannedArrival: 'Planned Arrival',
    csvActualArrival: 'Actual Arrival',
    csvNotes: 'Notes',
    csvFilenamePrefix: 'impro-history',
    initError: 'Failed to initialize impro module.',
    searchVehiclesError: 'Unable to search vehicles.',
    loadImprosError: 'Unable to load impros.',
    loadHistoryError: 'Unable to load impro history.',
    noRecordsToExport: 'No records available to export.',
    historyExported: 'History exported successfully.',
    stationFallback: 'Station #{stationId}',
    selectVehicle: 'Select a vehicle to create the impro.',
    selectDestinationError: 'Select a destination station.',
    destinationMustDiffer: 'Destination station must differ from the automatic origin.',
    createError: 'Unable to create impro.',
    updateMissingSelection: 'Select an impro to update.',
    updateSuccess: 'Impro updated successfully.',
    updateError: 'Unable to update impro.',
    closeMissingSelection: 'Select an active impro to close.',
    closeSuccess: 'Impro closed successfully.',
    closeError: 'Unable to close impro.',
    createSuccess: 'Impro {improCode} created successfully.',
    createWarning: 'Impro {improCode} created with warnings: {warnings}',
    notAvailable: 'N/A',
    statusInTransfer: 'In transfer',
    statusScheduled: 'Scheduled',
    statusClosed: 'Closed',
  },
  es: {
    headerEyebrow: 'Operaciones de transferencia',
    headerTitle: 'Crear y gestionar impros',
    headerIntro: 'Flujo rapido e intuitivo para crear, gestionar, cerrar y consultar historial de impros.',
    activeLabel: 'Activos',
    totalLabel: 'Total',
    tabCreate: 'Crear Impro',
    tabManage: 'Gestionar Impro',
    tabHistory: 'Historial de Impros',
    searchVehicleByPlate: 'Buscar vehiculo por matricula',
    selectedVehicle: 'Vehiculo seleccionado:',
    automaticOrigin: 'Origen automatico',
    noVehicleForSearch: 'Ningun vehiculo disponible para la matricula buscada.',
    destinationStation: 'Estacion de destino',
    selectDestination: 'Seleccionar destino',
    validatedRules: 'Reglas validadas',
    search: 'Buscar',
    noImproFound: 'No se encontro ningun impro.',
    closeImproTitle: 'Cerrar impro',
    closing: 'Cerrando...',
    selectImproToManage: 'Seleccione un impro de la lista para actualizar datos o cerrar el movimiento.',
    clearFilters: 'Limpiar filtros',
    exportCsv: 'Exportar CSV',
    plate: 'Matricula',
    stationOriginOrDestination: 'Estacion (origen o destino)',
    all: 'Todos',
    status: 'Estado',
    filtering: 'Filtrando...',
    applyFilters: 'Aplicar filtros',
    noImproForFilters: 'No se encontro ningun impro para los filtros seleccionados.',
    transferDate: 'Fecha de transferencia',
    plannedArrival: 'Llegada prevista',
    notes: 'Notas',
    creating: 'Creando...',
    confirmImproCreation: 'Confirmar creacion del impro',
    ruleSearchByPlate: 'Busqueda del vehiculo por matricula.',
    ruleAutomaticOrigin: 'Origen definido automaticamente por la estacion actual del vehiculo.',
    ruleOnlyDestination: 'Solo se selecciona la estacion de destino.',
    ruleDifferentDestination: 'El destino debe ser distinto del origen automatico.',
    updateMovement: 'Actualizar movimiento',
    destination: 'Destino',
    noChange: 'Sin cambios',
    plannedArrivalDate: 'Fecha prevista de llegada',
    updating: 'Actualizando...',
    saveChanges: 'Guardar cambios',
    actualArrivalDate: 'Fecha real de llegada',
    closureNotes: 'Notas de cierre',
    vehicleDamagedHint: 'El vehiculo llego con danos y debe pasar a mantenimiento.',
    fromDate: 'Fecha inicial',
    toDate: 'Fecha final',
    freeSearch: 'Busqueda libre',
    quickRead: 'Lectura rapida',
    quickReadRule1: 'Filtro por matricula, estacion, estado e intervalo de fechas.',
    quickReadRule2: 'Busqueda libre para acelerar la localizacion de movimientos.',
    quickReadRule3: 'Exportacion CSV lista para informe operativo.',
    quickReadRule4: 'Estado y fechas visibles en la lista para decision inmediata.',
    csvImproCode: 'Codigo Impro',
    csvPlate: 'Matricula',
    csvStatus: 'Estado',
    csvOriginStation: 'Estacion Origen',
    csvDestinationStation: 'Estacion Destino',
    csvTransferDate: 'Fecha Transferencia',
    csvPlannedArrival: 'Llegada Prevista',
    csvActualArrival: 'Llegada Real',
    csvNotes: 'Notas',
    csvFilenamePrefix: 'historial-impros',
    initError: 'No fue posible inicializar el modulo de impros.',
    searchVehiclesError: 'No fue posible buscar vehiculos.',
    loadImprosError: 'No fue posible cargar los impros.',
    loadHistoryError: 'No fue posible cargar el historial de impros.',
    noRecordsToExport: 'No existen registros para exportar.',
    historyExported: 'Historial exportado con exito.',
    stationFallback: 'Estacion #{stationId}',
    selectVehicle: 'Seleccione un vehiculo para crear el impro.',
    selectDestinationError: 'Seleccione una estacion de destino.',
    destinationMustDiffer: 'La estacion de destino debe ser distinta del origen automatico.',
    createError: 'No fue posible crear el impro.',
    updateMissingSelection: 'Seleccione un impro para actualizar.',
    updateSuccess: 'Impro actualizado con exito.',
    updateError: 'No fue posible actualizar el impro.',
    closeMissingSelection: 'Seleccione un impro activo para cerrar.',
    closeSuccess: 'Impro cerrado con exito.',
    closeError: 'No fue posible cerrar el impro.',
    createSuccess: 'Impro {improCode} creado con exito.',
    createWarning: 'Impro {improCode} creado con avisos: {warnings}',
    notAvailable: 'N/A',
    statusInTransfer: 'En transferencia',
    statusScheduled: 'Programado',
    statusClosed: 'Cerrado',
  },
}

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
        { key: 'CREATE', labelKey: 'tabCreate' },
        { key: 'MANAGE', labelKey: 'tabManage' },
        { key: 'HISTORY', labelKey: 'tabHistory' },
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
      localeState: getLocaleState(),
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
    tr(key, params = {}) {
      const locale = this.localeState.locale
      const template =
        (TRANSLATIONS[locale] && TRANSLATIONS[locale][key]) || TRANSLATIONS.pt[key] || key

      return Object.entries(params).reduce(
        (result, [paramKey, value]) => result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value)),
        template,
      )
    },
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
        this.showBanner(error.message || this.tr('initError'), 'error')
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
        this.showBanner(error.message || this.tr('searchVehiclesError'), 'error')
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
        this.showBanner(error.message || this.tr('loadImprosError'), 'error')
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
        this.showBanner(error.message || this.tr('loadHistoryError'), 'error')
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
        this.showBanner(this.tr('noRecordsToExport'), 'error')
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
        this.tr('csvImproCode'),
        this.tr('csvPlate'),
        this.tr('csvStatus'),
        this.tr('csvOriginStation'),
        this.tr('csvDestinationStation'),
        this.tr('csvTransferDate'),
        this.tr('csvPlannedArrival'),
        this.tr('csvActualArrival'),
        this.tr('csvNotes'),
      ]
        .map(escapeCsv)
        .join(',')

      const csv = [csvHeader, ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${this.tr('csvFilenamePrefix')}-${Date.now()}.csv`
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      window.URL.revokeObjectURL(url)

      this.showBanner(this.tr('historyExported'), 'success')
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
      return station?.name || this.tr('stationFallback', { stationId })
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
        this.showBanner(this.tr('selectVehicle'), 'error')
        return
      }

      if (!this.createForm.destinationStationId) {
        this.showBanner(this.tr('selectDestinationError'), 'error')
        return
      }

      if (this.createForm.destinationStationId === this.selectedCreateVehicle.currentStationId) {
        this.showBanner(this.tr('destinationMustDiffer'), 'error')
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

        this.showBanner(this.tr('createSuccess', { improCode: created.improCode }), 'success')

        if (Array.isArray(created.warnings) && created.warnings.length > 0) {
          this.showBanner(
            this.tr('createWarning', {
              improCode: created.improCode,
              warnings: created.warnings.join(' '),
            }),
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
        this.showBanner(error.message || this.tr('createError'), 'error')
      } finally {
        this.loading.create = false
      }
    },
    async handleUpdateImpro() {
      if (!this.selectedImproId) {
        this.showBanner(this.tr('updateMissingSelection'), 'error')
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

        this.showBanner(this.tr('updateSuccess'), 'success')
        await this.refreshImpros()
      } catch (error) {
        this.showBanner(error.message || this.tr('updateError'), 'error')
      } finally {
        this.loading.update = false
      }
    },
    async handleCloseImpro() {
      if (!this.selectedImproId || !this.closeForm.improId) {
        this.showBanner(this.tr('closeMissingSelection'), 'error')
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

        this.showBanner(this.tr('closeSuccess'), 'success')
        await this.refreshImpros()
        this.selectImpro(this.selectedImproId)
      } catch (error) {
        this.showBanner(error.message || this.tr('closeError'), 'error')
      } finally {
        this.loading.close = false
      }
    },
    formatDate(dateValue) {
      if (!dateValue) {
        return this.tr('notAvailable')
      }

      const parsed = new Date(dateValue)
      if (Number.isNaN(parsed.getTime())) {
        return this.tr('notAvailable')
      }

      return parsed.toLocaleString(getDateLocale(), {
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
        return this.tr('statusInTransfer')
      }

      if (status === 'SCHEDULED') {
        return this.tr('statusScheduled')
      }

      if (status === 'CLOSED') {
        return this.tr('statusClosed')
      }

      return status
    },
  },
}
</script>

<style scoped src="../../styles/components/impro-operations.css"></style>
