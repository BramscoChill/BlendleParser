module.exports = (function () {
  // Libraries
  const Backbone = require('backbone');
  const ByeBye = require('byebye');
  const Q = require('q');
  const keyCode = require('app-constants').keyCode;

  // Templates
  const fileUploadTemplate = require('templates/elements/fileupload');

  const FileUploadView = ByeBye.View.extend({
    className: 'v-file-upload',
    events: {
      'dragover .upload-dropzone': '_eDropzoneDragover',
      'dragleave .upload-dropzone': '_eDropzoneDragleave',
      'drop .upload-dropzone': '_eDropzoneDrop',
    },

    /**
     * Initialize FileUpload view
     *
     * @option {name} The name of the field
     * @option {autoUpload} Should upload automatically on change / drop (default false)
     * @option {url} The url to post the file to
     * @option {currentImage} The url to the current image
     * @option {maxFileSize} Max file size in bytes (default 4194304 (4MB))
     * @option {onDragStateChanged} Triggered when the dragging state is changed
     * @option {onUploadChanged} Triggered when the file to upload is changed
     * @option {onUploadStart} Triggered when the upload starts
     * @option {onUploadSuccess} Triggered on a successful upload
     * @option {onUploadFailed} Triggered if something went wrong with the upload
     * @option {handleDropzoneClick} Should the fileupload view attach an event listener to the dropzone?
     */
    initialize() {
      this.options.maxFileSize = this.options.maxFileSize || 4 * 1024 * 1024;
    },

    render() {
      this.el.innerHTML = fileUploadTemplate({
        name: this.options.name,
        currentImage: this.options.currentImage,
      });

      this.dom.inputFile = this.el.querySelector('.inp-file');
      this.dom.previewImage = this.el.querySelector('.img-preview');
      this.dom.dropZone = this.el.querySelector('.upload-dropzone');

      if (this.options.currentImage) {
        this.dom.previewImage.src = this.options.currentImage;
      }

      this.addEventListener(this.dom.inputFile, 'change', this._eFileChanged.bind(this));

      if (this.options.handleDropzoneClick) {
        this.addEventListener(this.dom.dropZone, 'click', this._eDropzoneClick.bind(this));
      }

      this.display();

      return this;
    },

    /**
     * Checks if this view has an upload ready to submit
     *
     * @return bool hasUpload
     */
    hasUpload() {
      return !!this._file;
    },

    /**
     * Upload the file ready for submission
     *
     * @return deferred || false
     */
    upload() {
      if (this.hasUpload()) {
        return this._uploadImage(this._file).then(
          this._uploadSuccess.bind(this),
          this._uploadFailed.bind(this),
        );
      }
    },

    /**
     * Reset the current file upload and put back the image from before the upload.
     */
    reset() {
      if (this._uploadRequest && this._uploadRequest.abort) {
        this._uploadRequest.abort();
      }

      this._file = null;

      if (this.options.currentImage) {
        this.dom.previewImage.src = this.options.currentImage;
      } else {
        this.dom.previewImage.src = '';
      }
    },

    /**
     * Set the url where file upload will upload the file to
     *
     * @param {url} The url
     */
    setUrl(url) {
      this.options.url = url;
    },

    /**
     * Set the current image to display
     *
     * @param {url} The image url
     */
    setCurrentImage(url) {
      this.options.currentImage = url;
    },

    /**
     * Set the callback which is triggered on upload success
     *
     * @param {callback} The callback to call
     */
    setOnUploadSuccess(callback) {
      this.options.onUploadSuccess = callback;
    },

    /**
     * Set the callback which is triggered on upload failure
     *
     * @param {callback} The callback to call
     */
    setOnUploadFailed(callback) {
      this.options.onUploadFailed = callback;
    },

    /**
     * Open a file dialog so the user can select a file
     */
    openFileDialog() {
      const self = this;

      this.dom.inputFile.click();

      if (this.options.onFileDialogOpen) {
        this.options.onFileDialogOpen();

        // Listen to escape once
        this.addEventListener(window, 'keyup', (e) => {
          if (!e.ctrlKey && e.keyCode === keyCode.ESC) {
            if (self.options.onFileDialogClose) {
              self.options.onFileDialogClose();
            }
          }
        });
      }
    },

    _uploadSuccess() {
      if (this.options.onUploadSuccess) {
        this.options.onUploadSuccess();
      }
    },

    _uploadFailed() {
      if (this.options.onUploadFailed) {
        this.options.onUploadFailed(this._error);
      }
    },

    _eDropzoneClick(e) {
      e.preventDefault();

      this.openFileDialog();
    },

    _eDropzoneDragover(e) {
      e.preventDefault();
      e.stopPropagation();

      if (this.options.onDragStateChanged) {
        this.options.onDragStateChanged(true);
      }
    },

    _eDropzoneDragleave() {
      if (this.options.onDragStateChanged) {
        this.options.onDragStateChanged(false);
      }
    },

    _eFileChanged() {
      this._processAndStoreOrUpload(this.dom.inputFile.files);

      if (this.options.onFileDialogClose) {
        this.options.onFileDialogClose();
      }
    },

    _eDropzoneDrop(e) {
      e.preventDefault();
      e.stopPropagation();

      this._processAndStoreOrUpload(e.dataTransfer.files);
    },

    _processAndStoreOrUpload(files) {
      const file = this._processFiles(files);

      if (!file) {
        return this._uploadFailed();
      }

      // Render a local preview
      this._renderLocalPreview(file);

      if (this.options.autoUpload) {
        this._uploadImage(file).then(this._uploadSuccess.bind(this), this._uploadFailed.bind(this));
      } else {
        this._file = file;
      }

      if (this.options.onUploadChanged) {
        this.options.onUploadChanged();
      }
    },

    /**
     * Upload the first image from the given image array
     * The image array is taken from the file input field or from the dataTransfer by drop
     *
     * @param {file} the file
     * @returns promise
     */
    _uploadImage(file) {
      const self = this,
        defer = Q.defer();

      // Trigger callback
      if (this.options.onUploadStart) {
        this.options.onUploadStart();
      }

      // Prepare the formdata object
      const formData = new FormData();
      formData.append('avatar', file);

      // Post our image to the given url
      this._uploadRequest = Backbone.ajax({
        url: this.options.url,
        type: 'POST',
        data: formData,
        contentType: false, // This needs to be false. ContentType will be set by the browser on upload.
      });

      // Attach the then later, to make sure our abort function stays
      this._uploadRequest.then(
        () => {
          defer.resolve();
        },
        (response) => {
          self._error = {
            type: 'server_error',
            data: response.data,
            statusCode: response.status,
          };
          defer.reject(new Error('Unable to upload image'));
        },
      );

      return defer.promise;
    },

    /**
     * Process an array of files and return a validated image or null. This function will set the _error
     * variable with the error state if there is something wrong with the passed files array.
     *
     * @param {files} The array which should contain exactly one file
     * @return The file to upload later
     */
    _processFiles(files) {
      // Do we have exactly one image?
      if (files.length !== 1) {
        return false;
      }

      // Save it
      const file = files[0];

      // Check if it has the correct type
      if (!file.type.match('image.*')) {
        this._error = {
          type: 'incorrect_type',
        };
        return false;
      }

      if (file.size > this.options.maxFileSize) {
        this._error = {
          type: 'file_size',
        };
        return false;
      }

      this._error = null;

      return file;
    },

    /**
     * Render a local preview from the image given
     *
     * @param {image} File object to render
     */
    _renderLocalPreview(image) {
      const self = this,
        reader = new FileReader();

      reader.onload = (function () {
        return function (e) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = function () {
            self._plotImageToCanvas(e.target.result, self.dom.previewImage, {
              originalWidth: this.width,
              originalHeight: this.height,
            });
          };
          img.src = e.target.result;
        };
      }(image));

      reader.readAsDataURL(image);
    },

    _plotImageToCanvas(imageUrl, targetElement, options) {
      const self = this;

      // Get width and height of target preview area
      const computedStyle = window.getComputedStyle(targetElement);

      // Calculate stuff
      let imageWidth = parseInt(computedStyle.getPropertyValue('width'), 10);
      const targetWidth = imageWidth;
      let imageHeight = parseInt(computedStyle.getPropertyValue('height'), 10);
      const targetHeight = imageHeight;
      const originalWidth = options.originalWidth;
      const originalHeight = options.originalHeight;
      let horizontalOffset = 0;
      let verticalOffset = 0;

      // Calculate correct size of the image
      if (originalWidth > originalHeight) {
        imageWidth = Math.floor(originalWidth * (targetHeight / originalHeight));
      } else {
        imageHeight = Math.floor(originalHeight * (targetWidth / originalWidth));
      }

      // Calculate image offset
      if (imageWidth > targetWidth) {
        horizontalOffset = (imageWidth - targetWidth) / 2 * -1;
      }

      if (imageHeight > targetHeight) {
        verticalOffset = (imageHeight - targetHeight) / 2 * -1;
      }

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Create and load image
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = function () {
        self._transformCanvasBasedOnOrientation(canvas, self._findImageOrientation(imageUrl));

        canvas
          .getContext('2d')
          .drawImage(image, horizontalOffset, verticalOffset, imageWidth, imageHeight);

        targetElement.src = canvas.toDataURL();
      };
      image.src = imageUrl;
    },

    _findImageOrientation(imageUrl) {
      // Get the base 64 encoded part of the image
      const base64image = imageUrl.split(',')[1];

      // Create an arraybuffer from the base64 encoded image
      const imageArrayBuffer = base64DecToArr(base64image).buffer;

      // Read EXIF data from file and return the orientation value
      return EXIF.readFromBinaryFile(imageArrayBuffer).Orientation;
    },

    _transformCanvasBasedOnOrientation(canvas, orientation) {
      const context = canvas.getContext('2d'),
        width = canvas.width,
        height = canvas.height;

      switch (orientation) {
        case 2:
          // horizontal flip
          context.translate(width, 0);
          context.scale(-1, 1);
          break;
        case 3:
          // 180° rotate left
          context.translate(width, height);
          context.rotate(Math.PI);
          break;
        case 4:
          // vertical flip
          context.translate(0, height);
          context.scale(1, -1);
          break;
        case 5:
          // vertical flip + 90 rotate right
          context.rotate(0.5 * Math.PI);
          context.scale(1, -1);
          break;
        case 6:
          // 90° rotate right
          context.rotate(0.5 * Math.PI);
          context.translate(0, -height);
          break;
        case 7:
          // horizontal flip + 90 rotate right
          context.rotate(0.5 * Math.PI);
          context.translate(width, -height);
          context.scale(-1, 1);
          break;
        case 8:
          // 90° rotate left
          context.rotate(-0.5 * Math.PI);
          context.translate(-width, 0);
          break;
      }
    },
  });

  function base64DecToArr(sBase64, nBlocksSize) {
    const sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ''),
      nInLen = sB64Enc.length,
      nOutLen = nBlocksSize
        ? Math.ceil(((nInLen * 3 + 1) >> 2) / nBlocksSize) * nBlocksSize
        : (nInLen * 3 + 1) >> 2,
      taBytes = new Uint8Array(nOutLen);

    for (let nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
      nMod4 = nInIdx & 3;
      nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << (18 - 6 * nMod4);
      if (nMod4 === 3 || nInLen - nInIdx === 1) {
        for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
          taBytes[nOutIdx] = (nUint24 >>> ((16 >>> nMod3) & 24)) & 255;
        }
        nUint24 = 0;
      }
    }

    return taBytes;
  }

  function b64ToUint6(nChr) {
    return nChr > 64 && nChr < 91
      ? nChr - 65
      : nChr > 96 && nChr < 123
        ? nChr - 71
        : nChr > 47 && nChr < 58 ? nChr + 4 : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;
  }

  const EXIF = (function () {
    const debug = false;

    const ExifTags = {
      // version tags
      0x9000: 'ExifVersion', // EXIF version
      0xa000: 'FlashpixVersion', // Flashpix format version

      // colorspace tags
      0xa001: 'ColorSpace', // Color space information tag

      // image configuration
      0xa002: 'PixelXDimension', // Valid width of meaningful image
      0xa003: 'PixelYDimension', // Valid height of meaningful image
      0x9101: 'ComponentsConfiguration', // Information about channels
      0x9102: 'CompressedBitsPerPixel', // Compressed bits per pixel

      // user information
      0x927c: 'MakerNote', // Any desired information written by the manufacturer
      0x9286: 'UserComment', // Comments by user

      // related file
      0xa004: 'RelatedSoundFile', // Name of related sound file

      // date and time
      0x9003: 'DateTimeOriginal', // Date and time when the original image was generated
      0x9004: 'DateTimeDigitized', // Date and time when the image was stored digitally
      0x9290: 'SubsecTime', // Fractions of seconds for DateTime
      0x9291: 'SubsecTimeOriginal', // Fractions of seconds for DateTimeOriginal
      0x9292: 'SubsecTimeDigitized', // Fractions of seconds for DateTimeDigitized

      // picture-taking conditions
      0x829a: 'ExposureTime', // Exposure time (in seconds)
      0x829d: 'FNumber', // F number
      0x8822: 'ExposureProgram', // Exposure program
      0x8824: 'SpectralSensitivity', // Spectral sensitivity
      0x8827: 'ISOSpeedRatings', // ISO speed rating
      0x8828: 'OECF', // Optoelectric conversion factor
      0x9201: 'ShutterSpeedValue', // Shutter speed
      0x9202: 'ApertureValue', // Lens aperture
      0x9203: 'BrightnessValue', // Value of brightness
      0x9204: 'ExposureBias', // Exposure bias
      0x9205: 'MaxApertureValue', // Smallest F number of lens
      0x9206: 'SubjectDistance', // Distance to subject in meters
      0x9207: 'MeteringMode', // Metering mode
      0x9208: 'LightSource', // Kind of light source
      0x9209: 'Flash', // Flash status
      0x9214: 'SubjectArea', // Location and area of main subject
      0x920a: 'FocalLength', // Focal length of the lens in mm
      0xa20b: 'FlashEnergy', // Strobe energy in BCPS
      0xa20c: 'SpatialFrequencyResponse', //
      0xa20e: 'FocalPlaneXResolution', // Number of pixels in width direction per FocalPlaneResolutionUnit
      0xa20f: 'FocalPlaneYResolution', // Number of pixels in height direction per FocalPlaneResolutionUnit
      0xa210: 'FocalPlaneResolutionUnit', // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
      0xa214: 'SubjectLocation', // Location of subject in image
      0xa215: 'ExposureIndex', // Exposure index selected on camera
      0xa217: 'SensingMethod', // Image sensor type
      0xa300: 'FileSource', // Image source (3 === DSC)
      0xa301: 'SceneType', // Scene type (1 === directly photographed)
      0xa302: 'CFAPattern', // Color filter array geometric pattern
      0xa401: 'CustomRendered', // Special processing
      0xa402: 'ExposureMode', // Exposure mode
      0xa403: 'WhiteBalance', // 1 = auto white balance, 2 = manual
      0xa404: 'DigitalZoomRation', // Digital zoom ratio
      0xa405: 'FocalLengthIn35mmFilm', // Equivalent foacl length assuming 35mm film camera (in mm)
      0xa406: 'SceneCaptureType', // Type of scene
      0xa407: 'GainControl', // Degree of overall image gain adjustment
      0xa408: 'Contrast', // Direction of contrast processing applied by camera
      0xa409: 'Saturation', // Direction of saturation processing applied by camera
      0xa40a: 'Sharpness', // Direction of sharpness processing applied by camera
      0xa40b: 'DeviceSettingDescription', //
      0xa40c: 'SubjectDistanceRange', // Distance to subject

      // other tags
      0xa005: 'InteroperabilityIFDPointer',
      0xa420: 'ImageUniqueID', // Identifier assigned uniquely to each image
    };

    const TiffTags = {
      0x0100: 'ImageWidth',
      0x0101: 'ImageHeight',
      0x8769: 'ExifIFDPointer',
      0x8825: 'GPSInfoIFDPointer',
      0xa005: 'InteroperabilityIFDPointer',
      0x0102: 'BitsPerSample',
      0x0103: 'Compression',
      0x0106: 'PhotometricInterpretation',
      0x0112: 'Orientation',
      0x0115: 'SamplesPerPixel',
      0x011c: 'PlanarConfiguration',
      0x0212: 'YCbCrSubSampling',
      0x0213: 'YCbCrPositioning',
      0x011a: 'XResolution',
      0x011b: 'YResolution',
      0x0128: 'ResolutionUnit',
      0x0111: 'StripOffsets',
      0x0116: 'RowsPerStrip',
      0x0117: 'StripByteCounts',
      0x0201: 'JPEGInterchangeFormat',
      0x0202: 'JPEGInterchangeFormatLength',
      0x012d: 'TransferFunction',
      0x013e: 'WhitePoint',
      0x013f: 'PrimaryChromaticities',
      0x0211: 'YCbCrCoefficients',
      0x0214: 'ReferenceBlackWhite',
      0x0132: 'DateTime',
      0x010e: 'ImageDescription',
      0x010f: 'Make',
      0x0110: 'Model',
      0x0131: 'Software',
      0x013b: 'Artist',
      0x8298: 'Copyright',
    };

    const GPSTags = {
      0x0000: 'GPSVersionID',
      0x0001: 'GPSLatitudeRef',
      0x0002: 'GPSLatitude',
      0x0003: 'GPSLongitudeRef',
      0x0004: 'GPSLongitude',
      0x0005: 'GPSAltitudeRef',
      0x0006: 'GPSAltitude',
      0x0007: 'GPSTimeStamp',
      0x0008: 'GPSSatellites',
      0x0009: 'GPSStatus',
      0x000a: 'GPSMeasureMode',
      0x000b: 'GPSDOP',
      0x000c: 'GPSSpeedRef',
      0x000d: 'GPSSpeed',
      0x000e: 'GPSTrackRef',
      0x000f: 'GPSTrack',
      0x0010: 'GPSImgDirectionRef',
      0x0011: 'GPSImgDirection',
      0x0012: 'GPSMapDatum',
      0x0013: 'GPSDestLatitudeRef',
      0x0014: 'GPSDestLatitude',
      0x0015: 'GPSDestLongitudeRef',
      0x0016: 'GPSDestLongitude',
      0x0017: 'GPSDestBearingRef',
      0x0018: 'GPSDestBearing',
      0x0019: 'GPSDestDistanceRef',
      0x001a: 'GPSDestDistance',
      0x001b: 'GPSProcessingMethod',
      0x001c: 'GPSAreaInformation',
      0x001d: 'GPSDateStamp',
      0x001e: 'GPSDifferential',
    };

    const StringValues = {
      ExposureProgram: {
        0: 'Not defined',
        1: 'Manual',
        2: 'Normal program',
        3: 'Aperture priority',
        4: 'Shutter priority',
        5: 'Creative program',
        6: 'Action program',
        7: 'Portrait mode',
        8: 'Landscape mode',
      },
      MeteringMode: {
        0: 'Unknown',
        1: 'Average',
        2: 'CenterWeightedAverage',
        3: 'Spot',
        4: 'MultiSpot',
        5: 'Pattern',
        6: 'Partial',
        255: 'Other',
      },
      LightSource: {
        0: 'Unknown',
        1: 'Daylight',
        2: 'Fluorescent',
        3: 'Tungsten (incandescent light)',
        4: 'Flash',
        9: 'Fine weather',
        10: 'Cloudy weather',
        11: 'Shade',
        12: 'Daylight fluorescent (D 5700 - 7100K)',
        13: 'Day white fluorescent (N 4600 - 5400K)',
        14: 'Cool white fluorescent (W 3900 - 4500K)',
        15: 'White fluorescent (WW 3200 - 3700K)',
        17: 'Standard light A',
        18: 'Standard light B',
        19: 'Standard light C',
        20: 'D55',
        21: 'D65',
        22: 'D75',
        23: 'D50',
        24: 'ISO studio tungsten',
        255: 'Other',
      },
      Flash: {
        0x0000: 'Flash did not fire',
        0x0001: 'Flash fired',
        0x0005: 'Strobe return light not detected',
        0x0007: 'Strobe return light detected',
        0x0009: 'Flash fired, compulsory flash mode',
        0x000d: 'Flash fired, compulsory flash mode, return light not detected',
        0x000f: 'Flash fired, compulsory flash mode, return light detected',
        0x0010: 'Flash did not fire, compulsory flash mode',
        0x0018: 'Flash did not fire, auto mode',
        0x0019: 'Flash fired, auto mode',
        0x001d: 'Flash fired, auto mode, return light not detected',
        0x001f: 'Flash fired, auto mode, return light detected',
        0x0020: 'No flash function',
        0x0041: 'Flash fired, red-eye reduction mode',
        0x0045: 'Flash fired, red-eye reduction mode, return light not detected',
        0x0047: 'Flash fired, red-eye reduction mode, return light detected',
        0x0049: 'Flash fired, compulsory flash mode, red-eye reduction mode',
        0x004d: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected',
        0x004f: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light detected',
        0x0059: 'Flash fired, auto mode, red-eye reduction mode',
        0x005d: 'Flash fired, auto mode, return light not detected, red-eye reduction mode',
        0x005f: 'Flash fired, auto mode, return light detected, red-eye reduction mode',
      },
      SensingMethod: {
        1: 'Not defined',
        2: 'One-chip color area sensor',
        3: 'Two-chip color area sensor',
        4: 'Three-chip color area sensor',
        5: 'Color sequential area sensor',
        7: 'Trilinear sensor',
        8: 'Color sequential linear sensor',
      },
      SceneCaptureType: {
        0: 'Standard',
        1: 'Landscape',
        2: 'Portrait',
        3: 'Night scene',
      },
      SceneType: {
        1: 'Directly photographed',
      },
      CustomRendered: {
        0: 'Normal process',
        1: 'Custom process',
      },
      WhiteBalance: {
        0: 'Auto white balance',
        1: 'Manual white balance',
      },
      GainControl: {
        0: 'None',
        1: 'Low gain up',
        2: 'High gain up',
        3: 'Low gain down',
        4: 'High gain down',
      },
      Contrast: {
        0: 'Normal',
        1: 'Soft',
        2: 'Hard',
      },
      Saturation: {
        0: 'Normal',
        1: 'Low saturation',
        2: 'High saturation',
      },
      Sharpness: {
        0: 'Normal',
        1: 'Soft',
        2: 'Hard',
      },
      SubjectDistanceRange: {
        0: 'Unknown',
        1: 'Macro',
        2: 'Close view',
        3: 'Distant view',
      },
      FileSource: {
        3: 'DSC',
      },

      Components: {
        0: '',
        1: 'Y',
        2: 'Cb',
        3: 'Cr',
        4: 'R',
        5: 'G',
        6: 'B',
      },
    };

    function imageHasData(img) {
      return !!img.exifdata;
    }

    function findEXIFinJPEG(file) {
      const dataView = new DataView(file);

      if (debug) console.log(`Got file of length ${file.byteLength}`); // jshint ignore:line
      if (dataView.getUint8(0) !== 0xff || dataView.getUint8(1) !== 0xd8) {
        if (debug) console.log('Not a valid JPEG'); // jshint ignore:line
        return false; // not a valid jpeg
      }

      let offset = 2,
        length = file.byteLength,
        marker;

      while (offset < length) {
        if (dataView.getUint8(offset) !== 0xff) {
          if (debug) {
            console.log(
              `Not a valid marker at offset ${offset}, found: ${dataView.getUint8(offset)}`,
            );
          } // jshint ignore:line
          return false; // not a valid marker, something is wrong
        }

        marker = dataView.getUint8(offset + 1);
        if (debug) console.log(marker); // jshint ignore:line

        // we could implement handling for other markers here,
        // but we're only looking for 0xFFE1 for EXIF data

        if (marker === 225) {
          if (debug) console.log('Found 0xFFE1 marker'); // jshint ignore:line

          return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

          // offset += 2 + file.getShortAt(offset+2, true);
        }
        offset += 2 + dataView.getUint16(offset + 2);
      }
    }

    function readTags(file, tiffStart, dirStart, strings, bigEnd) {
      let entries = file.getUint16(dirStart, !bigEnd),
        tags = {},
        entryOffset,
        tag,
        i;

      for (i = 0; i < entries; i++) {
        entryOffset = dirStart + i * 12 + 2;
        tag = strings[file.getUint16(entryOffset, !bigEnd)];
        if (!tag && debug) console.log(`Unknown tag: ${file.getUint16(entryOffset, !bigEnd)}`); // jshint ignore:line
        tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
      }
      return tags;
    }

    function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
      let type = file.getUint16(entryOffset + 2, !bigEnd),
        numValues = file.getUint32(entryOffset + 4, !bigEnd),
        valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart,
        offset,
        vals,
        val,
        n,
        numerator,
        denominator;

      switch (type) {
        case 1: // byte, 8-bit unsigned int
        case 7: // undefined, 8-bit byte, value depending on field
          if (numValues === 1) {
            return file.getUint8(entryOffset + 8, !bigEnd);
          }
          offset = numValues > 4 ? valueOffset : entryOffset + 8;
          vals = [];
          for (n = 0; n < numValues; n++) {
            vals[n] = file.getUint8(offset + n);
          }
          return vals;

          break;

        case 2: // ascii, 8-bit byte
          offset = numValues > 4 ? valueOffset : entryOffset + 8;
          return getStringFromDB(file, offset, numValues - 1);
        case 3: // short, 16 bit int
          if (numValues === 1) {
            return file.getUint16(entryOffset + 8, !bigEnd);
          }
          offset = numValues > 2 ? valueOffset : entryOffset + 8;
          vals = [];
          for (n = 0; n < numValues; n++) {
            vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
          }
          return vals;

          break;
        case 4: // long, 32 bit int
          if (numValues === 1) {
            return file.getUint32(entryOffset + 8, !bigEnd);
          }
          vals = [];
          for (n = 0; n < numValues; n++) {
            vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
          }
          return vals;

          break;
        case 5: // rational = two long values, first is numerator, second is denominator
          if (numValues === 1) {
            numerator = file.getUint32(valueOffset, !bigEnd);
            denominator = file.getUint32(valueOffset + 4, !bigEnd);
            val = Number(numerator / denominator);
            val.numerator = numerator;
            val.denominator = denominator;
            return val;
          }
          vals = [];
          for (n = 0; n < numValues; n++) {
            numerator = file.getUint32(valueOffset + 8 * n, !bigEnd);
            denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
            vals[n] = Number(numerator / denominator);
            vals[n].numerator = numerator;
            vals[n].denominator = denominator;
          }
          return vals;

          break;
        case 9: // slong, 32 bit signed int
          if (numValues === 1) {
            return file.getInt32(entryOffset + 8, !bigEnd);
          }
          vals = [];
          for (n = 0; n < numValues; n++) {
            vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
          }
          return vals;

          break;

        case 10: // signed rational, two slongs, first is numerator, second is denominator
          if (numValues === 1) {
            return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd);
          }
          vals = [];
          for (n = 0; n < numValues; n++) {
            vals[n] =
              file.getInt32(valueOffset + 8 * n, !bigEnd) /
              file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
          }
          return vals;

          break;
      }
    }

    function getStringFromDB(buffer, start, length) {
      let outstr = '';
      for (let n = start; n < start + length; n++) {
        outstr += String.fromCharCode(buffer.getUint8(n));
      }
      return outstr;
    }

    function readEXIFData(file, start) {
      if (getStringFromDB(file, start, 4) !== 'Exif') {
        if (debug) console.log(`Not valid EXIF data! ${getStringFromDB(file, start, 4)}`); // jshint ignore:line
        return false;
      }

      let bigEnd,
        tags,
        tag,
        exifData,
        gpsData,
        tiffOffset = start + 6;

      // test for TIFF validity and endianness
      if (file.getUint16(tiffOffset) === 0x4949) {
        bigEnd = false;
      } else if (file.getUint16(tiffOffset) === 0x4d4d) {
        bigEnd = true;
      } else {
        if (debug) console.log('Not valid TIFF data! (no 0x4949 or 0x4D4D)'); // jshint ignore:line
        return false;
      }

      if (file.getUint16(tiffOffset + 2, !bigEnd) !== 0x002a) {
        if (debug) console.log('Not valid TIFF data! (no 0x002A)'); // jshint ignore:line
        return false;
      }

      const firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);

      if (firstIFDOffset < 0x00000008) {
        if (debug) {
          console.log(
            'Not valid TIFF data! (First offset less than 8)',
            file.getUint32(tiffOffset + 4, !bigEnd),
          );
        } // jshint ignore:line
        return false;
      }

      tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

      if (tags.ExifIFDPointer) {
        exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
        for (tag in exifData) {
          switch (tag) {
            case 'LightSource':
            case 'Flash':
            case 'MeteringMode':
            case 'ExposureProgram':
            case 'SensingMethod':
            case 'SceneCaptureType':
            case 'SceneType':
            case 'CustomRendered':
            case 'WhiteBalance':
            case 'GainControl':
            case 'Contrast':
            case 'Saturation':
            case 'Sharpness':
            case 'SubjectDistanceRange':
            case 'FileSource':
              exifData[tag] = StringValues[tag][exifData[tag]];
              break;

            case 'ExifVersion':
            case 'FlashpixVersion':
              exifData[tag] = String.fromCharCode(
                exifData[tag][0],
                exifData[tag][1],
                exifData[tag][2],
                exifData[tag][3],
              );
              break;

            case 'ComponentsConfiguration':
              exifData[tag] =
                StringValues.Components[exifData[tag][0]] +
                StringValues.Components[exifData[tag][1]] +
                StringValues.Components[exifData[tag][2]] +
                StringValues.Components[exifData[tag][3]];
              break;
          }
          tags[tag] = exifData[tag];
        }
      }

      if (tags.GPSInfoIFDPointer) {
        gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
        for (tag in gpsData) {
          switch (tag) {
            case 'GPSVersionID':
              gpsData[tag] = `${gpsData[tag][0]}.${gpsData[tag][1]}.${gpsData[tag][2]}.${gpsData[
                tag
              ][3]}`;
              break;
          }
          tags[tag] = gpsData[tag];
        }
      }

      return tags;
    }

    function getTag(img, tag) {
      if (!imageHasData(img)) return;
      return img.exifdata[tag];
    }

    function readFromBinaryFile(file) {
      return findEXIFinJPEG(file);
    }

    /* NOT USED
    function getImageData(img, callback) {
      function handleBinaryFile(binFile) {
        var data = findEXIFinJPEG(binFile);
        img.exifdata = data || {};
        if (callback) {
          callback.call(img);
        }
      }

      var fileReader;

      if (img instanceof Image || img instanceof HTMLImageElement) {
        if (/^data\:/i.test(img.src)) { // Data URI
          var arrayBuffer = base64ToArrayBuffer(img.src);
          handleBinaryFile(arrayBuffer);

        } else if (/^blob\:/i.test(img.src)) { // Object URL
          fileReader = new FileReader();
          fileReader.onload = function(e) {
            handleBinaryFile(e.target.result);
          };
          objectURLToBlob(img.src, function (blob) {
            fileReader.readAsArrayBuffer(blob);
          });
        } else {
          var http = new XMLHttpRequest();
          http.onload = function() {
            if (http.status === "200") {
              handleBinaryFile(http.response);
            } else {
              throw "Could not load image";
            }
            http = null;
          };
          http.open("GET", img.src, true);
          http.responseType = "arraybuffer";
          http.send(null);
        }
      } else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
        fileReader = new FileReader();
        fileReader.onload = function(e) {
          if (debug) console.log("Got file of length " + e.target.result.byteLength);
          handleBinaryFile(e.target.result);
        };

        fileReader.readAsArrayBuffer(img);
      }
    }

    function addEvent(element, event, handler) {
      if (element.addEventListener) {
        element.addEventListener(event, handler, false);
      } else if (element.attachEvent) {
        element.attachEvent("on" + event, handler);
      }
    }

    */

    return {
      readFromBinaryFile,
      getTag,

      Tags: ExifTags,
      TiffTags,
      GPSTags,
      StringValues,
    };
  }());

  return FileUploadView;
}());



// WEBPACK FOOTER //
// ./src/js/app/views/helpers/fileupload.js