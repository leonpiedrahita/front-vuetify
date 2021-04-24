import Vue from 'vue'
import Vuex from 'vuex'
import jwtdecode from 'jwt-decode'
import router from '../router'


Vue.use(Vuex)

export default new Vuex.Store({
    state: { //Creo las variables que son solo de lectura
        token: null,
        user: null,
    },
    mutations: {//creo las mutaciones para cambiar el valor de las variables del estado
        setToken(state, token) {//con state accedo a las variables del estado y con el token accedo al valor que devolvio el back al momento de loguearme
            state.token = token;
        },
        setUsuario(state, usuario) {//usuario es donde vamos a tener el token decodificado
            state.user = usuario
        }
    },
    actions: {//Las acciones hacen los llamados a las mutaciones
        guardarToken({ commit }, token) {//el commit es algo que se recibe para confirmar las llamadas a mutaciones
            commit("setToken", token);
            commit("setUsuario", jwtdecode(token));
            localStorage.setItem('token',token);            
        },
        autoLogin({ commit }) {//este metodo verifica que el usuario ya esté logueado para no pedirle mas token, solo recibe el coomit ya que solo verifico que dentro de el localstorage esté el token y si está, lo seteamos
            const token = localStorage.getItem('token'); 
            if(token){
                commit("setToken", token);
                commit("setUsuario", jwtdecode(token));
                
            }else{
                return false;
            }   
        },
        salir({ commit }) {//para borrar los datos y devolver el usuario a Home
            commit("setToken", null);
            commit("setUsuario", null);
            localStorage.removeItem('token');
            router.push({ name: 'Home' });
        }
    }
})