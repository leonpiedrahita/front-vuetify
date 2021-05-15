import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/reporte',
    name: 'Reporte',
    component: () => import(/* webpackChunkName: "reporte" */ '../views/Reporte.vue')
  },
  {
    path: '/firma',
    name: 'Firma',
    component: () => import(/* webpackChunkName: "firma" */ '../views/Firma.vue')
  },
  {
    path: '/formulario',
    name: 'Formulario',
    component: () => import(/* webpackChunkName: "formulario" */ '../views/Formulario.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
