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
}

interface Global {
  utils: Utils
}

declare var utils: Utils