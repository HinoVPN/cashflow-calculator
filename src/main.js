import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// 導入樣式文件
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/style.css'

// 導入Bootstrap的JavaScript
import * as bootstrap from 'bootstrap'

const app = createApp(App)

// 使Bootstrap可全局訪問
window.bootstrap = bootstrap

app.use(createPinia())
app.mount('#app') 