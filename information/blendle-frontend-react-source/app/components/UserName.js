import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from './Link';

class UserName extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
  };

  render() {
    const { userId, title, fullName } = this.props;

    return (
      <Link className="v-user-name" href={`/user/${userId}`} title={title}>
        {fullName}
      </Link>
    );
  }
}

export default UserName;



// WEBPACK FOOTER //
// ./src/js/app/components/UserName.js