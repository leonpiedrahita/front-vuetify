<template>
  <v-app id="inspire">
    <!--       los items que s evan a cargar en esta tabla estan asociados al objeto categorias que es el que
estoy poblando a traves del método listar
      esos items están ordenados a traves de la variable nombre -->
    <v-data-table
      :headers="headers"
      :items="articulos"
      sort-by="nombre"
      class="elevation-1"
      :loading="cargando"
      loading-text="Cargando ... por favor espere"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Artículos</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Agregar Artículo
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
                        label="Nombre"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.codigo"
                        label="Código"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12" md="12">
                      <v-select
                        v-model="categoriaId"
                        label="Categoría"
                        :items="categorias"
                        item-text="nombre"
                        item-value="_id"
                        return-object
                      ></v-select>
                    </v-col>
                    <!--                      <v-col cols="12" sm="12" md="12">
                      <v-select
                        v-model="editedItem.categoriaId.nombre"
                        label="Categoría"
                      ></v-select>
                    </v-col>  -->
                    <v-col cols="12" sm="12" md="12">
                      <v-textarea
                        v-model="editedItem.descripcion"
                        label="Descripción"
                        counter="254"
                      ></v-textarea>
                    </v-col>

                    <!--                       <v-col cols="12" sm="12" md="12">
                      <v-textarea
                        v-model="editedItem.estado"
                        label="Estado"
                        counter="254"
                        no-resize
                      ></v-textarea>
                    </v-col> -->
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
                >¿Desea cambiar el estado del artículo?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >NO</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >SI</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon medium class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
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
        {{$data.articulos}} <!-- para imprimir las categorias en pantalla -->
    </pre>
  </v-app>
  <!-- contenedor del datatable   -->
</template>

<script>
import axios from "axios";
export default {
  name:'DataTableArticulo',
  data: () => ({
    dialog: false,
    dialogDelete: false,
    cargando: true,
    headers: [
      {
        text: "Artículo",
        align: "start",
        sortable: true,
        value: "nombre", //la propiedad a traves de la cual va estar enlazada con el modelo
        //en este caso nombre es el nombre del espacio en la base de datos
      },
      { text: "Categoria", value: "categoriaId.nombre" },
      { text: "Descripción", value: "descripcion" },
      { text: "Código", value: "codigo" },
      { text: "Estado", value: "estado" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    categoriaId: "",
    categorias: [], //para guardar el json que consulto de la base de datos
    articulos: [],
    editedIndex: -1,
    editedItem: {
      nombre: "",
      descripcion: "",
      codigo: "",
      categoriaId: "",
 
    },
    defaultItem: {
      nombre: "",
      descripcion: "",
      codigo: "",
      categoriaId: "",

    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo artículo" : "Editar artículo"; //si es -1 new sino edit
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
    this.listar();
    this.listarcategorias();
  },

  methods: {
    listar() {
      //va a ir a mi backend y me traerá las peticiones de la base de datos
      axios
        .get("http://localhost:3000/api/articulo/listar")
        .then((response) => {
          this.articulos = response.data; //el this es porque no es propia de la funcion sino de l componente
          this.cargando = false;
        })
        .catch((error) => {
          //console.log(error);
          return error;
        });
    },
    listarcategorias() {
      //va a ir a mi backend y me traerá las peticiones de la base de datos
      axios
        .get("http://localhost:3000/api/categoria/listar")
        .then((response) => {
          this.categorias = response.data; //el this es porque no es propia de la funcion sino de l componente
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
      this.categoriaId = item ? item.categoriaId : "";
      this.editedItem = Object.assign({}, item); //esto es para autorrellenar los espacios para editar ua categoria
      this.dialog = true; //esto es para que se lance la ventana modal
    },

    deleteItem(item) {
      this.editedIndex = item._id; //obtengo el index de esta categoría
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      if (this.editedItem.estado === 1) {
        //en un caso vamos a activar el elemento y enel otro a desactivar
        //Editar categoria
        axios
          .patch(
            "http://localhost:3000/api/articulo/deactivate/" +
              this.editedItem._id,
            {}
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
          .patch(
            "http://localhost:3000/api/articulo/activate/" +
              this.editedItem._id,
            {}
          )
          .then((response) => {
            console.log(response);
            this.listar();
          })
          .catch((error) => {
            console.log(error);
            return error;
          });
      }
      this.closeDelete(); //este limpia los objetos para que no queden con los datos guardados
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.categoriaId = "";
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
            "http://localhost:3000/api/articulo/update/" + this.editedItem._id,
            {
              nombre: this.editedItem.nombre,
              descripcion: this.editedItem.descripcion,
              codigo: this.editedItem.codigo,
              categoriaId: this.categoriaId._id,
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
          .post("http://localhost:3000/api/articulo/add", {
            nombre: this.editedItem.nombre,
            descripcion: this.editedItem.descripcion,
            codigo: this.editedItem.codigo,
            categoriaId: this.categoriaId._id,
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