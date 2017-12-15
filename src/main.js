import Vue from 'vue'
import Router from 'vue-router'
import App from './components/App.vue'
import Editor from './components/editor/Editor.vue'
import Public from './components/public/Public.vue'
import Home from './components/home/Home.vue'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/editor/:datetime',
      component: Editor
    },
    {
      path: '/public/:data',
      component: Public
    },
    {
      path: '/',
      component: Home
    }
  ]
})

new Vue({
  el: '#app',
  router,
  template: '<App />',
  components: { App }
})
