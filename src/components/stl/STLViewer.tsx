'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface STLViewerProps {
  geometry: THREE.BufferGeometry | null;
  className?: string;
}

export default function STLViewer({ geometry, className = '' }: STLViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current || !geometry) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(-1, -0.5, -1);
    scene.add(directionalLight2);

    // Mesh
    const material = new THREE.MeshPhongMaterial({
      color: 0xf97316, // orange-500
      specular: 0x222222,
      shininess: 60,
    });

    const geo = geometry.clone();
    geo.center();
    geo.computeBoundingBox();
    const mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);

    // Fit camera to model
    const bb = geo.boundingBox!;
    const size = new THREE.Vector3();
    bb.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = maxDim / (2 * Math.tan(fov / 2));
    cameraZ *= 1.8;
    camera.position.set(cameraZ * 0.7, cameraZ * 0.5, cameraZ);
    camera.lookAt(0, 0, 0);

    // Grid
    const gridSize = maxDim * 2;
    const gridHelper = new THREE.GridHelper(gridSize, 20, 0xdddddd, 0xeeeeee);
    gridHelper.position.y = bb.min.y;
    scene.add(gridHelper);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    // Animate
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      geo.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [geometry]);

  if (!geometry) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-slate-100 text-slate-400 ${className}`}>
        <p className="text-sm">Upload an STL to see 3D preview</p>
      </div>
    );
  }

  return <div ref={containerRef} className={`rounded-lg overflow-hidden ${className}`} />;
}
