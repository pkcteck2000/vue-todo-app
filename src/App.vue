<template>
  <div id="app">
    <v-app id="inspire">
      <v-navigation-drawer v-model="drawer" app>
        <v-list-item class="pa-5">
          <v-list-item-content>
            <div class="d-flex">
              <v-avatar>
                <img :src="profileUrl" alt="profile-pic" />
              </v-avatar>
              <v-list-item-title class="title pl-2">
                {{ displayName }}
              </v-list-item-title>
            </div>
            <v-list-item-subtitle> {{ email }} </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense nav>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            :to="item.to"
            link
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar
        app
        color="primary"
        dark
        src="@/assets/mountains.svg"
        prominent
      >
        <template v-slot:img="{ props }">
          <v-img
            v-bind="props"
            gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
          ></v-img>
        </template>

        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <div class="input-box">
          <v-text-field
            v-model="newTaskTitle"
            outlined
            label="Enter task"
            append-icon="mdi-plus"
            class="pa-3"
            hide-details
            clearable
            @click:append="addTask"
          ></v-text-field>
        </div>
        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <div class="menu">
          <v-menu bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click.stop="logout()" v-if="user">
                <v-list-item-title>Logout</v-list-item-title>
                <v-icon color="primary" class="pl-5">mdi-logout</v-icon>
              </v-list-item>
              <v-list-item @click.stop="login()" v-else>
                <v-list-item-title>Login</v-list-item-title>
                <v-icon color="primary" class="pl-5">mdi-login</v-icon>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-app-bar>

      <v-main>
        <router-view></router-view>
      </v-main>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { navigationoptions } from "@/constants/uiOptions";
import { TodoActions } from "./utils/types";
import firebase from "firebase";
import router from "@/router";

const todo = namespace("Todo");
@Component
export default class Home extends Vue {
  drawer = null;
  items = navigationoptions;
  right = null;
  newTaskTitle = "";
  user = firebase.auth().currentUser;
  displayName: string | undefined | null = "";
  profileUrl: string | undefined | null = "";
  email: string | undefined | null = "";

  @todo.Action(TodoActions.LOAD_TODOD_DATA)
  public loadTodoData!: () => void;

  @todo.Action(TodoActions.ADD_TASK)
  public addNewTask!: (newTask: string) => void;

  created(): void {
    this.loadTodoData();
    this.displayName = this.user?.displayName;
    this.profileUrl = this.user?.photoURL;
    this.email = this.user?.email;
  }

  addTask(): void {
    if (this.newTaskTitle) {
      this.addNewTask(this.newTaskTitle);
    }
  }

  login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider).catch(console.log);
  }

  logout(): void {
    firebase.auth().signOut();
    if (router.currentRoute.name != "Todo") {
      router.push({ name: "Todo" });
    }
    this.user = null;
  }
}
</script>

<style lang="scss">
.input-box {
  position: fixed;
  z-index: 5;
  width: 100%;
  top: 3rem;
  left: 0;
  .text-box {
    background: rgba(54, 59, 73, 0.5);
  }
}
</style>
