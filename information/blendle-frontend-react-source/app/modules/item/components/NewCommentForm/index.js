import React from 'react';
import PropTypes from 'prop-types';
import { onlyUpdateForKeys, setPropTypes, compose } from 'recompose';
import { translate } from 'instances/i18n';
import { Form, Button, CharLimit, TextArea } from '@blendle/lego';
import enhanceClickOutside from 'components/higher-order-components/enhanceClickOutside';
import CSS from './style.scss';

const MAX_CHARS = 140;

const enhance = compose(
  enhanceClickOutside,
  setPropTypes({
    onSubmit: PropTypes.func.isRequired,
    onMessageChanged: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
  }),
  onlyUpdateForKeys(['message']), // every other prop is static
);

const CommentForm = enhance(({ message, onMessageChanged, onSubmit }) => (
  <Form name="blendle-share" className={CSS.form} onSubmit={onSubmit}>
    <TextArea
      labelClassName={CSS.label}
      className={CSS.textArea}
      placeholder={translate('recommend.comment.placeholder')}
      onChange={onMessageChanged}
      value={message}
    />
    <div className={CSS.footer}>
      <Button
        className={CSS.button}
        type="submit"
        disabled={message.length > MAX_CHARS}
        size="small"
      >
        {translate('recommend.comment.submit')}
      </Button>
      <CharLimit limit={MAX_CHARS} length={message.length} className={CSS.charLimit} />
    </div>
    <div className={CSS.arrow} />
  </Form>
));

export default CommentForm;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/NewCommentForm/index.js