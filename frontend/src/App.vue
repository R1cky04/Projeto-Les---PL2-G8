<template>
  <div class="page-shell">
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
        <article class="panel panel-form">
          <div class="panel-head">
            <div>
              <p class="panel-label">RF1 a RF4</p>
              <h2>Criar utilizador interno</h2>
            </div>
            <button
              class="ghost-button"
              type="button"
              :disabled="isSubmitting"
              @click="resetForm"
            >
              Limpar
            </button>
          </div>

          <form class="form-grid" novalidate @submit.prevent="submitForm">
            <label class="field">
              <span>User ID</span>
              <input
                v-model.trim="form.userId"
                autocomplete="username"
                placeholder="ex: staff.lisboa"
                type="text"
              >
              <small v-if="fieldErrors.userId" class="field-error">
                {{ fieldErrors.userId }}
              </small>
            </label>

            <label class="field">
              <span>Password</span>
              <input
                v-model="form.password"
                autocomplete="new-password"
                placeholder="Minimo 8 caracteres com complexidade"
                type="password"
              >
              <small v-if="fieldErrors.password" class="field-error">
                {{ fieldErrors.password }}
              </small>
            </label>

            <label class="field field-full">
              <span>Tipo de utilizador</span>
              <select v-model="form.role">
                <option
                  v-for="role in roleOptions"
                  :key="role.value"
                  :value="role.value"
                >
                  {{ role.label }}
                </option>
              </select>
              <small v-if="fieldErrors.role" class="field-error">
                {{ fieldErrors.role }}
              </small>
            </label>

            <p v-if="submitError" class="banner banner-error">
              {{ submitError }}
            </p>

            <p v-if="successMessage" class="banner banner-success">
              {{ successMessage }}
            </p>

            <div class="form-actions">
              <button class="primary-button" type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'A criar...' : 'Criar utilizador' }}
              </button>
            </div>
          </form>
        </article>

        <article class="panel panel-guidance">
          <div class="panel-head">
            <div>
              <p class="panel-label">Hierarquia</p>
              <h2>Perfis e permissoes herdadas</h2>
            </div>
          </div>

          <div class="role-list">
            <article
              v-for="role in roleOptions"
              :key="role.value"
              class="role-card"
              :class="{ 'role-card-selected': form.role === role.value }"
            >
              <div class="role-topline">
                <strong>{{ role.label }}</strong>
                <span>{{ role.activationLabel }}</span>
              </div>
              <p>{{ role.description }}</p>
            </article>
          </div>
        </article>

        <article v-if="createdUser" class="panel panel-result">
          <div class="panel-head">
            <div>
              <p class="panel-label">Resultado</p>
              <h2>Conta criada</h2>
            </div>
          </div>

          <div class="result-grid">
            <div>
              <span class="result-key">User ID</span>
              <strong>{{ createdUser.userId }}</strong>
            </div>
            <div>
              <span class="result-key">Perfil</span>
              <strong>{{ roleLabel(createdUser.role) }}</strong>
            </div>
            <div>
              <span class="result-key">Estado</span>
              <strong>{{ createdUser.status }}</strong>
            </div>
            <div>
              <span class="result-key">Ativa</span>
              <strong>{{ createdUser.isActive ? 'Sim' : 'Nao' }}</strong>
            </div>
          </div>

          <div class="permissions-block">
            <span class="result-key">Permissoes associadas</span>
            <div class="permission-list">
              <span
                v-for="permission in createdUser.permissions"
                :key="permission"
                class="permission-tag"
              >
                {{ formatPermission(permission) }}
              </span>
            </div>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script>
import { ROLE_OPTIONS } from './constants/internalUserRoles'
import { createInternalUser } from './services/internalUsersApi'

const USER_ID_PATTERN = /^[a-z0-9._-]{4,30}$/

