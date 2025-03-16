import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeScene = ({ image }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!image) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.enablePan = true;

    // Create a texture from the uploaded image
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(image, () => {
      console.log('Texture loaded successfully');
      animate();
    }, undefined, (err) => {
      console.error('Error loading texture:', err);
    });

    // Create a 3D plane with the image texture
    const geometry = new THREE.PlaneGeometry(5, 5);
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(0, 0, 0); // Center the plane
    scene.add(plane);

    // Position the camera
    camera.position.z = 5;

    // Add lighting (optional)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Required for damping
      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [image]);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }}></div>;
};

export default ThreeScene;