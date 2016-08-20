import * as Redux from "redux";
import * as Actions from "../actions";

const visibilityFilter = (state = "SHOW_ALL", action: Redux.Action) => {
  if (Actions.isSetVisibilityFilter(action))
    return action.filter;
  else
    return state;
};

export default visibilityFilter;
