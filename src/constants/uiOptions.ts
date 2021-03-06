const navigationoptions = [
  { title: "Todo", icon: "mdi-format-list-checks", to: "/" },
  { title: "About", icon: "mdi-information", to: "/about" },
];

const menuOptions = [
  {
    title: "Delete",
    icon: "mdi-delete",
    methodName: "deleteTodo",
    color: "red",
  },
  {
    title: "Edit",
    icon: "mdi-pencil",
    methodName: "editTodo",
    color: "primary",
  },
  {
    title: "Due date",
    icon: "mdi-calendar",
    methodName: "datePIcker",
    color: "#eb34b1",
  },
];

const headerOptions = [
  {
    title: "Rearrange tasks",
    icon: "mdi-order-alphabetical-descending",
    methodName: "toggleRearrange",
    color: "primary",
  },
  {
    title: "Search Task",
    icon: "mdi-magnify",
    methodName: "showSearchBox",
    color: "primary",
  },
  {
    title: "Delete All",
    icon: "mdi-delete",
    methodName: "deleteAll",
    color: "red",
  },
  {
    title: "Update",
    icon: "mdi-check",
    methodName: "updateOrder",
    color: "green",
  },
  {
    title: "Cancel",
    icon: "mdi-close",
    methodName: "toggleRearrange",
    color: "red",
  },
];

export { menuOptions, headerOptions, navigationoptions };
