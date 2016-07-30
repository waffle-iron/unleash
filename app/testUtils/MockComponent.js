import React, { Component, PropTypes } from 'react';

class MockComponent extends Component {
  render() {
    return (
        <div {...this.props}>{this.props.children}</div>
    );
  }
}

MockComponent.propTypes = {
  children: PropTypes.node
};

export default MockComponent;
