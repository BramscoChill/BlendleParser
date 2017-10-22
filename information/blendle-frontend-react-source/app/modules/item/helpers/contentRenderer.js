import React, { cloneElement } from 'react';
import ImageGridContainer from '../containers/ImageGridContainer';
import YoutubeVideo from 'modules/item/components/YoutubeVideo';
import ItemImage from '../components/ItemImage';
import Streamer from '../components/Streamer';
import classNames from 'classnames';
import { sanitize } from 'dompurify';

function imageVisitor(fragment, index) {
  return <ItemImage key={fragment.type + index} fragment={fragment} />;
}

function imageGridVisitor(fragment, index) {
  return <ImageGridContainer key={fragment.type + index} node={fragment.content} />;
}

function youtubeVideoVisitor(fragment, index) {
  const video = fragment._embedded.original;
  return <YoutubeVideo key={fragment.type + index} video={video} />;
}

function streamerVisitor(fragment, index) {
  return <Streamer key={index}>{fragment.content}</Streamer>;
}

const templateMapper = new Map();

templateMapper.set('kicker', <p className="item-kicker" />);
templateMapper.set('head', <h1 className="item-title" />);
templateMapper.set('hl1', <h1 className="item-title" />);
templateMapper.set('hl2', <h2 className="item-subtitle" />);
templateMapper.set('lead', <p className="item-lead" />);
templateMapper.set('byline', <p className="item-byline" />);
templateMapper.set('dateline', <p className="item-dateline" />);
templateMapper.set('intro', <p className="item-intro" />);
templateMapper.set('ph', <h3 className="item-header" />);
templateMapper.set('p', <p className="item-paragraph" />);
templateMapper.set('streamer', streamerVisitor);
templateMapper.set('image-meta', <div className="item-image-meta" />);
templateMapper.set('default', <p className="item-default" />);
templateMapper.set('image', imageVisitor);
templateMapper.set('image-grid', imageGridVisitor);
templateMapper.set('youtube-video', youtubeVideoVisitor);

function getMetadataClassNames(metadata) {
  // New publications use an array of strings, instead of a single string
  if (Array.isArray(metadata)) {
    return metadata.join(' ');
  }

  return metadata;
}

const render = contentBody =>
  contentBody.filter(({ type }) => !!templateMapper.get(type)).map((fragment, fragmentIndex) => {
    const template = templateMapper.get(fragment.type);

    if (typeof template === 'function') {
      return template(fragment, fragmentIndex);
    }

    return (
      <div
        key={`${fragment.type}-${fragmentIndex}`}
        className={`element-wrapper item-wrapper-${fragment.type}`}
      >
        {cloneElement(template, {
          className: classNames(template.props.className, getMetadataClassNames(fragment.metadata)),
          dangerouslySetInnerHTML: { __html: sanitize(fragment.content) },
        })}
      </div>
    );
  });

export default render;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/helpers/contentRenderer.js