<template>
  <div class="login">
    <div class="form">
      <v-card>
        <v-card-text>
          <v-text-field
            ref="email"
            v-model="email"
            :rules="[() => !!email || 'This field is required']"
            :error-messages="errorMessages"
            label="Email"
            placeholder="Email"
            required
          ></v-text-field>
          <v-text-field
            ref="password"
            v-model="password"
            :rules="[
              () => !!password || 'This field is required',
              () =>
                (!!password && password.length <= 25) ||
                'Address must be less than 25 characters',
              passwordCheck,
            ]"
            label="Password Line"
            placeholder="Password"
            required
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn block color="primary" elevation="2" large> Login </v-btn>
        </v-card-actions>
        <div class="divider my-8"><span>Or</span></div>
        <v-card-actions>
          <v-btn-toggle class="button-group">
            <v-btn @click="login('google')" class="button google">
              <v-icon>mdi-google</v-icon>
            </v-btn>
            <v-btn @click="login('github')" class="button github">
              <v-icon>mdi-github</v-icon>
            </v-btn>
            <v-btn @click="login('facebook')" class="button facebook">
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";
import firebase from "firebase";
import { TodoActions, UserActions } from "@/utils/types";
const todo = namespace("Todo");

@Component
export default class Login extends Vue {
  user = firebase.auth().currentUser;
  email = null;
  password = null;
  errorMessages: string | string[] = "";
  formHasErrors = false;
  toggle_exclusive = undefined;

  @todo.Action(TodoActions.SET_LOCAL_STORAGE)
  public setLocalstorage!: () => void;

  passwordCheck() {
    this.errorMessages =
      this.password && !this.email ? `Hey! I'm required` : "";
    return true;
  }

  submit() {
    this.formHasErrors = false;
  }

  async login(authType: string): Promise<void> {
    await this.setLocalstorage();
    let provider: any;
    switch (authType) {
      case "google":
        provider = new firebase.auth.GoogleAuthProvider();
        break;
      case "github":
        provider = new firebase.auth.GithubAuthProvider();
        break;
      case "facebook":
        provider = new firebase.auth.FacebookAuthProvider();
        break;
      default:
        break;
    }
    // firebase.auth().signInWithPopup(provider);
    firebase.auth().signInWithRedirect(provider);
  }
}
</script>

<style lang="scss">
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10rem;
  @media screen and (max-width: 768px) {
    margin-top: 0rem;
  }
  .form {
    width: 600px;
    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }
  .divider {
    width: 95%;
    text-align: center;
    border-bottom: 1px solid rgb(184, 173, 173);
    line-height: 0.1em;
    margin: 0px 15px;
  }

  .divider span {
    background: #fff;
    padding: 0 10px;
  }

  .button-group {
    width: 100%;
    border: 1px solid rgb(117, 114, 114);
    .button {
      width: 33.33%;
      background: rgb(214, 235, 235);
    }
    .google {
      &:hover {
        background: linear-gradient(
          -100deg,
          #4285f4,
          #09ad09,
          #fbbc05,
          #ff0000
        );
      }
    }
    .github {
      &:hover {
        background: linear-gradient(120deg, #2c2f35, #ffffff);
      }
    }
    .facebook {
      &:hover {
        background: linear-gradient(120deg, #3b5998, #ffffff);
      }
    }
  }
}
</style>
