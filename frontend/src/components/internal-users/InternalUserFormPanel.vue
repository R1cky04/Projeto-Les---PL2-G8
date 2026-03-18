<template>
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
        @click="$emit('reset')"
      >
        Limpar
      </button>
    </div>

    <form class="form-grid" novalidate @submit.prevent="$emit('submit')">
      <label class="field">
        <span>User ID</span>
        <input
          :value="userId"
          autocomplete="username"
          placeholder="ex: staff.lisboa"
          type="text"
          @input="$emit('update:userId', $event.target.value)"
        >
        <small v-if="fieldErrors.userId" class="field-error">
          {{ fieldErrors.userId }}
        </small>
      </label>

      <label class="field">
        <span>Password</span>
        <input
          :value="password"
          autocomplete="new-password"
          placeholder="Minimo 8 caracteres com complexidade"
          type="password"
          @input="$emit('update:password', $event.target.value)"
        >
        <small v-if="fieldErrors.password" class="field-error">
          {{ fieldErrors.password }}
        </small>
      </label>

      <label class="field field-full">
        <span>Tipo de utilizador</span>
        <select
          :value="role"
          @change="$emit('update:role', $event.target.value)"
        >
          <option
            v-for="roleOption in roleOptions"
            :key="roleOption.value"
            :value="roleOption.value"
          >
            {{ roleOption.label }}
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
</template>

<script>
// Stateless form component. The parent owns all state and side effects.
export default {
  name: 'InternalUserFormPanel',
  props: {
    userId: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    roleOptions: {
      type: Array,
      required: true,
    },
    fieldErrors: {
      type: Object,
      default: () => ({}),
    },
    submitError: {
      type: String,
      default: '',
    },
    successMessage: {
      type: String,
      default: '',
    },
    isSubmitting: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['submit', 'reset', 'update:userId', 'update:password', 'update:role'],
}
</script>
