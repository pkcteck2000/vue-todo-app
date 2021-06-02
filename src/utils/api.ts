import axios, { AxiosResponse } from "axios";

const BASE_URL = "https://vue-practice-68b47-default-rtdb.firebaseio.com/";

const getTodoList = (): Promise<AxiosResponse> => {
  return axios.get(`${BASE_URL}premnath-todo.json`);
};

const updateTodoList = (todoData: any): Promise<AxiosResponse> => {
  return axios.put(`${BASE_URL}premnath-todo.json`, todoData);
};

export { getTodoList, updateTodoList };
