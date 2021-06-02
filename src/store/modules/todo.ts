import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { TodoActions, TodoMutations } from "@/utils/types";
import { getTodoList, updateTodoList } from "@/utils/api";
@Module({ namespaced: true })
class Todo extends VuexModule {
  public todoData: any[] = [];

  @Mutation
  public async [TodoMutations.LOAD_TODOD_DATA](): Promise<void> {
    getTodoList().then((response) => {
      this.todoData = response.data || [];
    });
  }

  @Action
  [TodoActions.LOAD_TODOD_DATA](): void {
    this.context.commit(TodoMutations.LOAD_TODOD_DATA);
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
    updateTodoList(this.todoData);
  }

  @Action
  public [TodoActions.ADD_TASK](newTask: string): void {
    this.context.commit(TodoMutations.ADD_TASK, { newTask });
  }

  @Mutation
  public [TodoMutations.DELETE_TASK](id: number[]): void {
    this.todoData = this.todoData.filter((task) => task.id !== id);
    updateTodoList(this.todoData);
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
    updateTodoList(this.todoData);
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
    updateTodoList(this.todoData);
  }

  @Action
  [TodoActions.UPDATE_PROGRESS](id: number): void {
    this.context.commit(TodoMutations.UPDATE_PROGRESS, id);
  }

  @Mutation
  public [TodoMutations.REARRANGE](tasks: any): void {
    this.todoData = tasks;
    updateTodoList(this.todoData);
  }

  @Action
  [TodoActions.REARRANGE](tasks: any): void {
    this.context.commit(TodoMutations.REARRANGE, tasks);
  }

  get loadTodoData() {
    return this.todoData;
  }
}
export default Todo;
