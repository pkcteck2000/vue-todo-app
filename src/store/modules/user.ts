import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { UserActions, UserMutations } from "@/utils/types";

@Module({ namespaced: true })
class User extends VuexModule {
  public userInfo: any[] = [];
  public isLoggedIn = false;

  @Mutation
  public async [UserMutations.SET_USER_INFO](loginDetails: {
    userInfo: any;
    isLoggedIn: boolean;
  }): Promise<void> {
    this.isLoggedIn = loginDetails.isLoggedIn;
    this.userInfo = loginDetails.userInfo;
  }

  @Action
  [UserActions.SET_USER_INFO](loginDetails: {
    userInfo: any;
    isLoggedIn: boolean;
  }): void {
    this.context.commit(UserMutations.SET_USER_INFO, loginDetails);
  }

  get loadUserData(): any {
    return this.userInfo;
  }

  get isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }
}
export default User;
