import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Backdrop, DialogBody } from '@blendle/lego';
import CSS from './style.scss';

class PremiumDialogBody extends PureComponent {
  static propTypes = {
    backdropColor: PropTypes.string,
    backdropShapeColor: PropTypes.string,
    backdropShapeClassName: PropTypes.string,
    illustrationSrcSet: PropTypes.string,
    children: PropTypes.node,
  };

  static defaultProps = {
    backdropColor: Backdrop.yellow(),
    backdropShapeColor: Backdrop.green(),
  };

  _renderIllustration() {
    if (!this.props.illustrationSrcSet) {
      return null;
    }

    return (
      <div className={CSS.illustrationWrapper}>
        <img
          role="presentation"
          className={CSS.illustration}
          srcSet={this.props.illustrationSrcSet}
        />
      </div>
    );
  }

  render() {
    const { backdropColor, backdropShapeColor, backdropShapeClassName, children } = this.props;

    return (
      <DialogBody className={CSS.dialogBody}>
        <Backdrop
          className={CSS.backdrop}
          color={backdropColor}
          innerColor={backdropShapeColor}
          innerClassName={backdropShapeClassName}
        />
        {this._renderIllustration()}
        <div
          className={classNames(CSS.content, {
            [CSS.illustrationPadding]: !!this.props.illustrationSrcSet,
          })}
        >
          {children}
        </div>
      </DialogBody>
    );
  }
}

export default PremiumDialogBody;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/PremiumDialogBody/index.js