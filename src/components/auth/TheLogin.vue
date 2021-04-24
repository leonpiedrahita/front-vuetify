<template>
  <v-layout>
    <v-flex>
      <v-row align="center" align-content="center" style="height: 70vh">
        <v-col>
          <v-card class="pa-12">
            <v-card-title title> Formulario de Login </v-card-title>
            <v-form ref="form" lazy-validation>
              <v-text-field
                v-model="login.email"
                label="E-mail"
                required
              ></v-text-field>
              <v-text-field
                v-model="login.password"
                label="Contraseña"
                type="password"
                required
              ></v-text-field>

              <v-btn
                :disabled="!(this.login.email && this.login.password)"
                color="success"
                class="mr-4"
                block
                @click="loginUser"
              >
                Login
              </v-btn>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>
<script>
import swal from "sweetalert";
import axios from "axios";

export default {
    name:'TheLogin',
  data() {
    return {
      login: {
        email: "",
        password: "",
      },
    };
  },
   beforeCreate() {
    this.$store.dispatch("autoLogin")? this.$router.push({name: 'Segura'}) : false;
  },
  methods: {
    async loginUser() {
      axios
        .post("http://localhost:3000/api/usuario/ingresar", this.login)
        .then((response) => {
          return response.data;
        })
        .then((data) => {
            this.$store.dispatch("guardarToken",data.tokenReturn );//se guarda el token en la tienda
            this.$router.push({name: 'Segura'});
          swal(
            "Login Correcto",
            `Los datos son correctos, bienvenido! usuario`,
            "success"
          );
          console.log(data);
        })
        .catch((error) => {
          swal("Oops!", "Algo salio mal!", "Error");
          console.log(error);
          return error;
        });
    },
  },
};
</script>

