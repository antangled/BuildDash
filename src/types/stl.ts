export interface STLDimensions {
  x: number; // mm
  y: number; // mm
  z: number; // mm
}

export interface STLFileInfo {
  fileName: string;
  fileSize: number;
  dimensions: STLDimensions;
  triangleCount: number;
  boundingBox: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  };
}
