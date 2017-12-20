/// <reference path="./index.d.ts" />

import 'extendscript-es5-shim-ts/Array/indexOf'

// PROPERTYGROUP

PropertyGroup.prototype.forEach = function (cb) {
  for (var i = this.numProperties; i > 0; i -= 1) {
    cb(this.property(i), i - 1, this)
  }
}

PropertyGroup.prototype.map = function (cb) {
  const results = []
  for (var i = this.numProperties; i > 0; i -= 1) {
    results.push(cb(this.property(i), i - 1, this))
  }
  return results
}

PropertyGroup.prototype.filter = function (cb) {
  const results = []
  for (var i = this.numProperties; i > 0; i -= 1) {
    const property = this.property(i)
    const check = cb(property, i - 1, this)
    if (check) {
      results.push(property)
    }
  }
  return results
}

PropertyGroup.prototype.toArray = function () {
  return this.map(x => x)
}

LayerCollection.prototype.forEach = function (cb) {
  for (var i = this.length; i > 0; i--) {
    cb(this[i], i - 1, this)
  }
}

LayerCollection.prototype.filter = function (cb) {
  const results = []
  for (var i = this.length; i > 0; i--) {
    const layer = this[i]
    if (cb(layer, i - i, this)) {
      results.push(layer)
    }
  }
  return results
}

LayerCollection.prototype.map = function (cb) {
  const results = []
  for (var i = this.length; i > 0; i--) {
    results.push(cb(this[i], i - i, this))
  }
  return results
}

LayerCollection.prototype.toArray = function () {
  return this.map(x => x)
}

enum LayerTags {
  LAYER_ID = 1 - 10000
}

var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function miniId(length: number = 10) {
  let id = ''
  for (var i = 0; i < length; i++) {
    id += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length))
  }
  return id
}

function tag(layer: Layer, tag: number, value: string) {
  if (value === undefined) value = 'true'
  var marker = layer.property('Marker') as Property
  var currentMarker = marker.valueAtTime(tag, true) as MarkerValue
  if (currentMarker.comment !== '') return currentMarker.comment
  var markerValue = new MarkerValue(value)
  marker.setValueAtTime(tag, markerValue)
  return value + ''
}

function getTag(layer: Layer, tag: number) {
  var marker = layer.property('Marker') as Property
  var currentMarker = marker.valueAtTime(tag, true) as MarkerValue
  return currentMarker.comment
}

function hasTag(layer: Layer, tag: number) {
  var marker = layer.property('Marker') as Property
  var currentMarker = marker.valueAtTime(tag, true) as MarkerValue
  return currentMarker.comment !== ''
}

function toPropertyPath(property: PropertyBase, pretty = false): string[] {
  const propertyPath = []
  while (property) {
    if (property.parentProperty) {
      if (property.parentProperty.propertyType === PropertyType.INDEXED_GROUP || pretty) {
        propertyPath.push(property.name)
      } else {
        propertyPath.push(property.matchName)
      }
    }
    property = property.parentProperty
  }
  return propertyPath.reverse()
}

function getPropertyAtPath(layer: Layer, propertyPath: string[]): PropertyBase | null {
  let property: any = layer
  let name
  propertyPath = propertyPath.slice() // copy the array
  while (name = propertyPath.shift()) { // keep grabbing propertyPath segments until there are none left
    if (property) {
      property = property.property(name) // go deeper into the property (if possible)
    } else {
      property = null
      break // didn't find the property, bail out early
    }
  }
  return property as PropertyBase | null
}

function serializePropertySelection(layer: Layer): string[][] {
  return layer.selectedProperties.map(selectedProperty => {
    return toPropertyPath(selectedProperty)
  })
}

type Selection = [string[], string[][][]]

function serializeSelection(): Selection {
  const layerIds: string[] = []
  const propertyPaths: string[][][] = []
  if (
    app.project.activeItem
    && app.project.activeItem instanceof CompItem
  ) {
    app.project.activeItem.selectedLayers.forEach(selectedLayer => {
      const layerId = miniId()
      layerIds.push(tag(selectedLayer, LayerTags.LAYER_ID, layerId))
      propertyPaths.push(serializePropertySelection(selectedLayer))
    })
  }
  return [layerIds, propertyPaths]
}

function restoreSelection(serializedSelection: Selection): void {
  if (
    app.project.activeItem
    && app.project.activeItem instanceof CompItem
  ) {
    const layerIds = serializedSelection[0]
    const propertyPathsForLayer = serializedSelection[1]
    app.project.activeItem.layers.forEach((layer, i) => {
      const tag = getTag(layer, LayerTags.LAYER_ID)
      if (tag && layerIds.indexOf(tag) > -1) {
        layer.selected = true
        layer.selectedProperties.forEach(selectedProperty => {
          selectedProperty.selected = false
        })
        const propertyPaths = propertyPathsForLayer[i]
        propertyPaths.forEach(propertyPath => {
          const property = getPropertyAtPath(layer, propertyPath)
          if (property) {
            property.selected = true
          }
        })
      } else {
        layer.selected = false
        layer.selectedProperties.forEach(selectedProperty => {
          selectedProperty.selected = false
        })
      }
    })
  }
}

function restoreSelectionAfter(cb: () => void): void {
  const selection = serializeSelection()
  cb()
  restoreSelection(selection)
}

function getLayerForProperty(property: PropertyBase) {
  while (property.parentProperty) { // keep running if a parent property is available
    property = property.parentProperty // update property for next iteration
  }
  return property
}

function getUniqueName(collection: any, prefix: string) {
  let availableNumber = 0
  collection.forEach((item: any) => {
    if (item.name.indexOf(prefix) > -1) {
      const postfix = item.name.split(prefix)[1]
      const postfixNumber = Number(postfix)
      if (postfixNumber >= availableNumber) {
        availableNumber = postfixNumber + 1
      }
    }
  })
  return (prefix + (availableNumber === 0 ? '' : availableNumber))
}

$.global.utils = {
  serializeSelection,
  restoreSelection,
  restoreSelectionAfter,
  tag,
  getTag,
  hasTag,
  toPropertyPath,
  getPropertyAtPath,
  getUniqueName
}