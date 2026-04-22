import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.css'
import { createI18nPlugin } from './services/i18n'

createApp(App)
	.use(createI18nPlugin())
	.mount('#app')
