<template>
  <div
    class="internal-users-page page-shell"
    :class="{ 'internal-users-page-embedded': embedded }"
  >
    <main class="page-layout">
      <section class="content-grid">
        <InternalUserListPanel
          :users="users"
          :loading="loadingUsers"
          :deleting-user-id="deletingUserId"
          :selected-user-id="selectedUserId"
          :pagination="pagination"
          :search-draft="searchDraft"
          :active-search-term="searchTerm"
          @select="selectUser"
          @delete="confirmDeleteUser"
          @page-change="loadUsers"
          @search="applySearch"
          @clear-search="clearSearch"
          @update:search-draft="searchDraft = $event"
          @update:searchDraft="searchDraft = $event"
        />

        <InternalUserFormPanel
          v-if="!selectedUser"
          :user-id="form.userId"
          :password="form.password"
          :role="form.role"
          :role-options="roleOptions"
          :field-errors="fieldErrors"
          :submit-error="submitError"
          :success-message="successMessage"
          :is-submitting="isSubmitting"
          @submit="submitForm"
          @reset="resetForm"
          @update:user-id="form.userId = $event"
          @update:userId="form.userId = $event"
          @update:password="form.password = $event"
          @update:role="form.role = $event"
        />

        <InternalUserManagementPanel
          v-else
          :selected-user="selectedUser"
          :user-id="managementForm.userId"
          :password="managementForm.password"
          :role="managementForm.role"
          :status="managementForm.status"
          :is-active="managementForm.isActive"
          :role-options="roleOptions"
          :status-options="statusOptions"
          :field-errors="managementFieldErrors"
          :submit-error="managementSubmitError"
          :success-message="managementSuccessMessage"
          :warnings="managementWarnings"
          :is-submitting="isUpdatingUser"
          @submit="submitManagementForm"
          @reset="resetManagementForm"
          @clear-selection="clearManagementSelection"
          @update:user-id="managementForm.userId = $event"
          @update:userId="managementForm.userId = $event"
          @update:password="managementForm.password = $event"
          @update:role="managementForm.role = $event"
          @update:status="managementForm.status = $event"
          @update:is-active="managementForm.isActive = $event"
          @update:isActive="managementForm.isActive = $event"
        />

        <InternalUserCreatedCard
          v-if="createdUser"
          :created-user="createdUser"
          :role-options="roleOptions"
          class="created-notification"
        />
      </section>
    </main>
  </div>
</template>

<script>
import InternalUserCreatedCard from '../components/internal-users/InternalUserCreatedCard.vue'
import InternalUserFormPanel from '../components/internal-users/InternalUserFormPanel.vue'
import InternalUserListPanel from '../components/internal-users/InternalUserListPanel.vue'
import InternalUserManagementPanel from '../components/internal-users/InternalUserManagementPanel.vue'
import { ROLE_OPTIONS } from '../constants/internalUserRoles'
import { INTERNAL_USER_STATUS_OPTIONS } from '../constants/internalUserStatuses'
import {
  createInternalUser,
  deleteInternalUser,
  fetchInternalUsers,
  updateInternalUser,
} from '../services/internalUsersApi'
import {
  buildCreateInternalUserPayload,
  createInternalUserForm,
  mapInternalUserApiErrors,
  validateInternalUserForm,
} from '../utils/internalUserForm'
import {
  buildInternalUserManagementForm,
  buildUpdateInternalUserPayload,
  createInternalUserManagementForm,
  validateInternalUserManagementForm,
} from '../utils/internalUserManagementForm'
import {
  getInternalUserDeletionPrompt,
  getInternalUserDeletionResultMessage,
} from '../utils/internalUserPresentation'

const DEFAULT_ROLE = ROLE_OPTIONS[0]?.value || ''
const USERS_PAGE_SIZE = 10

function createUsersPagination() {
  return {
    page: 1,
    pageSize: USERS_PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  }
}

