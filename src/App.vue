<template>
  <v-app id="inspire">

    <v-main class="grey lighten-2">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({

  }),
};
</script>
