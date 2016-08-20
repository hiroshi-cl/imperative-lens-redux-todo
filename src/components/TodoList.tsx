import * as React from "react";
import Todo from "./Todo";
import {TodoItem} from "../entities/TodoItem";

interface TodoProps {
  todos: TodoItem;
  onTodoClick: () => void;
}

const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos.map((todo: TodoItem) =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
);

export default TodoList;
