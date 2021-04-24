<template>
  <v-app id="inspire">
    <!--       los items que s evan a cargar en esta tabla estan asociados al objeto categorias que es el que
estoy poblando a traves del método listar
      esos items están ordenados a traves de la variable nombre -->
    <v-data-table
      :headers="headers"
      :items="usuarios"
      sort-by="nombre"
      class="elevation-1"
      :loading="cargando"
      loading-text="Crgando ... por favor espere"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Categorías</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Agregar Usuario
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.nombre"
                        label="Nombre del usuario"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.email"
                        label="Correo"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.rol"
                        label="Rol"
                      ></v-text-field>
                    </v-col>

                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon medium @click="deleteItem(item)">
          <template v-if="item.estado"> mdi-toggle-switch </template>
          <template v-else> mdi-toggle-switch-off-outline </template>
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
    <pre>
        {{$data.categorias}} <!-- para imprimir las categorias en pantalla -->
    </pre>
  </v-app>
  <!-- contenedor del datatable   -->
</template>

<script>
import axios from "axios";
export default {
  name:'DataTableUsuario',
  data: () => ({
    dialog: false,
    dialogDelete: false,
    cargando: true,
    headers: [
      {
        text: "Nombre",
        align: "start",
        sortable: true,
        value: "nombre", //la propiedad a traves de la cual va estar enlazada con el modelo
        //en este caso nombre es el nombre del espacio en la base de datos
      },
      { text: "Correo", value: "email" },
      { text: "Rol", value: "rol" },
      { text: "Estado", value: "estado" },
      { text: "Actions", value: "actions", sortable: false },
    ],

    usuarios: [], //para guardar el json que consulto de la base de datos
    editedIndex: -1,
    editedItem: {
      nombre: "",
      email: "",
      rol: "",

    },
    defaultItem: {
      nombre: "",
      email: "",
      rol: "",

    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo usuario" : "Editar Usuario"; //si es -1 new sino edit
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
    this.listar();
  },

  methods: {
    initialize() {},

    listar() {
      //va a ir a mi backend y me traerá las peticiones de la base de datos
      axios
        .get("http://localhost:3000/api/usuario/listar")
        .then((response) => {
          this.usuarios = response.data; //el this es porque no es propia de la funcion sino de l componente
          this.cargando = false;
        })
        .catch((error) => {
          //console.log(error);
          return error;
        });
    },

    editItem(item) {
      //opcion 1 utilizando categorías
      //this.editedIndex = this.categorias[indexOf(item)]._id;

      this.editedIndex = item._id;

      this.editedItem = Object.assign({}, item); //esto es para autorrellenar los espacios para editar ua categoria
      this.dialog = true; //esto es para que se lance la ventana modal
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex != -1) {
        //Editar categoria
        axios
          .patch(
            "http://localhost:3000/api/categoria/update/" + this.editedItem._id,
            {
              nombre: this.editedItem.nombre,
              descripcion: this.editedItem.descripcion,
            }
          )
          .then((response) => {
            console.log(response);
            this.listar();
          })
          .catch((error) => {
            console.log(error);
            return error;
          });
        //Object.assign(this.categorias[this.editedIndex], this.editedItem);
      } else {
        //Crear categoria
        axios
          .post("http://localhost:3000/api/categoria/add", {
            nombre: this.editedItem.nombre,
            descripcion: this.editedItem.descripcion,
          })
          .then((response) => {
            console.log(response);
            this.listar();
          })
          .catch((error) => {
            console.log(error);
            return error;
          });
      }
      this.close(); //esto es para cerrar la ventana luego de darle al botón
    },
  },
};
</script>