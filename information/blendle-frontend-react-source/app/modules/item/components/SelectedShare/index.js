import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import SelectedShareTooltip from '../SelectedShareTooltip';
import { isMobileBreakpoint } from 'helpers/viewport';
import ShareToEmailContainer from 'containers/dialogues/ShareToEmailContainer';
import CSS from './style.scss';

function isOneParagraphSelected(range) {
  const { startContainer, endContainer } = range;
  const closestStartParagraph = startContainer.parentElement.closest('p');
  const closestEndParagraph = endContainer.parentElement.closest('p');

  return (
    closestStartParagraph === closestEndParagraph || endContainer.tagName !== undefined // An empty node gets selected when triple clicking
  );
}

class SelectedShare extends PureComponent {
  static propTypes = {
    onSocialShare: PropTypes.func.isRequired,
    selectedItemId: PropTypes.string.isRequired,
    itemScrollY: PropTypes.number.isRequired,
    children: PropTypes.node,
    analytics: PropTypes.object,
  };

  static defaultProps = {
    analytics: {},
  };

  state = {
    tooltipOpen: false,
    tooltipPosition: null,
    selectedText: '',
    shareEmailOpen: false,
  };

  _selectable = null; // Will contain the DOM node in which we listen for selectable text

  componentDidMount() {
    this._debouncedMouseUp = debounce(this._onMouseUp, 250);
    document.addEventListener('mouseup', this._debouncedMouseUp);
  }

  componentWillUnmount() {
    this._debouncedMouseUp.cancel();
    document.removeEventListener('mouseup', this._debouncedMouseUp);
  }

  _onMouseUp = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    const range = selection.rangeCount === 1 ? selection.getRangeAt(0) : null;

    if (
      isMobileBreakpoint() ||
      !range ||
      !this._selectable.contains(selection.anchorNode) ||
      selectedText.length < 1 ||
      !isOneParagraphSelected(range)
    ) {
      this.setState({
        tooltipOpen: false,
      });
      return;
    }

    const rect = range.getBoundingClientRect();
    this.setState({
      tooltipOpen: true,
      tooltipPosition: {
        top: rect.top + this.props.itemScrollY - 50,
        left: rect.left - 70 + rect.width / 2, // 70 is half of the tooltip size
        width: 'auto',
      },
      selectedText,
    });
  };

  _onShareFacebook = () => this.props.onSocialShare('facebook', this.state.selectedText);
  _onShareLinkedIn = () => this.props.onSocialShare('linkedin', this.state.selectedText);
  _onShareTwitter = () => this.props.onSocialShare('twitter', this.state.selectedText);

  _onShareEmail = () => this.setState({ shareEmailOpen: true });
  _onCloseEmail = () => this.setState({ shareEmailOpen: false });

  render() {
    const { selectedItemId, analytics } = this.props;
    const { tooltipOpen, tooltipPosition, selectedText } = this.state;

    return (
      <div
        className={CSS.container}
        ref={c => (this._selectable = c)} // eslint-disable-line no-return-assign
      >
        {this.props.children}
        <SelectedShareTooltip
          open={tooltipOpen}
          position={tooltipPosition}
          onShareFacebook={this._onShareFacebook}
          onShareTwitter={this._onShareTwitter}
          onShareEmail={this._onShareEmail}
          onShareLinkedIn={this._onShareLinkedIn}
        />
        {this.state.shareEmailOpen && (
          <ShareToEmailContainer
            isVisible
            itemId={selectedItemId}
            analytics={analytics}
            defaultMessage={selectedText}
            onClose={this._onCloseEmail}
          />
        )}
      </div>
    );
  }
}

export default SelectedShare;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/SelectedShare/index.js