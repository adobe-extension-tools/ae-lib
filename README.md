# ae-lib

Utility functions and prototype patches for After Effects

What's included:

```ts
// work with a PropertyGroup as if it's an array
interface PropertyGroup {
  forEach: (cb: (property: PropertyBase, index: number, self: PropertyGroup) => void) => void
  map: <T = any>(cb: (property: PropertyBase, index: number, self: PropertyGroup) => T) => T[]
  filter: (cb: (property: PropertyBase, index: number, self: PropertyGroup) => boolean) => PropertyBase[]
  toArray: () => PropertyBase[]
}

// work with a LayerCollection as if it's an array
interface LayerCollection {
  forEach: (cb: (property: Layer, index: number, self: LayerCollection) => void) => void
  map: <T = any>(cb: (property: Layer, index: number, self: LayerCollection) => T) => T[]
  filter: (cb: (property: Layer, index: number, self: LayerCollection) => boolean) => Layer[]
  toArray: () => Layer[]
}

// some utility functions, they will become available on the global "utils" variable
interface Utils {
  // take the current selection and store it in an array
  serializeSelection(): string[]
  // restore the selection by providing the serialized variant provided by the method above
  restoreSelection(serializedSelection: string[]): void
  // add a marker to a layer
  tag(layer: Layer, tag: number, value: string): void
  // retrieve the marker's value on a layer at a given time
  getTag(layer: Layer, tag: number): string
  // check if a layer has a marker at given time
  hasTag(layer: Layer, tag: number): boolean
  // get a unique path for a property, for example: ['ADBE Transform', 'ADBE Rotation']
  toPropertyPath(property: PropertyBase, pretty?: boolean): string[]
  // get a property on a layer by providing a path, see the example of a path above
  getPropertyAtPath(layer: Layer, propertyPath: string[]): PropertyBase | null
  // get a unique name for a layer or property
  getUniqueName(collection: any, prefix: string): string
}

interface Global {
  utils: Utils
}

declare var utils: Utils
```

More info soon...
