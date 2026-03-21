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
          @delete="confirmDeleteUser"
        />

        <InternalUserFormPanel
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
          @update:password="form.password = $event"
          @update:role="form.role = $event"
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
import { ROLE_OPTIONS } from '../constants/internalUserRoles'
import {
  createInternalUser,
  deleteInternalUser,
  fetchInternalUsers,
} from '../services/internalUsersApi'
import {
  buildCreateInternalUserPayload,
  createInternalUserForm,
  mapInternalUserApiErrors,
  validateInternalUserForm,
} from '../utils/internalUserForm'
import {
  getInternalUserDeletionPrompt,
  getInternalUserDeletionResultMessage,
} from '../utils/internalUserPresentation'

const DEFAULT_ROLE = ROLE_OPTIONS[0]?.value || ''

// IT workspace for provisioning and deletion. The parent owns authentication;
// this view owns module-local state and feedback.
export default {
  name: 'InternalUsersView',
  components: {
    InternalUserCreatedCard,
    InternalUserFormPanel,
    InternalUserListPanel,
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
      form: createInternalUserForm(DEFAULT_ROLE),
      isSubmitting: false,
      fieldErrors: {},
      submitError: '',
      successMessage: '',
      createdUser: null,
      users: [],
      loadingUsers: false,
      deletingUserId: null,
    }
  },
  async created() {
    await this.loadUsers()
  },
  methods: {
    async loadUsers() {
      this.loadingUsers = true

      try {
        this.users = await fetchInternalUsers(this.sessionToken)
      } catch (error) {
        this.submitError =
          error.message || 'Nao foi possivel carregar a lista de utilizadores.'
      } finally {
        this.loadingUsers = false
      }
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
        await this.loadUsers()
      } catch (error) {
        this.fieldErrors = mapInternalUserApiErrors(error.errors)
        this.submitError = error.message || 'Nao foi possivel criar o utilizador.'
      } finally {
        this.isSubmitting = false
      }
    },

    async confirmDeleteUser(user) {
      if (!window.confirm(getInternalUserDeletionPrompt(user.userId))) {
        return
      }

      this.deletingUserId = user.id
      this.submitError = ''
      this.successMessage = ''

      try {
        const response = await deleteInternalUser(user.id, this.sessionToken)

        this.createdUser = null
        this.successMessage = getInternalUserDeletionResultMessage(response.mode)
        await this.loadUsers()
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
