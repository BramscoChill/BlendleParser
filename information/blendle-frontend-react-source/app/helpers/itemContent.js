import { difference, flatten, flowRight as compose, curry } from 'lodash';
import { getImageForWidth } from 'helpers/optimalImage';
import { smartCropImageGrids } from 'helpers/smartCrop';
import { providerTemplate, prefillSelector } from 'selectors/providers';
import { getYoutubeVideos, getImages } from 'selectors/content';
import ImageGrid from 'imagegrid';
import { appendCreditsToGridNode } from 'helpers/imageGridCredits';

const MIN_IMAGE_SIZE_PX = 300;

/* eslint-disable no-use-before-define */
const availablePositionsVisitors = {
  image: getImagePositions,
  streamer: getStreamerPositions,
  'image-grid': getImageGridPositions,
  default: getImageGridPositions,
};
/* eslint-enable no-use-before-define */

const objectKeyIsValue = curry((key, value, obj) => obj[key] === value);
const isType = objectKeyIsValue('type');
const isParagraph = isType('p');
const isParagraphHeader = isType('ph');
const isImage = isType('image');
const isStreamer = isType('streamer');
function imageHasMinimalSize(image, minSize) {
  return image.width > minSize && image.height > minSize;
}

const getElementPosition = element => element.position || element.elementIndex;

/**
 * Convert a provider template string to array of template elements
 * @param  {String} template Template string
 * @return {Array}           Template elements
 */
function getTemplateElements(template) {
  return template.split(' ').map(element => element.substring(1, element.length - 1));
}

/**
 * Get content elements by type
 * @param  {Array}  elements  Content elements
 * @return {divideElements~inner}
 */
function getElementsOfType(elements) {
  /**
   * @param  {String} type Element type
   * @return {Array}       Elements matching the provided type
   */
  return function inner(type) {
    return elements.filter(isType(type));
  };
}

/**
 * Evenly divide elements to place among the available positions
 * @param  {Number} availablePositions Number of available positions
 * @param  {Number} toPlace            Number of elements that should be placed
 * @return {Object} Object containing the stepSize and startIndex
 */
function divideElements(availablePositions, toPlace) {
  // When we have exactly enough positions, we shouldn't to the calculations
  if (availablePositions === toPlace) {
    return {
      stepSize: 0,
      startIndex: 0,
    };
  }

  const optimalStepSize = Math.floor(availablePositions / toPlace);
  const stepSize = Math.min(optimalStepSize, availablePositions - 1);
  const startIndex = Math.floor((availablePositions - stepSize) / toPlace);

  return {
    stepSize,
    startIndex,
  };
}

/**
 * Get the elementIndexes on which images can be placed
 * @param  {Array} itemElements Content elements
 * @return {Array}              Array of elementIndexes
 */
function getImagePositions(itemElements) {
  return itemElements
    .filter((itemElement, i) => {
      const oneBefore = itemElements[i - 1];
      const oneBeforeIsParagraph = oneBefore && isParagraph(oneBefore);

      return oneBeforeIsParagraph && !isImage(itemElement) && !isStreamer(itemElement);
    })
    .map(getElementPosition);
}

/**
 * Get the elementIndexes on which streamers can be placed
 * @param  {Array} itemElements Content elements
 * @return {Array}              Array of elementIndexes
 */
function getStreamerPositions(itemElements) {
  return itemElements
    .filter((itemElement, i) => {
      const twoBeforeElement = itemElements[i - 2];
      const twoBeforeElementIsParagraph = twoBeforeElement && isParagraph(twoBeforeElement);
      const oneBeforeElement = itemElements[i - 1];
      const oneBeforeElementIsParagraph = oneBeforeElement && isParagraph(oneBeforeElement);

      return twoBeforeElementIsParagraph && oneBeforeElementIsParagraph && isParagraph(itemElement);
    })
    .map(getElementPosition);
}

/**
 * Get the elementIndexes on which imageGrids can be placed
 * @param  {Array} itemElements Content elements
 * @return {Array}              Array of elementIndexes
 */
function getImageGridPositions(itemElements) {
  return itemElements
    .filter((itemElement, i) => {
      const oneBeforeElement = itemElements[i - 1];
      return oneBeforeElement && isParagraph(oneBeforeElement);
    })
    .map(getElementPosition);
}

/**
 * Add alignment data to an image. We align every 3rd element to the right
 * @param  {Object} image Image
 * @param  {Number} index Image index (nth image)
 * @return {Object}       Image with alignment data
 */
function addImageAlignmentData(image, index) {
  // Align every third image to the right
  const metadata = image.metadata || [];
  if ((index + 1) % 3 === 0) {
    metadata.push('align-right');
  }

  return {
    ...image,
    metadata,
  };
}

/**
 * Determine if we should use an imageGrid for the article based on the image to content ratio
 * @param  {Array} itemElements Content elements
 * @param  {Array} images       Array of images
 * @return {Boolean}            True if we should use an image
 */
