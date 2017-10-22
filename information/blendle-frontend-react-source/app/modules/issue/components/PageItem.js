import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import ManifestPopoverContainer from 'containers/ManifestPopoverContainer';
import PopoverElementMixin from 'components/mixins/PopoverElementMixin';
import DebouncedPopoverElementMixin from 'components/mixins/DebouncedPopoverElementMixin';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';
import Region from 'modules/issue/components/Region';
import { isMobile } from 'instances/browser_environment';

const PageItem = createReactClass({
  displayName: 'PageItem',

  propTypes: {
    itemId: PropTypes.string.isRequired,
    regions: PropTypes.array.isRequired,
  },

  mixins: [PureRenderMixin, PopoverElementMixin, DebouncedPopoverElementMixin],

  getInitialState() {
    return {
      active: false,
    };
  },

  componentDidMount() {
    this.determinePopover({
      inElement: false,
      inPopover: false,
    });
  },

  componentWillUnmount() {
    clearTimeout(this._timeoutOpen);
    clearTimeout(this._timeoutClose);
  },

  setActive(active) {
    this.setState({
      active,
      popover: active,
    });
  },

  onPopoverOpen() {
    this._timeoutOpen = setTimeout(() => this.setActive(true));
  },

  onPopoverClose() {
    this._timeoutClose = setTimeout(() => this.setActive(false));
  },

  render() {
    const { itemId } = this.props;

    const className = classNames({
      'v-page-item': true,
      's-active': this.state.active,
    });

    const regions = this.props.regions.map((region, i) => (
      <Region
        key={`${itemId}-${i}`}
        region={region}
        active={this.state.active}
        onClick={event => this.onElementClick(event, !isMobile())}
        onMouseEnter={this.debouncedEnterElement}
        onMouseMove={this.debouncedMoveElement}
        onMouseLeave={this.debouncedLeaveElement}
        url={`/item/${itemId}`}
      />
    ));

    let popover;

    if (this.state.popover && !isMobile()) {
      popover = (
        <ManifestPopoverContainer
          from={'page'}
          itemId={itemId}
          x={this.state.x}
          y={this.state.y}
          onClose={this.closePopover}
          onMouseEnter={this.enterPopover}
          onMouseLeave={this.leavePopover}
        />
      );
    }

    return (
      <div className={className}>
        {regions}
        {popover}
      </div>
    );
  },
});

export default PageItem;



// WEBPACK FOOTER //
// ./src/js/app/modules/issue/components/PageItem.js