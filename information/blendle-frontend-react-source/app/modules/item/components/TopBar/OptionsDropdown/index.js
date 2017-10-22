import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, ArrowDownIcon } from '@blendle/lego';
import { removeTrailingSlash } from 'helpers/url';
import Settings from 'controllers/settings';
import classNames from 'classnames';
import formatCurrency from 'helpers/formatcurrency';
import getEditorUrl from 'helpers/getEditorUrl';
import { translate } from 'instances/i18n';
import Link from 'components/Link';
import ItemStats from './ItemStats';
import CSS from './style.scss';
import { editorButtonEnabled } from 'selectors/labExperiments';

const DropdownLink = ({ children, className, ...props }) => (
  <Link className={classNames(CSS.dropdownItem, className)} {...props}>
    {children}
  </Link>
);

const DropdownButton = ({ children, className, ...props }) => (
  <button className={classNames(CSS.dropdownItem, className)} {...props}>
    {children}
  </button>
);
DropdownLink.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
DropdownButton.propTypes = DropdownLink.propTypes;

class OptionsDropdown extends PureComponent {
  static propTypes = {
    onClickPocket: PropTypes.func.isRequired,
    onClickIssue: PropTypes.func.isRequired,
    refundable: PropTypes.bool.isRequired,
    itemPrice: PropTypes.number.isRequired,
    providerId: PropTypes.string.isRequired,
    issueId: PropTypes.string.isRequired,
    itemId: PropTypes.string.isRequired,
    analytics: PropTypes.object,
  };

  static defaultProps = {
    analytics: {},
    refundable: false,
    open: false,
  };

  _renderTriggerButton = isOpen => (
    <button className={classNames(CSS.toggleButton, { [CSS.open]: isOpen })}>
      <ArrowDownIcon className={CSS.arrow} />
    </button>
  );

  render() {
    const {
      refundable,
      itemPrice,
      onClickPocket,
      providerId,
      issueId,
      itemId,
      date,
      itemLength,
      onClickIssue,
      onPrint,
    } = this.props;

    return (
      <Dropdown
        triggerButton={this._renderTriggerButton}
        className={CSS.dropdownOptions}
        align="right"
        closeOnItemClicked
      >
        <DropdownButton onClick={onClickPocket} className={CSS.lnkPocket}>
          {translate('item.navigation.pocket')}
        </DropdownButton>
        {refundable && (
          <DropdownLink
            href={`${removeTrailingSlash(window.location.pathname)}/refund`}
            className={CSS.lnkRefund}
            onClick={onClickIssue}
          >
            {translate('item.navigation.refund', formatCurrency(itemPrice))}
          </DropdownLink>
        )}
        {editorButtonEnabled() && (
          <DropdownLink className={CSS.lnkEditor} href={getEditorUrl(itemId)} target="_blank">
            Article Editor
          </DropdownLink>
        )}
        <DropdownButton className={CSS.lnkPrint} onClick={onPrint}>
          {translate('item.navigation.print')}
        </DropdownButton>
        {!Settings.embedded && (
          <DropdownLink
            href={`/issue/${providerId}/${issueId}`}
            className={CSS.lnkIssue}
            onClick={onClickIssue}
          >
            {translate('item.navigation.issue')}
          </DropdownLink>
        )}
        <ItemStats itemLength={itemLength} date={date} />
      </Dropdown>
    );
  }
}

export default OptionsDropdown;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/TopBar/OptionsDropdown/index.js