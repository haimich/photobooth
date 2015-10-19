(function() {
  var abs, exports, hsl2rgb, rgb2hsLuma, rgb2hsl, sign;

  if (typeof module === 'object') {
    exports = module.exports;
  } else {
    exports = window;
  }

  /*
  Parameters:
    input      the input canvas to estract chromakey background
    hueKey     the hue base value (on HSL colorspace), to remove a pixel
    hueDelta1  the hue base value distance to remove a pixel
    hueDelta2  the hue base value distance to reduce the pixel alpha
    hueDelta3  the hue base value distance to adjust the pixel hue
    maxLight   the maximum light to consider the pixel removal
    minLight   the minimal light to consider the pixel removal
    minSatur   the minimal saturation to consider the pixel removal
   */

  exports.ChromaKey2Alpha = (function() {
    function ChromaKey2Alpha(config) {
      var dMode, j, len, ref;
      if (config == null) {
        config = {};
      }
      this.input = config.input;
      this.hueKey = config.hueKey || 120;
      this.hueDelta1 = config.hueDelta1 || 30;
      this.hueDelta2 = config.hueDelta2 || 60;
      this.hueDelta3 = config.hueDelta3 || 70;
      this.maxLight = config.maxLight || 0.8;
      this.minLight = config.minLight || 0.2;
      this.minSatur = config.minSatur || 0.2;
      this.debugMode = null;
      if (config.debug === 'HUE_CORRECTION') {
        this.debugMode = 'HUE_CORRECTION';
        this.rotateNearHueKey = this.rotateNearHueKeyDebug;
      }
      ref = 'NO_HUE_CORRECTION HUE_TEST_ONLY LIGHT_TEST_ONLY DARK_TEST_ONLY GRAY_TEST_ONLY'.split(' ');
      for (j = 0, len = ref.length; j < len; j++) {
        dMode = ref[j];
        if (config.debug === dMode) {
          this.debugMode = dMode;
        }
      }
      if (this.debugMode) {
        console.log("Debug mode is " + this.debugMode + ".");
      }
    }

    ChromaKey2Alpha.prototype.removeChromaKey = function() {
      var a, b, ctx, g, h, i, img, j, l, len, r, ref, ref1, ref2, s;
      ctx = this.input.getContext('2d');
      img = ctx.getImageData(0, 0, this.input.width, this.input.height);
      ref = img.data;
      for (i = j = 0, len = ref.length; j < len; i = j += 4) {
        r = ref[i];
        r = r / 255;
        g = img.data[i + 1] / 255;
        b = img.data[i + 2] / 255;
        ref1 = rgb2hsl(r, g, b), h = ref1[0], s = ref1[1], l = ref1[2];
        a = this.removeInvalidPx(h, s, l) === 0 ? 0 : Math.max(this.alphaNearHueKey(h, s, l), this.alphaNearHueless(h, s, l));
        if (this.debugMode) {
          if (this.debugMode === 'HUE_TEST_ONLY') {
            a = this.alphaNearHueKey(h, s, l);
          }
          if (this.debugMode === 'LIGHT_TEST_ONLY') {
            a = this.alphaNearLight(h, s, l);
          }
          if (this.debugMode === 'DARK_TEST_ONLY') {
            a = this.alphaNearDark(h, s, l);
          }
          if (this.debugMode === 'GRAY_TEST_ONLY') {
            a = this.alphaNearGray(h, s, l);
          }
        }
        if (this.debugMode !== 'NO_HUE_CORRECTION') {
          h = this.rotateNearHueKey(h, s, l);
        }
        ref2 = hsl2rgb(h, s, l), r = ref2[0], g = ref2[1], b = ref2[2];
        img.data[i + 0] = r * 255;
        img.data[i + 1] = g * 255;
        img.data[i + 2] = b * 255;
        img.data[i + 3] = a * 255;
      }
      return ctx.putImageData(img, 0, 0);
    };

    ChromaKey2Alpha.prototype.validPx = function(h, s, l) {
      return abs(h - this.hueKey) > this.hueDelta1 || l > this.maxLight || l < this.minLight || s < this.minSatur;
    };

    ChromaKey2Alpha.prototype.invalidPx2alpha = function(h, s, l) {
      return abs(h - this.hueKey) < this.hueDelta2 && l < this.maxLight && l > this.minLight;
    };

    ChromaKey2Alpha.prototype.nearHueKey = function(h, s, l) {
      return abs(h - this.hueKey) < this.hueDelta3;
    };

    ChromaKey2Alpha.prototype.removeInvalidPx = function(h, s, l) {
      if (this.validPx(h, s, l)) {
        return 1;
      } else {
        return 0;
      }
    };

    ChromaKey2Alpha.prototype.alphaNearHueKey = function(h, s, l) {
      return (abs(h - this.hueKey) - this.hueDelta1) / (this.hueDelta2 - this.hueDelta1);
    };

    ChromaKey2Alpha.prototype.alphaNearDark = function(h, s, l) {
      if (l < this.minLight) {
        return (abs(h - this.hueKey) / this.hueDelta2) + (1 - l / this.minLight) * 2;
      } else {
        return 0;
      }
    };

    ChromaKey2Alpha.prototype.alphaNearLight = function(h, s, l) {
      if (l > this.maxLight) {
        return (abs(h - this.hueKey) / this.hueDelta2) + (1 - (1 - l) / (1 - this.maxLight)) * 2;
      } else {
        return 0;
      }
    };

    ChromaKey2Alpha.prototype.alphaNearGray = function(h, s, l) {
      if (s < this.minSatur) {
        return (abs(h - this.hueKey) / this.hueDelta2) + (1 - s / this.minSatur) * 2;
      } else {
        return 0;
      }
    };

    ChromaKey2Alpha.prototype.alphaNearHueless = function(h, s, l) {
      var grayAlpha;
      grayAlpha = this.alphaNearGray(h, s, l);
      if (grayAlpha === 1) {
        return grayAlpha;
      } else {
        return Math.max(this.alphaNearDark(h, s, l), this.alphaNearLight(h, s, l), grayAlpha);
      }
    };

    ChromaKey2Alpha.prototype.keyDist = function(h, s, l) {
      var d;
      d = (h - this.hueKey) / this.hueDelta3;
      return sign(d) * (1 - abs(d));
    };

    ChromaKey2Alpha.prototype.curveKeyDist = function(h, s, l) {
      var d;
      d = this.keyDist(h, s, l);
      return sign(d) * d * d;
    };

    ChromaKey2Alpha.prototype.rotateNearHueKey = function(h, s, l) {
      if (this.nearHueKey(h, s, l)) {
        return h + (this.hueDelta3 * this.curveKeyDist(h, s, l));
      } else {
        return h;
      }
    };

    ChromaKey2Alpha.prototype.rotateNearHueKeyDebug = function(h, s, l) {
      if (this.nearHueKey(h, s, l)) {
        return 0;
      } else {
        return 180;
      }
    };

    return ChromaKey2Alpha;

  })();

  abs = Math.abs;

  sign = Math.sign || function(n) {
    if (n < 0) {
      return -1;
    } else {
      return 1;
    }
  };

  exports.rgb2hsl = rgb2hsl = function(r, g, b) {
    var c, h, hi, l, max, min, s;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    c = max - min;
    hi = 0;
    if (c !== 0) {
      if (max === r) {
        hi = (g - b) / c % 6;
      }
      if (max === g) {
        hi = (b - r) / c + 2;
      }
      if (max === b) {
        hi = (r - g) / c + 4;
      }
    }
    h = hi * 60;
    if (h < 0) {
      h = 360 + h;
    }
    l = (max + min) / 2;
    s = l === 0 || l === 1 ? 0 : c / (1 - abs(2 * l - 1));
    return [h, s, l];
  };

  exports.rgb2hsLuma = rgb2hsLuma = function(r, g, b) {
    var luma;
    return luma = 0.30 * r + 0.59 * g + 0.11 * b;
  };

  exports.hsl2rgb = hsl2rgb = function(h, s, l) {
    var b, c, g, hi, m, r, x;
    c = (1 - abs(2 * l - 1)) * s;
    hi = h / 60;
    x = c * (1 - abs(hi % 2 - 1));
    if (hi < 1) {
      r = c;
      g = x;
      b = 0;
    } else if (hi < 2) {
      r = x;
      g = c;
      b = 0;
    } else if (hi < 3) {
      r = 0;
      g = c;
      b = x;
    } else if (hi < 4) {
      r = 0;
      g = x;
      b = c;
    } else if (hi < 5) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }
    m = l - c / 2;
    return [r + m, g + m, b + m];
  };

}).call(this);
