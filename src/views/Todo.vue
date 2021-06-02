<template>
  <div class="home">
    <div class="page-header pa-3">
      <h2>Tasks</h2>
      <div class="header-options">
        <template v-for="(option, i) in headerOptions">
          <v-tooltip bottom :key="i" v-if="showOption(i)">
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                v-on="on"
                @click="handleFunctionCall(option.methodName)"
              >
                <v-icon :color="option.color">{{ option.icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ option.title }}</span>
          </v-tooltip>
        </template>
      </div>
    </div>
    <draggable v-model="tasks" :options="{ disabled: !rearrange }">
      <v-card
        v-for="task in tasks"
        :elevation="4"
        :key="task.id"
        class="mx-3 mb-3"
      >
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
                    <v-icon :color="item.color" class="pl-5">{{
                      item.icon
                    }}</v-icon>
                  </v-list-item>
                </template>
              </v-list>
            </v-menu>
          </div>
        </div>
      </v-card>
    </draggable>
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
import draggable from "vuedraggable";
import { menuOptions, headerOptions } from "@/constants/uiOptions";

@Component({
  components: {
    draggable,
  },
})
export default class Home extends Vue {
  newTaskTitle = "";
  editTaskTitle = "";
  id = -1;
  rearrange = false;
  items = menuOptions;
  headerOptions = headerOptions;
  tasks: { id: number; title: string; dueTime: string; done: boolean }[] = [
    { id: 1, title: "todo 1", dueTime: "", done: false },
    { id: 2, title: "todo 2", dueTime: "", done: false },
    { id: 3, title: "todo 2", dueTime: "", done: false },
    { id: 4, title: "todo 2", dueTime: "", done: false },
    { id: 5, title: "todo 2", dueTime: "", done: false },
    { id: 6, title: "todo 2", dueTime: "", done: false },
    { id: 7, title: "todo 2", dueTime: "", done: false },
    { id: 8, title: "todo 2", dueTime: "", done: false },
    { id: 9, title: "todo 2", dueTime: "", done: false },
    { id: 10, title: "todo 2", dueTime: "", done: false },
    { id: 11, title: "todo 2", dueTime: "", done: false },
    { id: 12, title: "todo 2", dueTime: "", done: false },
  ];
  dialog = false;

  showOption(i: number): boolean {
    if (i === 0 && !this.rearrange) {
      return true;
    } else if (i !== 0 && this.rearrange) {
      return true;
    }
    return false;
  }

  addTask(): void {
    if (this.newTaskTitle) {
      const newTask = {
        id: Date.now(),
        title: this.newTaskTitle,
        dueTime: "",
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
    if (this.editTaskTitle) {
      this.dialog = false;
      this.tasks.forEach((task) => {
        if (task.id === this.id) {
          task.title = this.editTaskTitle;
        }
      });
      this.editTaskTitle = "";
      this.id = -1;
    }
  }

  updateOrder(): void {
    this.rearrange = !this.rearrange;
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
      case "toggleRearrange":
        this.rearrange = !this.rearrange;
        break;
      case "updateOrder":
        this.updateOrder();
        break;
    }
  }
}
</script>

<style lang="scss">
.page-header {
  position: sticky;
  top: 8rem;
  z-index: 1;
  background: white;
  display: flex;

  .header-options {
    margin-left: auto;
  }
}
.list-items {
  display: flex;
  align-items: center;
  .menu {
    margin-left: auto;
  }
}
</style>


      <!-- <v-text-field
        v-model="newTaskTitle"
        outlined
        label="Enter task"
        append-icon="mdi-plus"
        class="pa-3"
        hide-details
        clearable
        @click:append="addTask"
      ></v-text-field> -->