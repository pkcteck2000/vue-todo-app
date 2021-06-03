import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { TodoActions, TodoMutations } from "@/utils/types";
import { getTodoList, updateTodoList } from "@/utils/api";
import { AxiosResponse } from "axios";

@Module({ namespaced: true })
class Todo extends VuexModule {
  public todoData: any[] = [];
  public uid: string | null = null;

  @Mutation
  public [TodoMutations.LOAD_TODOD_DATA](): void {
    getTodoList(this.uid).then((response: AxiosResponse) => {
      this.todoData = response.data || [];
    });
  }

  @Action
  [TodoActions.LOAD_TODOD_DATA](): void {
    if (this.uid) {
      this.context.commit(TodoMutations.LOAD_TODOD_DATA);
    }
  }

  @Mutation
  public [TodoMutations.ADD_TASK](newTaskTitle: { newTask: string }): void {
    const newTask = {
      id: Date.now(),
      title: newTaskTitle.newTask,
      dueTime: "",
      done: false,
    };
    this.todoData.push(newTask);
    updateTodoList(this.todoData, this.uid);
  }

  @Action
  public [TodoActions.ADD_TASK](newTask: string): void {
    if (this.uid) {
      this.context.commit(TodoMutations.ADD_TASK, { newTask });
    }
  }

  @Mutation
  public [TodoMutations.DELETE_TASK](id: number[]): void {
    this.todoData = this.todoData.filter((task) => task.id !== id);
    updateTodoList(this.todoData, this.uid);
  }

  @Action
  [TodoActions.DELETE_TASK](id: number): void {
    if (this.uid) {
      this.context.commit(TodoMutations.DELETE_TASK, id);
    }
  }

  @Mutation
  public [TodoMutations.EDIT_TASK](updatedData: {
    id: number;
    editTaskTitle: string;
  }): void {
    this.todoData.forEach((task) => {
      if (task.id === updatedData.id) {
        task.title = updatedData.editTaskTitle;
      }
    });
    updateTodoList(this.todoData, this.uid);
  }

  @Action
  [TodoActions.EDIT_TASK](updatedData: {
    id: number;
    editTaskTitle: string;
  }): void {
    if (this.uid) {
      this.context.commit(TodoMutations.EDIT_TASK, updatedData);
    }
  }

  @Mutation
  public [TodoMutations.UPDATE_PROGRESS](id: number): void {
    const task = this.todoData.filter((task) => task.id === id)[0];
    task.done = !task.done;
    updateTodoList(this.todoData, this.uid);
  }

  @Action
  [TodoActions.UPDATE_PROGRESS](id: number): void {
    if (this.uid) {
      this.context.commit(TodoMutations.UPDATE_PROGRESS, id);
    }
  }

  @Mutation
  public [TodoMutations.REARRANGE](tasks: any): void {
    this.todoData = tasks;
    updateTodoList(this.todoData, this.uid);
  }

  @Action
  [TodoActions.REARRANGE](tasks: any): void {
    if (this.uid) {
      this.context.commit(TodoMutations.REARRANGE, tasks);
    }
  }

  @Mutation
  public [TodoMutations.SET_USER_ID](uid: string): void {
    this.uid = uid;
  }

  @Action
  [TodoActions.SET_USER_ID](uid: string | null): void {
    this.context.commit(TodoMutations.SET_USER_ID, uid);
  }

  get loadTodoData() {
    return this.todoData;
  }
}
export default Todo;
