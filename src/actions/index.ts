import * as Redux from "redux";

let nextTodoId = 0;

export const addTodo = (text: string) => {
  return {
    type: "ADD_TODO",
    id: nextTodoId++,
    text
  };
};

export type Filters = "SHOW_ALL" | "SHOW_COMPLETED" | "SHOW_ACTIVE";

export const setVisibilityFilter = (filter: Filters) => {
  return {
    type: "SET_VISIBILITY_FILTER",
    filter
  };
};

export interface SetVisibilityFilter extends Redux.Action {
  type: "SET_VISIBILITY_FILTER";
  filter: any;
}

export function isSetVisibilityFilter(action: Redux.Action): action is SetVisibilityFilter {
  if (action.type === "SET_VISIBILITY_FILTER")
    return true;
  else
    return false;
}

export const toggleTodo = (id: number) => {
  return {
    type: "TOGGLE_TODO",
    id
  };
};
