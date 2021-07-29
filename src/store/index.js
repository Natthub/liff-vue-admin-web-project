import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    receipts:[],
    products:[],
    apiUrl:'https://liff-pointshop-go.herokuapp.com',
  },
  mutations: {
    addReceipt(state,value){
      state.receipts = value
    }
  },
  actions: {
    getReceipt(context){
      axios
          .get(this.$store.state.apiUrl+"/receipt/nonscore")
          .then(response =>{
            context.commit('addReceipt',response.data)
          })
          .catch(error => console.log(error))
    },
  },
  modules: {
  }
})
