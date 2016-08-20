import * as React from "react";

interface LinkProps {
  active: boolean;
  children: any; // node
  onClick: () => void;
}

class Link extends React.PureComponent<LinkProps, void> {
  render() {
    if (this.props.active) {
      return <span>{this.props.children}</span>;
    } else {
      return (
        <a href="#"
          onClick={e => {
            e.preventDefault();
            this.props.onClick();
          } }
          >
          {this.props.children}
        </a>
      );
    }
  }
}

export default Link;
