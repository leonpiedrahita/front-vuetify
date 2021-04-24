import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      public: true
    },
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },


  {//creo un nuevo componente a partir de su ruta
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      public: true
    },
  },
  {//creo un nuevo componente a partir de su ruta
    path: '/segura',
    name: 'Segura',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "segura" */ '../views/Segura.vue'),
    meta: {
      private: true
    },
    children: [
      {//creo un nuevo componente a partir de su ruta
        path: 'categoria',
        name: 'Categoria',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "categoria" */ '../views/Categoria.vue'),
        meta: {
          private: true
        },
      },

      {//creo un nuevo componente a partir de su ruta
        path: 'articulo',
        name: 'Articulo',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "articulo" */ '../views/Articulo.vue'),
        meta: {
          private: true
        },
      },

      {//creo un nuevo componente a partir de su ruta
        path: 'usuario',
        name: 'Usuario',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "usuario" */ '../views/Usuario.vue'),
        meta: {
          private: true
        },
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {//acá se verifica si la ruta a la que estamos accediendo es publica o privada
  if (to.matched.some(record => record.meta.public)) {//si la ruta a la que voy a acceder tiene el meta public
    next();
  } else if (to.matched.some(record => record.meta.private)) {//si la ruta es privada/requiere autenticación
    // if (store.state.user && store.state.user.rol === Admministrador) {//esto e spor si quiero restringín las rutas a los roles
    //   next();
    // }else{
      
    // }

    if (store.state.user) {//esto e spor si quiero restringín las rutas a los roles
      next();
    }else{
      next({name: 'Login'})
    }

  } else {
    next()//bien pueda siga
  }

})

export default router