export default {
  name: 'App',
  data() {
    return {
      roleOptions: ROLE_OPTIONS,
      form: {
        userId: '',
        password: '',
        role: ROLE_OPTIONS[0].value,
      },
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

      const validationErrors = this.validateForm()

      if (Object.keys(validationErrors).length > 0) {
        this.fieldErrors = validationErrors
        return
      }

      this.fieldErrors = {}
      this.isSubmitting = true

      try {
        const payload = {
          userId: this.form.userId.trim().toLowerCase(),
          password: this.form.password,
          role: this.form.role,
        }
        const response = await createInternalUser(payload)

        this.createdUser = response.user
        this.successMessage = response.message
        this.form.userId = ''
        this.form.password = ''
        this.form.role = ROLE_OPTIONS[0].value
      } catch (error) {
        this.fieldErrors = this.mapApiErrors(error.errors)
        this.submitError = error.message || 'Nao foi possivel criar o utilizador.'
      } finally {
        this.isSubmitting = false
      }
    },
    validateForm() {
      const errors = {}
      const normalizedUserId = this.form.userId.trim().toLowerCase()

      if (!normalizedUserId) {
        errors.userId = 'O User ID e obrigatorio.'
      } else if (!USER_ID_PATTERN.test(normalizedUserId)) {
        errors.userId =
          'Usa entre 4 e 30 caracteres com letras minusculas, numeros, ponto, underscore ou hifen.'
      }

      if (!this.form.password) {
        errors.password = 'A password e obrigatoria.'
      } else if (this.form.password.length < 8) {
        errors.password = 'A password deve ter pelo menos 8 caracteres.'
      }

      if (!/[a-z]/.test(this.form.password)) {
        errors.password = errors.password || 'A password deve incluir uma letra minuscula.'
      }

      if (!/[A-Z]/.test(this.form.password)) {
        errors.password = errors.password || 'A password deve incluir uma letra maiuscula.'
      }

      if (!/[0-9]/.test(this.form.password)) {
        errors.password = errors.password || 'A password deve incluir um numero.'
      }

      if (!/[^A-Za-z0-9]/.test(this.form.password)) {
        errors.password =
          errors.password || 'A password deve incluir um caractere especial.'
      }

      if (!this.form.role) {
        errors.role = 'Seleciona um tipo de utilizador.'
      }

      return errors
    },
    mapApiErrors(errors) {
      if (!Array.isArray(errors)) {
        return {}
      }

      return errors.reduce((mappedErrors, error) => {
        if (error?.field && error?.message && !mappedErrors[error.field]) {
          mappedErrors[error.field] = error.message
        }

        return mappedErrors
      }, {})
    },
    resetForm() {
      this.form.userId = ''
      this.form.password = ''
      this.form.role = ROLE_OPTIONS[0].value
      this.fieldErrors = {}
      this.submitError = ''
      this.successMessage = ''
    },
    roleLabel(role) {
      const foundRole = this.roleOptions.find((entry) => entry.value === role)
      return foundRole ? foundRole.label : role
    },
    formatPermission(permission) {
      return permission
        .toLowerCase()
        .split('_')
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ')
    },
  },
}
</script>

<style>
:root {
  --paper: #f4ede3;
  --ink: #1f1d1a;
  --muted: #6c655d;
  --accent: #b0462d;
  --accent-dark: #7d2f1d;
  --success-bg: #d6f0d9;
  --success-text: #215f35;
  --error-bg: #f8d8d2;
  --error-text: #8b2b1d;
  --line: rgba(31, 29, 26, 0.12);
  --panel-shadow: 0 30px 60px rgba(74, 50, 33, 0.16);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background:
    radial-gradient(circle at top left, rgba(229, 181, 94, 0.35), transparent 28%),
    linear-gradient(135deg, #efe5d6 0%, #f8f3ec 48%, #e8ddd2 100%);
  color: var(--ink);
  font-family: 'Trebuchet MS', 'Gill Sans', 'Segoe UI', sans-serif;
}

#app {
  min-height: 100vh;
}

