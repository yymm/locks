import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import Editor from './Editor.vue'
import Public from './Public.vue'
import Home from './Home.vue'

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
