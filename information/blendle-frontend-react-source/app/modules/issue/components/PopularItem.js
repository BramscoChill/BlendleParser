/* eslint-disable react/prefer-es6-class */
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ManifestPopoverContainer from 'containers/ManifestPopoverContainer';
import PopoverElementMixin from 'components/mixins/PopoverElementMixin';
import DebouncedPopoverElementMixin from 'components/mixins/DebouncedPopoverElementMixin';
import { getManifestBody, getTitle, getContentAsText } from 'helpers/manifest';
import { isMobile } from 'instances/browser_environment';
import Link from 'components/Link';

const PopularItem = createReactClass({
  displayName: 'PopularItem',

  propTypes: {
    disabled: PropTypes.bool,
    item: PropTypes.object,
  },

  mixins: [PureRenderMixin, PopoverElementMixin, DebouncedPopoverElementMixin],

  render() {
    const manifest = this.props.item._embedded.manifest;
    const manifestBody = getManifestBody(manifest);
    let title = getContentAsText(getTitle(manifestBody));

    if (title.length > 90) {
      title = `${title.substring(0, 90)}...`;
    }

    let popover;

    if (this.state.popover && !this.props.disabled && !isMobile()) {
      popover = (
        <ManifestPopoverContainer
          from={'popular-in-issue'}
          key={this.props.item.id}
          itemId={this.props.item.id}
          x={this.state.x}
          y={this.state.y}
          onClose={this.closePopover}
          onMouseEnter={this.enterPopover}
          onMouseLeave={this.leavePopover}
        />
      );
    }

    return (
      <li
        className="v-popular-item"
        onMouseEnter={this.debouncedEnterElement}
        onMouseMove={this.debouncedMoveElement}
        onMouseLeave={this.debouncedLeaveElement}
      >
        <Link
          className="popular-item-link"
          href={`/item/${this.props.item.id}`}
          dangerouslySetInnerHTML={{ __html: title }}
          analytics={{ type: 'popular-in-issue' }}
        />
        {popover}
      </li>
    );
  },
});

export default PopularItem;



// WEBPACK FOOTER //
// ./src/js/app/modules/issue/components/PopularItem.js