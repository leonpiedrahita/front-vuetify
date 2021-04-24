<template>
  <v-app id="inspire">
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Applicación</v-toolbar-title>
      <v-spacer></v-spacer
      ><!-- esta etiqueta me separa el contenido -->
      <v-btn icon class="mr-5" @click="salir()">
        <v-icon> mdi-logout</v-icon>
        <span> Salir </span>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" fixed temporary>
      <v-card class="mx-auto" max-width="300" tile>
        <v-list nav>
          <v-list-item :to="{ name: 'Home' }" exact>
            <v-list-item-icon>
              <v-icon v-text="'mdi-home'"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'Inicio'"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group prepend-icon="mdi-file-table" no-action>
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-title> Admin </v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item :to="{ name: 'Categoria' }">
              <v-list-item-content>
                <v-list-item-title> Categorias </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'Articulo' }">
              <v-list-item-content>
                <v-list-item-title> Articulos </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>

          <v-list-group v-if="this.$store.state.user.rol === 'administrador'"
          prepend-icon="mdi-security"
          no-action>
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-title> Permisos </v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item :to="{ name: 'Usuario' }" 
            >
              <v-list-item-content >
                <v-list-item-title> Usuario </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>
        </v-list></v-card>
        </v-navigation-drawer>
    <v-main class="grey lighten-2">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
    
    </v-app>
</template>


<script>
export default {
  name: "SeguraComponent",
  data() {
    return {
    drawer: null,
    selectedItem: 1,
    //   items: [
    //     { text: "Home", icon: "mdi-home", ruta: "Home" },
    //     { text: "Categorías", icon: "mdi-table", ruta: "Categoria" },
    //     { text: "Artículos", icon: "mdi-file", ruta: "Articulo" },
    //     { text: "Usuario", icon: "mdi-account", ruta: "Usuario" },
    //   ],
    };
  },
  created() {
    this.$store.dispatch("autoLogin");
  },
  methods: {
    salir() {
      this.$store.dispatch("salir");
    },
  },
};
</script>
