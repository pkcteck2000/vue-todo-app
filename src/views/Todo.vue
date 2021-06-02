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
import { Vue, Component, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import draggable from "vuedraggable";
import { menuOptions, headerOptions } from "@/constants/uiOptions";
import { TodoActions } from "@/utils/types";

const todo = namespace("Todo");
@Component({
  components: {
    draggable,
  },
})
export default class Home extends Vue {
  editTaskTitle = "";
  id = -1;
  rearrange = false;
  items = menuOptions;
  headerOptions = headerOptions;
  dialog = false;
  tasks: any[] = [];

  @todo.Getter("loadTodoData")
  loadTodoData!: any[];

  @todo.Action(TodoActions.DELETE_TASK)
  public deleteTask!: (id: number) => void;

  @todo.Action(TodoActions.EDIT_TASK)
  public editTask!: (updatedData: {
    id: number;
    editTaskTitle: string;
  }) => void;

  @todo.Action(TodoActions.REARRANGE)
  public rearrangeTask!: (task: any) => void;

  @todo.Action(TodoActions.UPDATE_PROGRESS)
  public updateTask!: (id: number) => void;

  @Watch("loadTodoData")
  setTaskList(): void {
    this.tasks = this.loadTodoData;
  }

  showOption(i: number): boolean {
    if (i === 0 && !this.rearrange) {
      return true;
    } else if (i !== 0 && this.rearrange) {
      return true;
    }
    return false;
  }

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

  updateOrder(): void {
    this.rearrange = !this.rearrange;
    this.rearrangeTask(this.tasks);
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

  created(): void {
    this.tasks = this.loadTodoData;
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
