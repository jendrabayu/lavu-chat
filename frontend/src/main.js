import './pusher';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@popperjs/core'
import './assets/scss/style.scss'

createApp(App).use(store).use(router).mount('#app')