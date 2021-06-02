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
          <v-list-item-action @click.stop="deleteTodo(task.id)">
            <v-btn icon>
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  newTaskTitle = "";
  tasks: { id: number; title: string; done: boolean }[] = [];

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
}
</script>
