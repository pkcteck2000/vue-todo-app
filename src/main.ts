import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase";
import { filterDate } from "@/utils/filter";

Vue.filter("filterDate", filterDate);
Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: "AIzaSyB9dNXZCKdof0_AjaFWk2s6VFMEKXdTd8k",
  authDomain: "vue-practice-68b47.firebaseapp.com",
  projectId: "vue-practice-68b47",
  storageBucket: "vue-practice-68b47.appspot.com",
  messagingSenderId: "378533759272",
  appId: "1:378533759272:web:9f3d2fec3d80bec43ba81d",
  measurementId: "G-WEN5BWGGEY",
};

firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(() =>
  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app")
);
