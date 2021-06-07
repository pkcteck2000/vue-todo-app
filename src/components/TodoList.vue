<template>
  <div
    @click="doneTask(task.id)"
    :class="{ 'teal lighten-5': task.done }"
    class="list-items px-3"
  >
    <v-checkbox :input-value="task.done" color="primary"></v-checkbox>
    <div :class="{ 'text-decoration-line-through': task.done }">
      {{ task.title }}
    </div>

    <div class="menu">
      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <div class="d-flex">
            <v-chip
              v-if="task.dueDate"
              class="ma-2"
              :color="displayDateColor(task.dueDate)"
              outlined
            >
              {{ task.dueDate | filterDate }}
            </v-chip>
            <v-btn dark icon v-bind="attrs" v-on="on">
              <v-icon color="primary">mdi-dots-vertical</v-icon>
            </v-btn>
          </div>
        </template>
        <v-list>
          <template v-for="(item, i) in items">
            <v-list-item
              :key="i"
              @click.stop="
                handleFunctionCall(item.methodName, task.id, task.title)
              "
              class="d-flex flex-row"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-icon :color="item.color" class="pl-5">{{ item.icon }}</v-icon>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </div>
    <v-dialog v-model="dialog" max-width="490">
      <v-card>
        <v-card-title class="text-h5 pa-4"> Edit Task </v-card-title>
        <v-text-field
          v-model="editTaskTitle"
          outlined
          label="Enter task"
          hide-details
          clearable
          class="pa-4"
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="editTodo"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="datePickerDialog" max-width="300">
      <v-date-picker v-model="dueDate" :min="minDate"></v-date-picker>
      <v-card-actions class="white">
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="datePickerDialog = false">
          Cancel
        </v-btn>
        <v-btn color="green darken-1" text @click="setDueDate"> Save </v-btn>
      </v-card-actions>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { TodoActions } from "@/utils/types";
import { Vue, Component, Prop } from "vue-property-decorator";
import { menuOptions } from "@/constants/uiOptions";
import { namespace } from "vuex-class";

const todo = namespace("Todo");

@Component
export default class TodoList extends Vue {
  dialog = false;
  editTaskTitle = "";
  id = -1;
  datePickerDialog = false;
  items = menuOptions;

  @Prop({ default: null }) task!: any;

  dueDate = new Date().toISOString().substr(0, 10);
  minDate = new Date().toISOString().substr(0, 10);

  @todo.Action(TodoActions.UPDATE_DUE_DATE)
  public updateDueDate!: (duteDateData: { date: any; id: number }) => void;

  @todo.Action(TodoActions.UPDATE_PROGRESS)
  public updateTask!: (id: number) => void;

  @todo.Action(TodoActions.DELETE_TASK)
  public deleteTask!: (id: number) => void;

  @todo.Action(TodoActions.EDIT_TASK)
  public editTask!: (updatedData: {
    id: number;
    editTaskTitle: string;
  }) => void;

  doneTask(id: number): void {
    this.updateTask(id);
  }

  deleteTodo(id: number): void {
    this.deleteTask(id);
  }

  editTodo(): void {
    if (this.editTaskTitle) {
      this.editTask({ id: this.id, editTaskTitle: this.editTaskTitle });
      this.dialog = false;
      this.editTaskTitle = "";
      this.id = -1;
    }
  }

  async setDueDate(): Promise<void> {
    this.datePickerDialog = false;
    await this.updateDueDate({ date: this.dueDate, id: this.id });
    this.id = -1;
  }

  displayDateColor(dueDate: string) {
    let nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    let nextDay = new Date(dueDate);
    if (dueDate === this.minDate) {
      return "red";
    } else if (
      nextDay.toString().slice(4, 15) === nextDate.toString().slice(4, 15)
    ) {
      return "orange";
    }
    return "green";
  }

  handleFunctionCall(functionName: string, id = -1, task = ""): void {
    switch (functionName) {
      case "deleteTodo":
        this.deleteTodo(id);
        break;
      case "editTodo":
        this.dialog = true;
        this.id = id;
        this.editTaskTitle = task;
        break;
      case "datePIcker":
        this.id = id;
        this.datePickerDialog = !this.datePickerDialog;
        break;
    }
  }
}
</script>

<style lang="scss">
.list-items {
  display: flex;
  align-items: center;
  .menu {
    margin-left: auto;
  }
}
</style>