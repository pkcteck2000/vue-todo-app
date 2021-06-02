<template>
  <div class="home">
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
    <v-list subheader two-line flat class="pb-0">
      <div v-for="task in tasks" :key="task.id">
        <v-list-item
          @click="doneTask(task.id)"
          :class="{ 'teal lighten-5': task.done }"
        >
          <v-list-item-action>
            <v-checkbox :input-value="task.done" color="primary"></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title
              :class="{ 'text-decoration-line-through': task.done }"
              >{{ task.title }}</v-list-item-title
            >
          </v-list-item-content>
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark icon v-bind="attrs" v-on="on">
                <v-icon color="primary">mdi-dots-vertical</v-icon>
              </v-btn>
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
                  <v-icon color="primary" class="pl-5">{{ item.icon }}</v-icon>
                </v-list-item>
              </template>
            </v-list>
          </v-menu>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </v-list>
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
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  newTaskTitle = "";
  editTaskTitle = "";
  id = -1;
  tasks: { id: number; title: string; done: boolean }[] = [
    { id: 1, title: "todo 1", done: false },
    { id: 2, title: "todo 2", done: false },
  ];

  items = [
    { title: "Delete", icon: "mdi-delete", methodName: "deleteTodo" },
    { title: "Edit", icon: "mdi-pencil", methodName: "editTodo" },
    // { title: "Click Me", icon: "", click: "" },
  ];

  dialog = false;

  addTask(): void {
    if (this.newTaskTitle) {
      const newTask = {
        id: Date.now(),
        title: this.newTaskTitle,
        done: false,
      };
      this.tasks.push(newTask);
      this.newTaskTitle = "";
    }
  }

  doneTask(id: number): void {
    let task = this.tasks.filter((task) => task.id === id)[0];
    task.done = !task.done;
  }

  deleteTodo(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  editTodo(): void {
    this.dialog = false;
    this.tasks.forEach((task) => {
      if (task.id === this.id) {
        task.title = this.editTaskTitle;
      }
    });
    this.editTaskTitle = "";
    this.id = -1;
  }

  handleFunctionCall(functionName: string, id: number, task: string): void {
    switch (functionName) {
      case "deleteTodo":
        this.deleteTodo(id);
        break;
      case "editTodo":
        this.dialog = true;
        this.id = id;
        this.editTaskTitle = task;
        break;
    }
  }
}
</script>
