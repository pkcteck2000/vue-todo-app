import Vue from "vue";
import Vuex from "vuex";
import Todo from "@/store/modules/todo";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    Todo,
  },
});
