<template>
  <article class="panel panel-list">
    <div class="panel-head">
      <div>
        <p class="panel-label">Utilizadores internos ({{ users.length }})</p>
        <h2>Gestao de equipa</h2>
      </div>
    </div>

    <div v-if="loading" class="list-loading">
      A carregar utilizadores...
    </div>

    <div v-else-if="users.length === 0" class="list-empty">
      Nenhum utilizador interno encontrado.
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
  },
  emits: ['delete'],
  methods: {
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

.list-loading,
.list-empty {
  padding: 40px;
  text-align: center;
  color: #94a3b8;
  font-style: italic;
}
</style>
