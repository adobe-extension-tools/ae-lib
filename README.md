# ae-lib

Utility functions and prototype patches for After Effects

What's included:

```ts
interface PropertyGroup {
  forEach: (cb: (property: PropertyBase, index: number, self: PropertyGroup) => void) => void
  map: <T = any>(cb: (property: PropertyBase, index: number, self: PropertyGroup) => T) => T[]
  filter: (cb: (property: PropertyBase, index: number, self: PropertyGroup) => boolean) => PropertyBase[]
  toArray: () => PropertyBase[]
}

interface LayerCollection {
  forEach: (cb: (property: Layer, index: number, self: LayerCollection) => void) => void
  map: <T = any>(cb: (property: Layer, index: number, self: LayerCollection) => T) => T[]
  filter: (cb: (property: Layer, index: number, self: LayerCollection) => boolean) => Layer[]
  toArray: () => Layer[]
}

interface Utils {
  serializeSelection(): string[]
  restoreSelection(serializedSelection: string[]): void
  restoreSelectionAfter(cb: () => void): void
  tag(layer: Layer, tag: number, value: string): void
  getTag(layer: Layer, tag: number): string
  hasTag(layer: Layer, tag: number): boolean
  toPropertyPath(property: PropertyBase, pretty?: boolean): string[]
  getPropertyAtPath(layer: Layer, propertyPath: string[]): PropertyBase | null
  getUniqueName(collection: any, prefix: string): string
}

interface Global {
  utils: Utils
}

declare var utils: Utils
```

More info soon...