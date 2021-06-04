<template>
  <div class="login">
    <div class="form">
      <v-card ref="form">
        <v-card-text>
          <v-text-field
            ref="email"
            v-model="email"
            :rules="[
              validateEmail(),
              !invalidEmail || 'Invalid Email',
              !emailExists || 'Email already exists',
            ]"
            label="Email"
            placeholder="Email"
            @keypress="
              invalidEmail = false;
              emailExists = false;
            "
          ></v-text-field>
          <v-text-field
            ref="password"
            v-model="password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[
              validatePassword(),
              !invalidPassword || 'Invalid Password',
            ]"
            :type="show ? 'text' : 'password'"
            label="Password"
            hint="At least 8 characters"
            placeholder="Password"
            @click:append="show = !show"
            @keypress="invalidPassword = false"
            required
          ></v-text-field>
        </v-card-text>

        <v-card-actions v-if="!register">
          <v-btn
            @click="login('emailPasswrod')"
            block
            color="primary"
            elevation="2"
            type="submit"
            :disabled="disableButton()"
            large
          >
            Login
          </v-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-btn
            @click="signUp()"
            block
            color="primary"
            elevation="2"
            :disabled="disableButton()"
            large
          >
            Register
          </v-btn>
        </v-card-actions>
        <div class="text-center pt-2">
          <h4 v-if="!register">
            Don't have account?
            <span class="link-text" @click="loginRegisterToggle()">
              register here.</span
            >
          </h4>
          <h4 v-else>
            Already have account?
            <span class="link-text" @click="loginRegisterToggle()">
              login here.</span
            >
          </h4>
        </div>
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
import { TodoActions } from "@/utils/types";
const todo = namespace("Todo");

@Component
export default class Login extends Vue {
  user = firebase.auth().currentUser;
  email = "";
  password = "";
  emailErrors = false;
  passwordErrors = false;
  invalidEmail = false;
  invalidPassword = false;
  emailExists = false;
  toggle_exclusive = undefined;
  register = false;
  show = false;

  @todo.Action(TodoActions.SET_LOCAL_STORAGE)
  public setLocalstorage!: () => void;

  validateEmail(): boolean | string {
    // eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!this.email) {
      this.emailErrors = true;
      return "This field is Required";
    } else if (!re.test(this.email)) {
      this.emailErrors = true;
      return "Enter valid Email";
    }
    this.emailErrors = false;
    return true;
  }

  validatePassword(): boolean | string {
    if (!this.password) {
      this.passwordErrors = true;
      return "This field is Required";
    } else if (this.password.length < 8) {
      this.passwordErrors = true;
      return "Password length should be greater than 8";
    }
    this.passwordErrors = false;
    return true;
  }

  disableButton(): boolean {
    return this.emailErrors || this.passwordErrors;
  }

  signUp(): void {
    if (this.email && this.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .catch((err) => {
          if (err.code === "auth/email-already-in-use") {
            this.emailExists = true;
          }
        });
    }
  }

  loginRegisterToggle(): void {
    this.register = !this.register;
    this.email = "";
    this.password = "";
  }

  async login(authType: string): Promise<void> {
    await this.setLocalstorage();
    let provider;
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
      case "emailPasswrod":
        if (this.email && this.password) {
          firebase
            .auth()
            .signInWithEmailAndPassword(this.email, this.password)
            .catch((err) => {
              if (err.code === "auth/user-not-found") {
                this.invalidEmail = true;
              } else if (
                err.code === "auth/wrong-password" ||
                err.code === "auth/too-many-requests"
              ) {
                this.invalidPassword = true;
              }
            });
        }
        break;
      default:
        break;
    }
    if (provider) {
      // firebase.auth().signInWithPopup(provider);
      firebase.auth().signInWithRedirect(provider);
    }
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
        background: linear-gradient(120deg, #2560df, #ffffff);
      }
    }
  }
  h4 {
    cursor: pointer;
    .link-text {
      color: rgba(5, 51, 104, 0.774);
    }
  }
}
</style>
