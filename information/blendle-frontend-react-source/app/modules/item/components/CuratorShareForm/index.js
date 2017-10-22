import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'instances/i18n';
import { TextArea, CharLimit, Columns, TextInput } from '@blendle/lego';
import ChannelSelect from './ChannelSelect';
import SelectedChannel from './SelectedChannel';
import PublicationDay from './PublicationDay';
import CSS from './style.scss';

class CuratorShareForm extends PureComponent {
  static propTypes = {
    channels: PropTypes.arrayOf(PropTypes.object).isRequired,
    userId: PropTypes.string.isRequired,
    onDateChange: PropTypes.func.isRequired,
    onChannelChange: PropTypes.func.isRequired,
    onTimeChange: PropTypes.func.isRequired,
    onMessageChange: PropTypes.func.isRequired,
    message: PropTypes.string,
    shareDates: PublicationDay.propTypes.shareDates,
    analytics: PropTypes.object,
    selectedChannel: PropTypes.object,
    selectedDate: PropTypes.string,
    selectedTime: PropTypes.string,
  };

  _renderPublicationMoment() {
    if (this.props.selectedChannel === this.props.user) {
      return null;
    }

    const { onDateChange, shareDates, selectedDate, selectedTime, onTimeChange } = this.props;

    return (
      <Columns className={CSS.publicationMoment}>
        <PublicationDay
          className={CSS.publicationDay}
          onDateChange={onDateChange}
          shareDates={shareDates}
          date={selectedDate}
        />
        <div className={CSS.timeWrapper}>
          <span className={CSS.timeNotice}>{translate('item.share.time.label')}</span>
          <TextInput
            value={selectedTime}
            onChange={onTimeChange}
            disabled={selectedDate === 'now'}
            className={CSS.publicationTime}
            labelClassName={CSS.timeLabel}
            placeholder="12:00"
            type="time"
          />
        </div>
      </Columns>
    );
  }

  render() {
    const {
      userId,
      selectedChannel,
      onMessageChange,
      message,
      channels,
      onChannelChange,
    } = this.props;

    return (
      <form
        name="curator-share-form"
        className={CSS.container}
        data-test-identifier="curator-share"
      >
        <h2 className={CSS.title}>
          {`${translate('item.titles.share')} `}
          <SelectedChannel userId={userId} channel={selectedChannel} />
        </h2>
        <div className={CSS.message}>
          <TextArea
            name="curator-message"
            onChange={onMessageChange}
            value={message}
            className={CSS.textArea}
            labelClassName={CSS.textAreaLabel}
            placeholder={translate('item.inputs.share')}
          />
          <CharLimit limit={140} length={message.length} className={CSS.charLimit} />
        </div>
        <ChannelSelect
          channels={channels}
          userId={userId}
          selectedChannel={selectedChannel}
          onChannelChange={onChannelChange}
        />
        {this._renderPublicationMoment()}
      </form>
    );
  }
}

export default CuratorShareForm;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/CuratorShareForm/index.js