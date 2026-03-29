<template>
  <article class="panel panel-list">
    <div class="panel-head">
      <div>
        <p class="panel-label">Utilizadores internos ({{ pagination.totalItems }})</p>
        <h2>Gestao de equipa</h2>
      </div>
    </div>

    <form class="search-toolbar" @submit.prevent="$emit('search')">
      <label class="search-field">
        <span class="search-label">Pesquisar por User ID</span>
        <input
          class="search-input"
          type="search"
          :value="searchDraft"
          placeholder="ex: staff.lisboa"
          @input="emitSearchDraftUpdate($event.target.value)"
        />
      </label>

      <div class="search-actions">
        <button
          class="search-button"
          type="submit"
          :disabled="loading"
        >
          Pesquisar
        </button>

        <button
          class="search-clear-button"
          type="button"
          :disabled="loading || (!searchDraft && !activeSearchTerm)"
          @click="$emit('clear-search')"
        >
          Limpar
        </button>
      </div>
    </form>

    <p v-if="activeSearchTerm" class="search-feedback">
      Filtro ativo: "{{ activeSearchTerm }}"
    </p>

    <div v-if="loading" class="list-loading">
      A carregar utilizadores...
    </div>

    <div v-else-if="users.length === 0" class="list-empty">
      {{
        activeSearchTerm
          ? 'Nenhum utilizador encontrado para a pesquisa atual.'
          : 'Nenhum utilizador interno encontrado.'
      }}
    </div>

    <div v-else class="user-list">
      <div
        v-for="user in users"
        :key="user.id"
        class="user-row"
        :class="{
          'is-inactive': !user.isActive,
          'is-selected': selectedUserId === user.id,
        }"
      >
        <div class="user-info">
          <div class="user-main">
            <span class="user-id">{{ user.userId }}</span>
            <span class="user-role-badge">{{ user.internalRole }}</span>
          </div>

          <div class="user-meta">
            <span
              class="status-dot"
              :class="user.isActive ? 'is-active' : 'is-disabled'"
            ></span>
            {{ activityLabel(user.isActive) }}
            <span class="separator">|</span>
            {{ statusLabel(user.internalStatus) }}
            <span class="separator">|</span>
            Criado em {{ formatDate(user.createdAt) }}
          </div>
        </div>

        <div class="user-actions">
          <button
            class="action-button manage-button"
            type="button"
            @click="$emit('select', user)"
          >
            {{ selectedUserId === user.id ? 'A editar' : 'Gerir' }}
          </button>

          <button
            v-if="user.isActive"
            class="action-button delete-button"
            :disabled="deletingUserId === user.id"
            @click="$emit('delete', user)"
          >
            {{ deletingUserId === user.id ? 'A remover...' : 'Remover' }}
          </button>

          <span v-else class="deactivated-label">Removido</span>
        </div>
      </div>

      <footer
        v-if="pagination.totalPages > 1"
        class="list-pagination"
      >
        <p class="pagination-summary">
          Pagina {{ pagination.page }} de {{ pagination.totalPages }}
        </p>

        <div class="pagination-actions">
          <button
            class="pagination-button"
            type="button"
            :disabled="!pagination.hasPreviousPage || loading"
            @click="$emit('page-change', pagination.page - 1)"
          >
            Anterior
          </button>

          <button
            class="pagination-button"
            type="button"
            :disabled="!pagination.hasNextPage || loading"
            @click="$emit('page-change', pagination.page + 1)"
          >
            Seguinte
          </button>
        </div>
      </footer>
    </div>
  </article>
</template>

<script>
import {
  getInternalUserActivityLabel,
  getInternalUserStatusLabel,
} from '../../utils/internalUserPresentation'

// Directory panel for search, selection and deletion within the IT module.
export default {
  name: 'InternalUserListPanel',
  props: {
    users: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    deletingUserId: {
      type: String,
      default: null,
    },
    selectedUserId: {
      type: String,
      default: null,
    },
    pagination: {
      type: Object,
      default: () => ({
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      }),
    },
    searchDraft: {
      type: String,
      default: '',
    },
    activeSearchTerm: {
      type: String,
      default: '',
    },
  },
  emits: [
    'select',
    'delete',
    'page-change',
    'search',
    'clear-search',
    'update:search-draft',
    'update:searchDraft',
  ],
  methods: {
    emitSearchDraftUpdate(value) {
      this.$emit('update:search-draft', value)
      this.$emit('update:searchDraft', value)
    },
    activityLabel(isActive) {
      return getInternalUserActivityLabel(isActive)
    },
    statusLabel(status) {
      return getInternalUserStatusLabel(status)
    },
    formatDate(dateValue) {
      if (!dateValue) {
        return 'N/A'
      }

      const parsedDate = new Date(dateValue)

      return Number.isNaN(parsedDate.getTime())
        ? 'N/A'
        : parsedDate.toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
    },
  },
}
</script>

<style scoped src="../../styles/components/internal-user-list-panel.css"></style>

