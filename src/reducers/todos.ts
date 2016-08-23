import * as Redux from "redux";
import {TodoItem} from "../entities/TodoItem";
import * as Lens from "../lenses";

const completedLens = new Lens.Lens<TodoItem, boolean>(
  (todoItem) => todoItem.completed,
  (TodoItem) => (completed) => Object.assign({}, TodoItem, { completed })
);

const todo = (state: TodoItem, action: Redux.Action & TodoItem) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case "TOGGLE_TODO":
      if (state.id !== action.id) {
        return state;
      }

      const lv = Lens.lensed(state);
      Lens.over(lv.$.completed)(completed => !completed);
      return lv.view();

    default:
      return state;
  }
};

const todos = (state: TodoItem[] = [], action: Redux.Action & TodoItem) => {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
        todo(undefined, action)
      ];
    case "TOGGLE_TODO":
      return state.map(t =>
        todo(t, action)
      );
    default:
      return state;
  }
};

export default todos;
