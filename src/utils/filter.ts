export function filterDate(dueDate: any): any {
  return new Date(dueDate).toString().slice(4, 15);
}
export default { filterDate };
