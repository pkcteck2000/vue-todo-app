<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> Todo app </v-list-item-title>
          <v-list-item-subtitle> powerd by vuetify </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark src="@/assets/mountains.svg" prominent>
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="input-box">
        <v-text-field
          outlined
          label="Enter task"
          append-icon="mdi-plus"
          class="ma-3 text-box"
          hide-details
          clearable
        ></v-text-field>
      </div>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { navigationoptions } from "@/constants/uiOptions";

@Component
export default class Home extends Vue {
  drawer = null;
  items = navigationoptions;
  right = null;
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
