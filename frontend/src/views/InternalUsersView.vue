<template>
  <div
    class="internal-users-page page-shell"
    :class="{ 'internal-users-page-embedded': embedded }"
  >
    <main class="page-layout" style="max-width: 600px; margin-top: 40px; margin-left: auto; margin-right: auto;">
      <section class="content-grid" style="display: block;">
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
          style="margin-top: 24px;"
        />
      </section>
    </main>
  </div>
</template>

<script>
// Container view for the feature. Child components stay presentational;
// this view owns page state, validation and API coordination.
import InternalUserCreatedCard from '../components/internal-users/InternalUserCreatedCard.vue'
import InternalUserFormPanel from '../components/internal-users/InternalUserFormPanel.vue'
import { ROLE_OPTIONS } from '../constants/internalUserRoles'
import { createInternalUser } from '../services/internalUsersApi'
import {
  buildCreateInternalUserPayload,
  createInternalUserForm,
  mapInternalUserApiErrors,
  validateInternalUserForm,
} from '../utils/internalUserForm'

const DEFAULT_ROLE = ROLE_OPTIONS[0]?.value || ''

export default {
  name: 'InternalUsersView',
  components: {
    InternalUserCreatedCard,
    InternalUserFormPanel,
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
    }
  },
  methods: {
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
      } catch (error) {
        // Keep the form contract stable even if the API returns a richer error shape.
        this.fieldErrors = mapInternalUserApiErrors(error.errors)
        this.submitError = error.message || 'Nao foi possivel criar o utilizador.'
      } finally {
        this.isSubmitting = false
      }
    },
    resetForm() {
      this.form = createInternalUserForm(DEFAULT_ROLE)
      this.fieldErrors = {}
      this.submitError = ''
      this.successMessage = ''
    },
  },
}
</script>
