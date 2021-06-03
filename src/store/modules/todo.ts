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
      const todoList = localStorage.getItem("todoList");
      if (todoList) {
        this.todoData.push(...JSON.parse(todoList as string));
        updateTodoList(this.todoData, this.uid);
        localStorage.removeItem("todoList");
      }
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

    if (this.uid) {
      updateTodoList(this.todoData, this.uid);
    }
  }

  @Action
  public [TodoActions.ADD_TASK](newTask: string): void {
    this.context.commit(TodoMutations.ADD_TASK, { newTask });
  }

  @Mutation
  public [TodoMutations.DELETE_TASK](id: number[]): void {
    this.todoData = this.todoData.filter((task) => task.id !== id);
    if (this.uid) {
      updateTodoList(this.todoData, this.uid);
    }
  }

  @Action
  [TodoActions.DELETE_TASK](id: number): void {
    this.context.commit(TodoMutations.DELETE_TASK, id);
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
    if (this.uid) {
      updateTodoList(this.todoData, this.uid);
    }
  }

  @Action
  [TodoActions.EDIT_TASK](updatedData: {
    id: number;
    editTaskTitle: string;
  }): void {
    this.context.commit(TodoMutations.EDIT_TASK, updatedData);
  }

  @Mutation
  public [TodoMutations.UPDATE_PROGRESS](id: number): void {
    const task = this.todoData.filter((task) => task.id === id)[0];
    task.done = !task.done;
    if (this.uid) {
      updateTodoList(this.todoData, this.uid);
    }
  }

  @Action
  [TodoActions.UPDATE_PROGRESS](id: number): void {
    this.context.commit(TodoMutations.UPDATE_PROGRESS, id);
  }

  @Mutation
  public [TodoMutations.REARRANGE](tasks: any): void {
    this.todoData = tasks;
    if (this.uid) {
      updateTodoList(this.todoData, this.uid);
    }
  }

  @Action
  [TodoActions.REARRANGE](tasks: any): void {
    this.context.commit(TodoMutations.REARRANGE, tasks);
  }

  @Mutation
  public [TodoMutations.SET_USER_ID](uid: string): void {
    this.uid = uid;
    if (!uid) {
      this.todoData = [];
    }
  }

  @Mutation
  public [TodoMutations.REMOVE_ALL_TASKS](): void {
    this.todoData = [];
    if (this.uid) {
      updateTodoList(this.todoData, this.uid);
    }
  }

  @Action
  [TodoActions.REMOVE_ALL_TASKS](uid: string | null): void {
    this.context.commit(TodoMutations.REMOVE_ALL_TASKS);
  }

  @Action
  [TodoActions.SET_USER_ID](uid: string | null): void {
    this.context.commit(TodoMutations.SET_USER_ID, uid);
  }

  @Mutation
  public [TodoMutations.SET_LOCAL_STORAGE](): void {
    localStorage.setItem("todoList", JSON.stringify(this.todoData));
  }

  @Action
  [TodoActions.SET_LOCAL_STORAGE](uid: string | null): void {
    this.context.commit(TodoMutations.SET_LOCAL_STORAGE);
  }

  get loadTodoData() {
    return this.todoData;
  }
}
export default Todo;