function shouldUseImageGrids(itemElements, images) {
  const imageToContentRatio = images.length / itemElements.length;

  return imageToContentRatio > 0.25;
}

/**
 * Convert and array of images to an array of image grids
 * @param  {Array}  images          Array of images (objects)
 * @param  {Number}  containerWidth Container width
 * @param  {Boolean} useSmartCrop   Should images in grid be smartCropped
 * @return {Array}                  Array of image grids
 */
function convertImagesToGrids(images, containerWidth, useSmartCrop) {
  const gridImages = images.map(image => getImageForWidth(image, containerWidth));

  const columns = 2;
  const rows = 2;

  const grids = ImageGrid.create(gridImages, columns, rows, containerWidth / columns);
  if (useSmartCrop) {
    smartCropImageGrids(grids, containerWidth / columns, images);
  }

  return ImageGrid.toHTML(grids, containerWidth / columns).map((element, index) => {
    appendCreditsToGridNode(grids[index], element, gridImages);

    // convert px dimensions to percentages
    const width = parseInt(element.style.width, 10);
    const height = parseInt(element.style.height, 10);

    // aspect ratio sizing is done with the small css trick that uses paddingBottom
    Object.assign(element.style, {
      width: '',
      height: '',
      paddingBottom: `${100 * (height / width)}%`,
    });

    return element;
  });
}

/**
 * Set item elements based the provider template string
 * @param  {String} itemTemplate    Provider template string
 * @return {sortItemContent~inner}
 */
function sortItemContent(itemTemplate) {
  const templateElements = getTemplateElements(itemTemplate);

  /**
   * @param  {Array}  itemElements  Content elements
   * @return {Array}                Sorted item elements
   */
  return function inner(itemElements) {
    const elementsOfType = getElementsOfType(itemElements);

    let remainingValues = itemElements;
    let contentIndex = templateElements.length;

    // Place content elements based on the template elements
    const sortedItemElements = templateElements.reduce((content, elementType) => {
      // Set aside the content for now. We'll fill it with all remaining value
      if (elementType === 'content') {
        contentIndex = content.length;
        return content;
      }

      const elementValues = elementsOfType(elementType);
      remainingValues = difference(remainingValues, elementValues);

      return [...content, ...elementValues];
    }, []);

    // Insert remaining values on the place of the item content
    sortedItemElements.splice(contentIndex, 0, remainingValues);

    return flatten(sortedItemElements);
  };
}

/**
 * Add elementIndexes to the item elements so they get locked after the initial sorting.
 * @param  {Array}  elements Content elements
 * @return {Array}           Sorted item elements
 */
function addElementIndexes(elements) {
  return elements.reduce(
    (allElements, element) => [
      ...allElements,
      {
        ...element,
        elementIndex: allElements.length,
      },
    ],
    [],
  );
}

/**
 * Place position elements in an item
 * @param  {Array}  positionedElements Array of elements with a `position` key
 * @return {placePositionedElements~inner}
 */
function placePositionedElements(positionedElements) {
  /**
   * @param  {Array}  itemElements  Content elements with `elementIndex` keys
   * @return {Array}                Content elements including positioned elements
   */
  return function inner(itemElements) {
    return itemElements.reduce((placedItemElements, contentElement, i) => {
      // Get elements that should be placed before this element
      const elementsToPlace = positionedElements.filter(
        ({ position }) => position === contentElement.elementIndex,
      );

      if (elementsToPlace.length) {
        // Place the element like we normally would and append the placement elements that should
        // be placed
        return [...placedItemElements, ...elementsToPlace, contentElement];
      }

      // Append the elements which are placed at the end of the content
      if (i === itemElements.length - 1) {
        const outOfBoundsElements = positionedElements.filter(
          ({ position }) => position >= itemElements.length,
        );

        return [...placedItemElements, contentElement, ...outOfBoundsElements];
      }

      return [...placedItemElements, contentElement];
    }, []);
  };
}

/**
 * Place unpositioned elements in an item
 * @param  {Array}  positionedElements  Array of elements without a `position` key
 * @param  {String} type                Element type
 * @return {placeUnpositionedElements~inner}
 */
function placeUnpositionedElements(unpositionedElements, type) {
  /**
   * @param  {Array}  itemElements  Content elements with `elementIndex` keys
   * @return {Array}                Content elements including unpositioned elements
   */
  return function inner(itemElements) {
    const visitor = availablePositionsVisitors[type] || availablePositionsVisitors.default;
    const availablePositions = visitor(itemElements);

    // Take as much elements as fit
    const positionableElements = unpositionedElements.slice(0, availablePositions.length);

    const { startIndex, stepSize } = divideElements(
      availablePositions.length,
      positionableElements.length,
    );

    // Add positions to unpositioned elements
    const positionedElements = positionableElements.map((element, i) => {
      const spot = stepSize * i + startIndex;

      return {
        ...element,
        type,
        position: availablePositions[spot],
      };
    });

    return placePositionedElements(positionedElements)(itemElements);
  };
}

