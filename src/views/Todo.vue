<template>
  <div class="home">
    <div class="page-header">
      <div class="page-header-header pa-3">
        <div class="d-flex">
          <h2>Tasks</h2>
        </div>
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
      <v-text-field
        v-if="showSearchBox"
        v-model="searchString"
        class="pa-3"
        label="Enter task title"
        clearable
      ></v-text-field>
    </div>
    <empty v-if="!(tasks.length > 0)" />
    <draggable v-else v-model="tasks" :options="{ disabled: !rearrange }">
      <v-card
        v-for="task in tasks"
        :elevation="4"
        :key="task.id"
        class="mx-3 mb-3"
      >
        <template v-if="filterTitle(task.title)">
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
                      <v-icon :color="item.color" class="pl-5">{{
                        item.icon
                      }}</v-icon>
                    </v-list-item>
                  </template>
                </v-list>
              </v-menu>
            </div>
          </div>
        </template>
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
import { Vue, Component, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import draggable from "vuedraggable";
import { menuOptions, headerOptions } from "@/constants/uiOptions";
import { TodoActions } from "@/utils/types";
import Empty from "@/components/Empty.vue";

const todo = namespace("Todo");
@Component({
  components: {
    draggable,
    Empty,
  },
})
export default class Home extends Vue {
  editTaskTitle = "";
  id = -1;
  rearrange = false;
  items = menuOptions;
  headerOptions = headerOptions;
  dialog = false;
  datePickerDialog = false;
  showSearchBox = false;
  searchString = "";
  tasks: any[] = [];
  overlay = false;
  zIndex = 1;
  dueDate = new Date().toISOString().substr(0, 10);
  minDate = new Date().toISOString().substr(0, 10);

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

  @todo.Action(TodoActions.REMOVE_ALL_TASKS)
  public removeAllTask!: () => void;

  @todo.Action(TodoActions.UPDATE_DUE_DATE)
  public updateDueDate!: (duteDateData: { date: any; id: number }) => void;

  @Watch("loadTodoData")
  setTaskList(): void {
    this.tasks = this.loadTodoData;
  }

  showOption(i: number): boolean {
    if ((i === 0 || i == 1 || i == 2) && !this.rearrange) {
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

  deleteAllTask(): void {
    this.removeAllTask();
  }

  filterTitle(title: string): boolean {
    if (title.indexOf(this.searchString) !== -1) {
      return true;
    }
    return false;
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
      case "toggleRearrange":
        this.rearrange = !this.rearrange;
        break;
      case "updateOrder":
        this.updateOrder();
        break;
      case "deleteAll":
        this.deleteAllTask();
        break;
      case "showSearchBox":
        this.showSearchBox = !this.showSearchBox;
        break;
      case "datePIcker":
        this.id = id;
        this.datePickerDialog = !this.datePickerDialog;
        break;
    }
  }

  created(): void {
    this.tasks = this.loadTodoData;
    console.log();
  }
}
</script>

<style lang="scss">
.page-header {
  position: sticky;
  top: 8rem;
  z-index: 1;
  background: white;
  &-header {
    display: flex;
    .header-options {
      margin-left: auto;
    }
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
