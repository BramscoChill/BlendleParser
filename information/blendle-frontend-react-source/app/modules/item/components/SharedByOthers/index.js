import React from 'react';
import { pure } from 'recompose';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import HeartIcon from 'components/icons/Heart';
import { translate } from 'instances/i18n';
import UsernameTooltip from 'components/UsernameTooltip';
import CSS from './style.scss';

const Avatar = ({ post }) => {
  const { user } = post;

  return (
    <UsernameTooltip className={CSS.avatarTooltip} username={user.full_name} key={user.uid}>
      <img className={CSS.avatar} src={user.avatar.href} alt={user.full_name} />
    </UsernameTooltip>
  );
};

Avatar.propTypes = {
  post: PropTypes.object.isRequired,
};

const Avatars = ({ className, posts }) => (
  <div className={className}>
    {posts.map(post => <Avatar key={`${post.user.uid}-${post.created_at}`} post={post} />)}
  </div>
);

Avatars.propTypes = {
  className: PropTypes.string,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function getText(totalPosts, visibleAvatars) {
  // Only non-friends have liked this article
  if (visibleAvatars.length === 0) {
    const translationKey =
      totalPosts === 1
        ? 'recommend.single_reader_recommends_this'
        : 'recommend.multiple_readers_recommends_this';

    return translate(translationKey, [totalPosts]);
  }

  // Only friends have liked this article
  if (visibleAvatars.length === totalPosts) {
    const translationKey =
      totalPosts === 1 ? 'recommend.friend_recommended_this' : 'recommend.friends_recommended_this';

    return translate(translationKey);
  }

  // Mix of likes from friends and non-friends
  return translate('recommend.others_recommended_this', [totalPosts - visibleAvatars.length]);
}

const SharedByOthers = ({ totalPostCount, followedUserPosts = [] }) => {
  const visibleAvatars = followedUserPosts.slice(0, 10);
  const hasAvatars = visibleAvatars.length;
  const avatarsClassNames = classNames(CSS.avatars, {
    [CSS.isHidden]: !hasAvatars,
  });

  return (
    <div className={CSS.sharedByOthers}>
      <Avatars className={avatarsClassNames} posts={visibleAvatars} />
      <div className={CSS.text}>
        {!hasAvatars && <HeartIcon className={CSS.heart} />}
        {getText(totalPostCount, visibleAvatars)}
      </div>
    </div>
  );
};
SharedByOthers.propTypes = {
  totalPostCount: PropTypes.number.isRequired,
  followedUserPosts: PropTypes.arrayOf(PropTypes.object),
};

export default pure(SharedByOthers);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/SharedByOthers/index.js