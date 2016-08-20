import * as Redux from "redux";
import * as ReactRedux from "react-redux";
import { setVisibilityFilter } from "../actions";
import Link from "../components/Link";

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>, ownProps: any) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter));
    }
  };
};

const FilterLink = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Link);

export default FilterLink;
