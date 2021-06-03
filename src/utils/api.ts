import axios, { AxiosResponse } from "axios";

const BASE_URL = "https://vue-practice-68b47-default-rtdb.firebaseio.com/";

const getTodoList = (userId: string | null): Promise<AxiosResponse> => {
  return axios.get(`${BASE_URL}${userId}.json`);
};

const updateTodoList = (
  todoData: any,
  userId: string | null
): Promise<AxiosResponse> => {
  return axios.put(`${BASE_URL}${userId}.json`, todoData);
};

export { getTodoList, updateTodoList };
