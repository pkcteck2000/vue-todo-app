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
          <TodoList :task="task" />
        </template>
      </v-card>
    </draggable>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import draggable from "vuedraggable";
import { headerOptions } from "@/constants/uiOptions";
import { TodoActions } from "@/utils/types";
import Empty from "@/components/Empty.vue";
import TodoList from "@/components/TodoList.vue";

const todo = namespace("Todo");
@Component({
  components: {
    draggable,
    TodoList,
    Empty,
  },
})
export default class Home extends Vue {
  rearrange = false;
  headerOptions = headerOptions;
  showSearchBox = false;
  searchString = "";
  tasks: any[] = [];

  @todo.Getter("loadTodoData")
  loadTodoData!: any[];

  @todo.Action(TodoActions.REARRANGE)
  public rearrangeTask!: (task: any) => void;

  @todo.Action(TodoActions.REMOVE_ALL_TASKS)
  public removeAllTask!: () => void;

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

  updateOrder(): void {
    this.rearrange = !this.rearrange;
    this.rearrangeTask(this.tasks);
  }

  deleteAllTask(): void {
    this.removeAllTask();
  }

  filterTitle(title: string): boolean {
    if (title.toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1) {
      return true;
    }
    return false;
  }

  handleFunctionCall(functionName: string, id = -1, task = ""): void {
    switch (functionName) {
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
  &-header {
    display: flex;
    .header-options {
      margin-left: auto;
    }
  }
}
</style>
