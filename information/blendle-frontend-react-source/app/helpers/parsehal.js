module.exports = (function () {
  function merge(obj1, obj2) {
    const returnObj = {};

    for (const attr1 in obj1) {
      returnObj[attr1] = obj1[attr1];
    }

    for (const attr2 in obj2) {
      returnObj[attr2] = obj2[attr2];
    }

    return returnObj;
  }

  function parseHal(data, modelMap) {
    let parsedData = {};

    if (!modelMap) {
      modelMap = {};
    }

    for (const key in data) {
      switch (key) {
        case '_embedded':
          parsedData = merge(parsedData, parseEmbedded(data[key], modelMap));

          break;
        case '_links':
          parsedData = merge(parsedData, parseLinks(data[key], modelMap));

          break;
        default:
          if (!parsedData[key]) {
            parsedData[key] = mapModel(key, data[key], modelMap);
          }
      }
    }

    return parsedData;
  }

  function parseEmbedded(data, modelMap) {
    const parsedData = {};

    for (const key in data) {
      parsedData[key] = mapModel(key, data[key], modelMap);
    }

    return parsedData;
  }

  function parseLinks(data, modelMap) {
    const parsedData = {};

    parsedData.links = data;

    // Check for link references in model map, if exists as link reference,
    // match is to the current links. If model found, create new model with
    // url set.
    for (const lk in data) {
      const link = data[lk];

      for (const key in modelMap) {
        if (modelMap[key].link === lk) {
          const options = {};
          const attributes = {};

          if (modelMap[key].id) {
            attributes.id = modelMap[key].id;
          }

          if (modelMap[key].track) {
            options.track = modelMap[key].track;
          }

          parsedData[key] = new modelMap[key].model(attributes, options);
          parsedData[key].url = link.href;
        }
      }
    }

    return parsedData;
  }

  function mapModel(key, data, modelMap) {
    let parsedData;

    // Loop through embedded models
    for (const modelName in modelMap) {
      let options = { parse: true };

      if (modelMap[modelName].track) {
        options.track = true;
      }

      // Plural mapping
      if (key === `${modelName}s`) {
        // Create new array to map the models to
        parsedData = [];

        // For each value in array, add new model to parseData array
        for (const i in data) {
          // Create new model

          parsedData.push(new modelMap[modelName].model(data[i], options));
        }
      }

      // Singular mapping
      if (key === modelName) {
        // Create new model
        parsedData = new modelMap[modelName].model(data, options);
      }

      options = null;
    }

    if (!parsedData) {
      parsedData = data;
    }

    return parsedData;
  }

  return parseHal;
}());



// WEBPACK FOOTER //
// ./src/js/app/helpers/parsehal.js