/**
 * Get the elementIndex on which a featured image should be placed
 * @param  {Array} itemElements Content elements
 */
function getFeaturedImagePosition(itemElements) {
  const p = itemElements.find(isParagraph);
  const ph = itemElements.find(isParagraphHeader);

  const pIndex = p ? p.elementIndex : itemElements.length;
  const phIndex = ph ? ph.elementIndex : itemElements.length;

  return Math.min(pIndex, phIndex);
}

function placeFeaturedImage(featuredImage) {
  return function inner(itemElements) {
    if (featuredImage) {
      return placePositionedElements([
        {
          ...featuredImage,
          type: 'image',
          position: getFeaturedImagePosition(itemElements),
        },
      ])(itemElements);
    }

    return itemElements;
  };
}

/**
 * Place unpositioned images. When there are too many images, they will be converted into imageGrids
 * @param  {Array}   unpositionedImages  Array of unpositioned images
 * @param  {Array}   contentBody         Initial item content, used to see if we should use a grid
 * @param  {Number}  containerWidth      Used in the calculations for the image grid
 * @param  {Boolean} useSmartCrop        Smart crop unpositioned images
 * @param  {Boolean} imageGridEnabled    Is the image grid enabled for when we have too many images?
 * @return {placeUnpositionedImages~inner}
 */
function placeUnpositionedImages(
  unpositionedImages,
  contentBody,
  containerWidth,
  useSmartCrop,
  imageGridEnabled,
) {
  /**
   * @param  {Array}  itemElements  Content elements with `elementIndex` keys
   * @return {Array}                Content elements including unpositioned images
   */
  return function inner(itemElements) {
    // When there are too many images, put them in a grid
    if (imageGridEnabled && shouldUseImageGrids(contentBody, unpositionedImages)) {
      const grids = convertImagesToGrids(
        unpositionedImages,
        containerWidth,
        useSmartCrop,
      ).map(grid => ({
        type: 'image-grid',
        content: grid,
      }));

      return placeUnpositionedElements(grids, 'image-grid')(itemElements);
    }

    if (!unpositionedImages.length) {
      return itemElements;
    }

    return placeUnpositionedElements(unpositionedImages, 'image')(itemElements);
  };
}

/**
 * Sort and place the content of an item
 * @param  {Object} data Item data
 * @return {Array}       Array of correctly sorted item elements including images and streamers
 */
export const placeContent = (data) => {
  const { content, providerId, streamers, containerWidth, useSmartCrop, imageGridEnabled } = data;

  const allImages = getImages(content);

  let featuredImage = null;

  // Filter out images that are too small
  const images = allImages.filter(
    image => image.sizes.original && imageHasMinimalSize(image.sizes.original, MIN_IMAGE_SIZE_PX),
  );

  const featuredImageIndex = images.findIndex(image => !image.position || image.featured);
  if (featuredImageIndex > -1) {
    featuredImage = images.splice(featuredImageIndex, 1)[0];
  }

  const positionedImages = images.filter(image => image.position !== undefined);
  const unpositionedImages = images
    .filter(image => image.position === undefined)
    .map((image, i) => addImageAlignmentData(image, i));

  const positionedStreamers = streamers.filter(steamer => steamer.position !== undefined);
  const unpositionedStreamers = streamers.filter(streamer => streamer.position === undefined);

  const youtubeVideos = getYoutubeVideos(content);
  const positionedYoutubeVideos = youtubeVideos.filter(video => video.position !== undefined);
  const unpositionedYoutubeVideos = youtubeVideos.filter(video => video.position === undefined);

  // Create compose function for item content. Note: this is right-to-left/bottom-to-top!
  const composeItemContent = compose(
    // Add unpositioned streamers
    placeUnpositionedElements(unpositionedStreamers, 'streamer'),
    // Add unpositioned youtube videos
    placeUnpositionedElements(unpositionedYoutubeVideos, 'youtube-video'),
    // Add unpositioned images
    placeUnpositionedImages(
      unpositionedImages,
      content.body,
      containerWidth,
      useSmartCrop,
      imageGridEnabled,
    ),
    // Add positioned streamers
    placePositionedElements(positionedStreamers),
    // Add positioned images
    placePositionedElements(positionedImages),
    // Add positioned Youtube videos
    placePositionedElements(positionedYoutubeVideos),
    // Add featured image
    placeFeaturedImage(featuredImage),
    // Add indexes for future reference
    addElementIndexes,
    // Sort elements based on template
    sortItemContent(prefillSelector(providerTemplate)(providerId, 'item_content')),
  );

  const itemContent = composeItemContent(content.body);
  return itemContent;
};



// WEBPACK FOOTER //
// ./src/js/app/helpers/itemContent.js