import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import InitialVisibilitySensor from 'components/InitialVisibilitySensor';
import CSS from './style.scss';
import classNames from 'classnames';

class Streamer extends PureComponent {
  static PropTypes = { children: PropTypes.string.isRequired };

  state = { visible: false };

  _onChange = () => this.setState({ visible: true });

  render() {
    const classes = classNames('item-streamer', CSS.streamer, {
      [CSS.visible]: this.state.visible,
    });

    return (
      <div className="element-wrapper item-wrapper-streamer">
        <p className={classes}>
          <InitialVisibilitySensor
            onChange={this._onChange}
            delay={200}
            active={!this.state.visible}
            partialVisibility
          >
            <span dangerouslySetInnerHTML={{ __html: this.props.children }} />
          </InitialVisibilitySensor>
        </p>
      </div>
    );
  }
}

export default Streamer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/Streamer/index.js