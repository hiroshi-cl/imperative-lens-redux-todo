import * as React from "react";

interface TodoProps {
  onClick: (e: Event) => void;
  completed: boolean;
  text: string;
}

class Todo extends React.PureComponent<TodoProps, void> {
  render() {
    return (
      <li
        onClick={(e: Event) => this.props.onClick(e) }
        style={{
          textDecoration: this.props.completed ? "line-through" : "none"
        }}
        >
        {this.props.text}
      </li>
    );
  }
}

export default Todo;
