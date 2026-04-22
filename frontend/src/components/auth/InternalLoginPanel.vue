<template>
  <section class="auth-card auth-login-card">
    <div class="auth-copy">
      <h1>{{ $t('login.title') }}</h1>
      <p>
        {{ $t('login.description') }}
      </p>
    </div>

    <form class="auth-form" novalidate @submit.prevent="$emit('submit')">
      <label class="auth-field">
        <span>{{ $t('login.userIdLabel') }}</span>
        <input
          :value="userId"
          autocomplete="username"
          :placeholder="$t('login.userIdPlaceholder')"
          type="text"
          @input="emitUserIdUpdate($event.target.value)"
        >
        <small v-if="fieldErrors.userId" class="auth-field-error">
          {{ fieldErrors.userId }}
        </small>
      </label>

      <label class="auth-field">
        <span>{{ $t('login.passwordLabel') }}</span>
        <input
          :value="password"
          autocomplete="current-password"
          :placeholder="$t('login.passwordPlaceholder')"
          type="password"
          @input="$emit('update:password', $event.target.value)"
        >
        <small v-if="fieldErrors.password" class="auth-field-error">
          {{ fieldErrors.password }}
        </small>
      </label>

      <p v-if="submitError" class="auth-banner auth-banner-error">
        {{ submitError }}
      </p>

      <div class="auth-actions">
        <button class="auth-primary-button" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? $t('login.authenticating') : $t('login.signIn') }}
        </button>
      </div>
    </form>
  </section>
</template>

<script>
// Presentational login form. The parent owns state, validation and API calls.
export default {
  name: 'InternalLoginPanel',
  props: {
    userId: {
      type: String,
      required: true,
    },
    password: {
      type: String,
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
    isSubmitting: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['submit', 'update:user-id', 'update:userId', 'update:password'],
  methods: {
    emitUserIdUpdate(value) {
      this.$emit('update:user-id', value)
      this.$emit('update:userId', value)
    },
  },
}
</script>
