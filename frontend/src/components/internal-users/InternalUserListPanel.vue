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
        :class="{ 'is-inactive': !user.isActive }"
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
            Criado em {{ formatDate(user.createdAt) }}
          </div>
        </div>

        <div class="user-actions">
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
import { getInternalUserActivityLabel } from '../../utils/internalUserPresentation'

// Read-only list panel used by IT to select which internal account to remove.
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

<style scoped>
.search-toolbar {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-top: 18px;
}

.search-field {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
}

.search-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.03em;
}

.search-input {
  width: 100%;
  min-height: 44px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.65);
  color: #e2e8f0;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input:focus {
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}

.search-actions {
  display: flex;
  gap: 10px;
}

.search-button,
.search-clear-button {
  min-height: 44px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-button {
  border: 1px solid rgba(59, 130, 246, 0.25);
  background: rgba(59, 130, 246, 0.14);
  color: #bfdbfe;
}

.search-button:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.24);
}

.search-clear-button {
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: transparent;
  color: #cbd5e1;
}

.search-clear-button:hover:not(:disabled) {
  border-color: rgba(148, 163, 184, 0.32);
  background: rgba(148, 163, 184, 0.08);
}

.search-button:disabled,
.search-clear-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.search-feedback {
  margin: 12px 0 4px;
  font-size: 0.85rem;
  color: #93c5fd;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.user-row:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.user-row.is-inactive {
  opacity: 0.6;
  background: rgba(0, 0, 0, 0.1);
}

.user-main {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.user-id {
  font-weight: 600;
  font-size: 1.05rem;
  color: #fff;
}

.user-role-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 8px;
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border-radius: 6px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #94a3b8;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.is-active {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

.status-dot.is-disabled {
  background: #ef4444;
}

.separator {
  opacity: 0.3;
}

.action-button {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.delete-button {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.2);
}

.delete-button:hover:not(:disabled) {
  background: #ef4444;
  color: #fff;
  transform: translateY(-1px);
}

.delete-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.deactivated-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  font-style: italic;
}

.list-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
  padding-top: 8px;
}

.pagination-summary {
  margin: 0;
  font-size: 0.85rem;
  color: #94a3b8;
}

.pagination-actions {
  display: flex;
  gap: 10px;
}

.pagination-button {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  background: rgba(59, 130, 246, 0.08);
  color: #93c5fd;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.16);
}

.pagination-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.list-loading,
.list-empty {
  padding: 40px;
  text-align: center;
  color: #94a3b8;
  font-style: italic;
}

@media (max-width: 720px) {
  .search-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-actions {
    width: 100%;
  }

  .search-button,
  .search-clear-button {
    flex: 1;
  }
}
</style>
