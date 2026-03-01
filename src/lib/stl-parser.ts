import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import type { STLFileInfo, STLDimensions } from '@/types/stl';

export async function parseSTLFile(file: File): Promise<{
  info: STLFileInfo;
  geometry: THREE.BufferGeometry;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loader = new STLLoader();
        const geometry = loader.parse(event.target!.result as ArrayBuffer);
        geometry.computeBoundingBox();

        const bb = geometry.boundingBox!;
        const dimensions: STLDimensions = {
          x: Math.round((bb.max.x - bb.min.x) * 100) / 100,
          y: Math.round((bb.max.y - bb.min.y) * 100) / 100,
          z: Math.round((bb.max.z - bb.min.z) * 100) / 100,
        };

        const triangleCount = geometry.attributes.position.count / 3;

        resolve({
          info: {
            fileName: file.name,
            fileSize: file.size,
            dimensions,
            triangleCount,
            boundingBox: {
              min: { x: bb.min.x, y: bb.min.y, z: bb.min.z },
              max: { x: bb.max.x, y: bb.max.y, z: bb.max.z },
            },
          },
          geometry,
        });
      } catch {
        reject(new Error('Failed to parse STL file. Ensure it is a valid binary or ASCII STL.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDimensions(d: STLDimensions): string {
  return `${d.x.toFixed(1)} × ${d.y.toFixed(1)} × ${d.z.toFixed(1)} mm`;
}
