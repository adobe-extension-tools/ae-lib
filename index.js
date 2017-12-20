(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
/// <reference path="./index.d.ts" />
exports.__esModule = true;
require("extendscript-es5-shim-ts/Array/indexOf");
// PROPERTYGROUP
PropertyGroup.prototype.forEach = function (cb) {
    for (var i = this.numProperties; i > 0; i -= 1) {
        cb(this.property(i), i - 1, this);
    }
};
PropertyGroup.prototype.map = function (cb) {
    var results = [];
    for (var i = this.numProperties; i > 0; i -= 1) {
        results.push(cb(this.property(i), i - 1, this));
    }
    return results;
};
PropertyGroup.prototype.filter = function (cb) {
    var results = [];
    for (var i = this.numProperties; i > 0; i -= 1) {
        var property = this.property(i);
        var check = cb(property, i - 1, this);
        if (check) {
            results.push(property);
        }
    }
    return results;
};
PropertyGroup.prototype.toArray = function () {
    return this.map(function (x) { return x; });
};
LayerCollection.prototype.forEach = function (cb) {
    for (var i = this.length; i > 0; i--) {
        cb(this[i], i - 1, this);
    }
};
LayerCollection.prototype.filter = function (cb) {
    var results = [];
    for (var i = this.length; i > 0; i--) {
        var layer = this[i];
        if (cb(layer, i - i, this)) {
            results.push(layer);
        }
    }
    return results;
};
LayerCollection.prototype.map = function (cb) {
    var results = [];
    for (var i = this.length; i > 0; i--) {
        results.push(cb(this[i], i - i, this));
    }
    return results;
};
LayerCollection.prototype.toArray = function () {
    return this.map(function (x) { return x; });
};
var LayerTags;
(function (LayerTags) {
    LayerTags[LayerTags["LAYER_ID"] = -9999] = "LAYER_ID";
})(LayerTags || (LayerTags = {}));
var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function miniId(length) {
    if (length === void 0) { length = 10; }
    var id = '';
    for (var i = 0; i < length; i++) {
        id += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return id;
}
function tag(layer, tag, value) {
    if (value === undefined)
        value = 'true';
    var marker = layer.property('Marker');
    var currentMarker = marker.valueAtTime(tag, true);
    if (currentMarker.comment !== '')
        return currentMarker.comment;
    var markerValue = new MarkerValue(value);
    marker.setValueAtTime(tag, markerValue);
    return value + '';
}
function getTag(layer, tag) {
    var marker = layer.property('Marker');
    var currentMarker = marker.valueAtTime(tag, true);
    return currentMarker.comment;
}
function hasTag(layer, tag) {
    var marker = layer.property('Marker');
    var currentMarker = marker.valueAtTime(tag, true);
    return currentMarker.comment !== '';
}
function toPropertyPath(property, pretty) {
    if (pretty === void 0) { pretty = false; }
    var propertyPath = [];
    while (property) {
        if (property.parentProperty) {
            if (property.parentProperty.propertyType === PropertyType.INDEXED_GROUP || pretty) {
                propertyPath.push(property.name);
            }
            else {
                propertyPath.push(property.matchName);
            }
        }
        property = property.parentProperty;
    }
    return propertyPath.reverse();
}
function getPropertyAtPath(layer, propertyPath) {
    var property = layer;
    var name;
    propertyPath = propertyPath.slice(); // copy the array
    while (name = propertyPath.shift()) {
        if (property) {
            property = property.property(name); // go deeper into the property (if possible)
        }
        else {
            property = null;
            break; // didn't find the property, bail out early
        }
    }
    return property;
}
function serializePropertySelection(layer) {
    return layer.selectedProperties.map(function (selectedProperty) {
        return toPropertyPath(selectedProperty);
    });
}
function serializeSelection() {
    var layerIds = [];
    var propertyPaths = [];
    if (app.project.activeItem
        && app.project.activeItem instanceof CompItem) {
        app.project.activeItem.selectedLayers.forEach(function (selectedLayer) {
            var layerId = miniId();
            layerIds.push(tag(selectedLayer, LayerTags.LAYER_ID, layerId));
            propertyPaths.push(serializePropertySelection(selectedLayer));
        });
    }
    return [layerIds, propertyPaths];
}
function restoreSelection(serializedSelection) {
    if (app.project.activeItem
        && app.project.activeItem instanceof CompItem) {
        var layerIds_1 = serializedSelection[0];
        var propertyPathsForLayer_1 = serializedSelection[1];
        app.project.activeItem.layers.forEach(function (layer, i) {
            var tag = getTag(layer, LayerTags.LAYER_ID);
            if (tag && layerIds_1.indexOf(tag) > -1) {
                layer.selected = true;
                layer.selectedProperties.forEach(function (selectedProperty) {
                    selectedProperty.selected = false;
                });
                var propertyPaths = propertyPathsForLayer_1[i];
                propertyPaths.forEach(function (propertyPath) {
                    var property = getPropertyAtPath(layer, propertyPath);
                    if (property) {
                        property.selected = true;
                    }
                });
            }
            else {
                layer.selected = false;
                layer.selectedProperties.forEach(function (selectedProperty) {
                    selectedProperty.selected = false;
                });
            }
        });
    }
}
function restoreSelectionAfter(cb) {
    var selection = serializeSelection();
    cb();
    restoreSelection(selection);
}
function getLayerForProperty(property) {
    while (property.parentProperty) {
        property = property.parentProperty; // update property for next iteration
    }
    return property;
}
function getUniqueName(collection, prefix) {
    var availableNumber = 0;
    collection.forEach(function (item) {
        if (item.name.indexOf(prefix) > -1) {
            var postfix = item.name.split(prefix)[1];
            var postfixNumber = Number(postfix);
            if (postfixNumber >= availableNumber) {
                availableNumber = postfixNumber + 1;
            }
        }
    });
    return (prefix + (availableNumber === 0 ? '' : availableNumber));
}
$.global.utils = {
    serializeSelection: serializeSelection,
    restoreSelection: restoreSelection,
    restoreSelectionAfter: restoreSelectionAfter,
    tag: tag,
    getTag: getTag,
    hasTag: hasTag,
    toPropertyPath: toPropertyPath,
    getPropertyAtPath: getPropertyAtPath,
    getUniqueName: getUniqueName
};

},{"extendscript-es5-shim-ts/Array/indexOf":2}],2:[function(require,module,exports){
/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Polyfill
*/
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {


    // 1. Let o be the result of calling ToObject passing
    //    the this value as the argument.
    if (this === void 0 || this === null) {
      throw new TypeError('Array.prototype.indexOf called on null or undefined');
    }

    var k;
    var o = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of o with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = o.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of o with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of o with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in o && o[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}
},{}]},{},[1]);
