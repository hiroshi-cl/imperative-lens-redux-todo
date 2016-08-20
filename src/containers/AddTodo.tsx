import * as React from "react";
import * as Redux from "redux";
import * as ReactRedux from "react-redux";
import { addTodo } from "../actions";

class AddTodoContainer extends React.Component<any, void> {
  input: any;

  render() {
    return (
      <div>
        <form onSubmit={e => {
          e.preventDefault();
          if (!this.input.value.trim()) {
            return;
          }
          this.props.dispatch(addTodo(this.input.value));
          this.input.value = "";
        } }>
          <input ref={node => {
            this.input = node;
          } } />
          <button type="submit">
            Add Todo
          </button>
        </form>
      </div>
    );
  }
}

const AddTodo = ReactRedux.connect()(AddTodoContainer);

export default AddTodo;
