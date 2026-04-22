<template>
  <article class="panel panel-form">
    <div class="panel-head">
      <div>
        <div
          style="font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem; background: rgba(59,130,246,0.1); width: 80px; height: 80px; display: inline-flex; align-items: center; justify-content: center; border-radius: 20px; border: 1px solid rgba(59,130,246,0.3); box-shadow: 0 0 20px rgba(59,130,246,0.2);"
        >
          IT
        </div>
        <h2>{{ $t('internalUsers.newUser') }}</h2>
        <p style="color: var(--muted); font-size: 0.95rem; margin-top: 8px;">
          {{ $t('internalUsers.newUserIntro') }}
        </p>
      </div>

      <button
        class="ghost-button"
        type="button"
        :disabled="isSubmitting"
        @click="$emit('reset')"
      >
        {{ $t('internalUsers.clear') }}
      </button>
    </div>

    <form class="form-grid" novalidate @submit.prevent="$emit('submit')">
      <label class="field">
        <span>{{ $t('internalUsers.userIdLabel') }}</span>
        <input
          :value="userId"
          autocomplete="username"
          :placeholder="$t('internalUsers.userIdPlaceholder')"
          type="text"
          @input="emitUserIdUpdate($event.target.value)"
        >
        <small v-if="fieldErrors.userId" class="field-error">
          {{ fieldErrors.userId }}
        </small>
      </label>

      <label class="field">
        <span>{{ $t('internalUsers.password') }}</span>
        <input
          :value="password"
          autocomplete="new-password"
          :placeholder="$t('internalUsers.passwordPlaceholder')"
          type="password"
          @input="$emit('update:password', $event.target.value)"
        >
        <small v-if="fieldErrors.password" class="field-error">
          {{ fieldErrors.password }}
        </small>
      </label>

      <label class="field field-full">
        <span>{{ $t('internalUsers.userType') }}</span>
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
          {{ isSubmitting ? $t('internalUsers.registering') : $t('internalUsers.registerUser') }}
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
  emits: [
    'submit',
    'reset',
    'update:user-id',
    'update:userId',
    'update:password',
    'update:role',
  ],
  methods: {
    emitUserIdUpdate(value) {
      this.$emit('update:user-id', value)
      this.$emit('update:userId', value)
    },
  },
}
</script>
