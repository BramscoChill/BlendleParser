import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers, pure } from 'recompose';
import { isMobile } from 'instances/browser_environment';
import CheckIcon from 'components/icons/Check';
import classNames from 'classnames';
import { ToolTip } from '@blendle/lego';
import { providerById, prefillSelector } from 'selectors/providers';
import Image from 'components/Image';
import CSS from './SelectableIssue.scss';

const PublisherNameToolTip = ({ open, providerName }) => (
  <ToolTip
    open={open}
    position={{
      width: 'auto',
      top: -43,
      left: 0,
      right: 0,
    }}
  >
    {providerName}
  </ToolTip>
);
PublisherNameToolTip.propTypes = {
  providerName: PropTypes.string.isRequired,
  open: PropTypes.bool,
};

const enhance = compose(
  withState('isToolTipVisible', 'setToolTipVisiblity', false),
  withState('mousePosition', 'setMousePosition', {}),
  withHandlers({
    showToolTip: props => () => props.setToolTipVisiblity(true),
    hideToolTip: props => () => props.setToolTipVisiblity(false),
  }),
  pure,
);

const SelectableIssue = enhance(
  ({
    onChange,
    selected,
    providerId,
    image,
    width,
    height,
    showToolTip,
    hideToolTip,
    isToolTipVisible,
  }) => {
    const providerName = prefillSelector(providerById)(providerId).name;

    // Don't add mouse events on mobile, as they'll get called before the onClick event of the inner
    // button (which then requires a second tap to get called.)
    return (
      <div
        style={{ width, height }}
        className={CSS.container}
        aria-label={providerName}
        data-test-identifier="publication-container"
        onMouseEnter={!isMobile() && showToolTip}
        onMouseLeave={!isMobile() && hideToolTip}
      >
        <PublisherNameToolTip open={isToolTipVisible} providerName={providerName} />
        <Image
          alt={providerName}
          src={image}
          width={width}
          height={height}
          className={CSS.image}
          animate
        />
        <input
          type="checkbox"
          onChange={onChange}
          className={CSS.checkbox}
          checked={selected}
          title={providerName}
        />
        <button
          onClick={onChange}
          className={classNames(CSS.overlay, { [CSS.overlaySelected]: selected })}
        >
          <CheckIcon className={classNames(CSS.checkIcon, { [CSS.checkIconSelected]: selected })} />
        </button>
      </div>
    );
  },
);

SelectableIssue.propTypes = {
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  providerId: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default SelectableIssue;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/SelectableIssue/index.js