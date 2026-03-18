<template>
  <div class="internal-users-page page-shell">
    <main class="page-layout">
      <section class="hero">
        <p class="eyebrow">Sprint | Criacao de Contas de Utilizador</p>
        <h1>Backoffice IT para onboarding de contas internas</h1>
        <p class="intro">
          Fluxo de criacao de utilizadores Staff, Admin e Frota com validacao,
          permissoes herdadas e estado inicial alinhado com o perfil.
        </p>
        <div class="hero-pills">
          <span class="pill pill-strong">Sessao simulada: IT</span>
          <span class="pill">Backend Nest + Prisma</span>
          <span class="pill">Feedback imediato de sucesso e erro</span>
        </div>
      </section>

      <section class="content-grid">
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

        <InternalUserRoleGuide
          :role-options="roleOptions"
          :selected-role="form.role"
        />

        <InternalUserCreatedCard
          v-if="createdUser"
          :created-user="createdUser"
          :role-options="roleOptions"
        />
      </section>
    </main>
  </div>
</template>

<script>
import InternalUserCreatedCard from '../components/internal-users/InternalUserCreatedCard.vue'
import InternalUserFormPanel from '../components/internal-users/InternalUserFormPanel.vue'
import InternalUserRoleGuide from '../components/internal-users/InternalUserRoleGuide.vue'
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
    InternalUserRoleGuide,
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
        )

        this.createdUser = response.user
        this.successMessage = response.message
        this.form = createInternalUserForm(DEFAULT_ROLE)
      } catch (error) {
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
