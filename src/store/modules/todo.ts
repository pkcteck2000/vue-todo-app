import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { TodoActions, TodoMutations } from "@/utils/types";
@Module({ namespaced: true })
class Todo extends VuexModule {
  todoData: any[] = [];

  @Mutation
  public [TodoMutations.LOAD_TODOD_DATA](todoData: any[]): void {
    this.todoData = todoData;
  }

  @Action
  [TodoActions.LOAD_TODOD_DATA](): void {
    this.context.commit(TodoMutations.LOAD_TODOD_DATA, [
      { id: 1, title: "todo 1", dueTime: "", done: false },
      { id: 2, title: "todo 2", dueTime: "", done: false },
    ]);
  }

  @Mutation
  public [TodoMutations.ADD_TASK](newTaskTitle: any[]): void {
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      dueTime: "",
      done: false,
    };
    this.todoData.push(newTask);
  }

  @Action
  [TodoActions.ADD_TASK](newTask: string): void {
    this.context.commit(TodoMutations.ADD_TASK, newTask);
  }

  @Mutation
  public [TodoMutations.DELETE_TASK](id: number[]): void {
    this.todoData = this.todoData.filter((task) => task.id !== id);
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
  }

  @Action
  [TodoActions.UPDATE_PROGRESS](id: number): void {
    this.context.commit(TodoMutations.UPDATE_PROGRESS, id);
  }

  @Mutation
  public [TodoMutations.REARRANGE](tasks: any): void {
    this.todoData = tasks;
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