.page-shell {
  min-height: 100vh;
  padding: 48px 20px 56px;
}

.page-layout {
  max-width: 1160px;
  margin: 0 auto;
}

.hero {
  margin-bottom: 30px;
}

.eyebrow,
.panel-label,
.result-key {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.76rem;
  color: var(--muted);
}

.hero h1,
.panel-head h2 {
  margin: 0;
  font-family: Georgia, 'Times New Roman', serif;
}

.hero h1 {
  max-width: 800px;
  font-size: clamp(2.4rem, 4vw, 4.4rem);
  line-height: 0.95;
}

.intro {
  max-width: 760px;
  margin: 18px 0 0;
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--muted);
}

.hero-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.pill {
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.55);
  font-size: 0.88rem;
}

.pill-strong {
  background: var(--ink);
  color: var(--paper);
  border-color: transparent;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.9fr);
  gap: 22px;
}

.panel {
  padding: 24px;
  border-radius: 24px;
  background: rgba(255, 251, 245, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: var(--panel-shadow);
  backdrop-filter: blur(10px);
}

.panel-form {
  grid-row: span 2;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
  margin-bottom: 18px;
}

.panel-head h2 {
  font-size: 1.6rem;
}

.ghost-button,
.primary-button {
  border: 0;
  border-radius: 14px;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
}

.ghost-button {
  padding: 12px 16px;
  background: transparent;
  border: 1px solid var(--line);
  color: var(--ink);
}

.primary-button {
  width: 100%;
  padding: 15px 18px;
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  color: #fff7ef;
  font-weight: 700;
  box-shadow: 0 16px 26px rgba(176, 70, 45, 0.25);
}

.ghost-button:hover,
.primary-button:hover {
  transform: translateY(-1px);
}

.ghost-button:disabled,
.primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.72;
  transform: none;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field span {
  font-size: 0.9rem;
  font-weight: 700;
}

.field input,
.field select {
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.75);
  color: var(--ink);
  font-size: 1rem;
}

.field-full,
.banner,
.form-actions {
  grid-column: 1 / -1;
}

.field input:focus,
.field select:focus {
  outline: 2px solid rgba(176, 70, 45, 0.26);
  border-color: rgba(176, 70, 45, 0.4);
}

.field-error {
  color: var(--error-text);
  font-size: 0.84rem;
}

.banner {
  margin: 0;
  padding: 13px 16px;
  border-radius: 16px;
  font-size: 0.95rem;
}

.banner-error {
  background: var(--error-bg);
  color: var(--error-text);
}

.banner-success {
  background: var(--success-bg);
  color: var(--success-text);
}

.role-list {
  display: grid;
  gap: 14px;
}

.role-card {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.62);
}

.role-card-selected {
  border-color: rgba(176, 70, 45, 0.4);
  background: rgba(176, 70, 45, 0.08);
}

.role-topline {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: baseline;
  margin-bottom: 8px;
}

.role-topline strong {
  font-size: 1.04rem;
}

.role-topline span,
.role-card p {
  color: var(--muted);
}

.role-card p {
  margin: 0;
  line-height: 1.6;
}

.panel-result {
  background: linear-gradient(180deg, rgba(255, 249, 240, 0.9), rgba(243, 234, 220, 0.88));
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 18px;
}

.result-grid strong {
  display: block;
  margin-top: 6px;
  font-size: 1rem;
}

.permissions-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.permission-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.permission-tag {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(31, 29, 26, 0.07);
  font-size: 0.84rem;
}

@media (max-width: 980px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .panel-form {
    grid-row: auto;
  }
}

@media (max-width: 720px) {
  .page-shell {
    padding: 24px 14px 36px;
  }

  .panel {
    padding: 18px;
    border-radius: 20px;
  }

  .form-grid,
  .result-grid {
    grid-template-columns: 1fr;
  }

  .panel-head,
  .role-topline {
    flex-direction: column;
  }
}
</style>