// Module orchestrator for IT user administration. List, create and update
// flows share the same authenticated directory state here.
export default {
  name: 'InternalUsersView',
  components: {
    InternalUserCreatedCard,
    InternalUserFormPanel,
    InternalUserListPanel,
    InternalUserManagementPanel,
  },
  props: {
    sessionToken: {
      type: String,
      required: true,
    },
    sessionUser: {
      type: Object,
      required: true,
    },
    embedded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      roleOptions: ROLE_OPTIONS,
      statusOptions: INTERNAL_USER_STATUS_OPTIONS,
      form: createInternalUserForm(DEFAULT_ROLE),
      managementForm: createInternalUserManagementForm(),
      isSubmitting: false,
      isUpdatingUser: false,
      fieldErrors: {},
      managementFieldErrors: {},
      submitError: '',
      successMessage: '',
      managementSubmitError: '',
      managementSuccessMessage: '',
      managementWarnings: [],
      createdUser: null,
      searchDraft: '',
      searchTerm: '',
      users: [],
      selectedUserId: null,
      loadingUsers: false,
      deletingUserId: null,
      pagination: createUsersPagination(),
    }
  },
  computed: {
    selectedUser() {
      return this.users.find((user) => user.id === this.selectedUserId) || null
    },
  },
  async created() {
    await this.loadUsers(1)
  },
  methods: {
    async loadUsers(
      page = this.pagination.page,
      search = this.searchTerm,
      options = {},
    ) {
      this.loadingUsers = true

      try {
        const response = await fetchInternalUsers(this.sessionToken, {
          page,
          pageSize: USERS_PAGE_SIZE,
          search,
        })

        this.users = response.items
        this.pagination = response.pagination
        this.syncSelectedUser(Boolean(options.refreshSelectedForm))
      } catch (error) {
        const message =
          error.message || 'Nao foi possivel carregar a lista de utilizadores.'

        this.submitError = message
        this.managementSubmitError = message
      } finally {
        this.loadingUsers = false
      }
    },

    syncSelectedUser(refreshSelectedForm = false) {
      if (!this.selectedUserId) {
        return
      }

      const matchingUser =
        this.users.find((user) => user.id === this.selectedUserId) || null

      if (!matchingUser) {
        this.clearManagementSelection()
        return
      }

      if (refreshSelectedForm) {
        this.managementForm = buildInternalUserManagementForm(matchingUser)
      }
    },

    selectUser(user) {
      this.selectedUserId = user.id
      this.managementForm = buildInternalUserManagementForm(user)
      this.managementFieldErrors = {}
      this.managementSubmitError = ''
      this.managementSuccessMessage = ''
      this.managementWarnings = []
      this.createdUser = null
      this.submitError = ''
      this.successMessage = ''
    },

    clearManagementSelection() {
      this.selectedUserId = null
      this.managementForm = createInternalUserManagementForm()
      this.managementFieldErrors = {}
      this.managementSubmitError = ''
      this.managementSuccessMessage = ''
      this.managementWarnings = []
    },

    async applySearch() {
      this.searchTerm = this.searchDraft.trim()
      await this.loadUsers(1, this.searchTerm)
    },

    async clearSearch() {
      this.searchDraft = ''

      if (!this.searchTerm) {
        return
      }

      this.searchTerm = ''
      await this.loadUsers(1, this.searchTerm)
    },

    async submitForm() {
      this.successMessage = ''
      this.submitError = ''

      const validationErrors = validateInternalUserForm(this.form)

      if (Object.keys(validationErrors).length > 0) {
        this.fieldErrors = validationErrors
        return
      }

      this.fieldErrors = {}
      this.isSubmitting = true

      try {
        const response = await createInternalUser(
          buildCreateInternalUserPayload(this.form),
          this.sessionToken,
        )

        this.createdUser = response.user
        this.successMessage = response.message
        this.form = createInternalUserForm(DEFAULT_ROLE)
        await this.loadUsers(1)
      } catch (error) {
        this.fieldErrors = mapInternalUserApiErrors(error.errors)
        this.submitError = error.message || 'Nao foi possivel criar o utilizador.'
      } finally {
        this.isSubmitting = false
      }
    },

    async submitManagementForm() {
      this.managementSuccessMessage = ''
      this.managementSubmitError = ''
      this.managementWarnings = []

      const validationErrors = validateInternalUserManagementForm(
        this.managementForm,
      )

      if (Object.keys(validationErrors).length > 0) {
        this.managementFieldErrors = validationErrors
        return
      }

      this.managementFieldErrors = {}
      this.isUpdatingUser = true

      try {
        const response = await updateInternalUser(
          this.managementForm.id,
          buildUpdateInternalUserPayload(this.managementForm),
          this.sessionToken,
        )

        this.managementWarnings = Array.isArray(response.warnings)
          ? response.warnings
          : []
        this.managementSuccessMessage = response.message
        this.managementForm = buildInternalUserManagementForm(response.user)
        this.selectedUserId = response.user.id
        this.createdUser = null
        await this.loadUsers(this.pagination.page, this.searchTerm, {
          refreshSelectedForm: true,
        })
      } catch (error) {
        this.managementFieldErrors = mapInternalUserApiErrors(error.errors)
        this.managementSubmitError =
          error.message || 'Nao foi possivel atualizar o utilizador.'
      } finally {
        this.isUpdatingUser = false
      }
    },

    async confirmDeleteUser(user) {
      if (!window.confirm(getInternalUserDeletionPrompt(user.userId))) {
        return
      }

      this.deletingUserId = user.id
      this.submitError = ''
      this.successMessage = ''
      this.managementSubmitError = ''
      this.managementSuccessMessage = ''

      try {
        const response = await deleteInternalUser(user.id, this.sessionToken)
        const targetPage =
          this.users.length === 1 && this.pagination.page > 1
            ? this.pagination.page - 1
            : this.pagination.page

        if (this.selectedUserId === user.id) {
          this.clearManagementSelection()
        }

        this.createdUser = null
        this.successMessage = getInternalUserDeletionResultMessage(response.mode)
        await this.loadUsers(targetPage)
      } catch (error) {
        this.submitError = error.message || 'Erro ao eliminar utilizador.'
      } finally {
        this.deletingUserId = null
      }
    },

    resetForm() {
      this.form = createInternalUserForm(DEFAULT_ROLE)
      this.fieldErrors = {}
      this.submitError = ''
      this.successMessage = ''
      this.createdUser = null
    },

    resetManagementForm() {
      if (!this.selectedUser) {
        this.clearManagementSelection()
        return
      }

      this.managementForm = buildInternalUserManagementForm(this.selectedUser)
      this.managementFieldErrors = {}
      this.managementSubmitError = ''
      this.managementSuccessMessage = ''
      this.managementWarnings = []
    },
  },
}
</script>

<style scoped>
.content-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 32px;
  align-items: start;
}

.created-notification {
  grid-column: 1 / -1;
  margin-top: 24px;
}

@media (max-width: 1100px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
