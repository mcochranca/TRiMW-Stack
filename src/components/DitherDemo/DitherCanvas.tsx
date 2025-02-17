'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { DitherController } from '@/core/DitherController';
import { useSceneStore } from '@/store/sceneStore';
import { v4 as uuidv4 } from 'uuid';

function DitherObject({ id, position, rotation }: { 
  id: string; 
  position: [number, number, number]; 
  rotation: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ditherController = useRef<DitherController>(new DitherController());
  const updateObject = useSceneStore(state => state.updateObject);

  useFrame(() => {
    if (meshRef.current) {
      const position: [number, number, number] = [
        meshRef.current.position.x,
        meshRef.current.position.y,
        meshRef.current.position.z
      ];
      const rotation: [number, number, number] = [
        meshRef.current.rotation.x,
        meshRef.current.rotation.y,
        meshRef.current.rotation.z
      ];
      updateObject(id, { position, rotation });
    }
  });

  return (
    <TransformControls>
      <mesh ref={meshRef} position={position} rotation={rotation}>
        <planeGeometry args={[2, 2]} />
        {ditherController.current.getMaterial() && (
          <primitive object={ditherController.current.getMaterial()} />
        )}
      </mesh>
    </TransformControls>
  );
}

function Scene() {
  const sceneObjects = useSceneStore(state => state.sceneObjects);
  const addObject = useSceneStore(state => state.addObject);

  const handleAddObject = () => {
    addObject({
      id: uuidv4(),
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    });
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {sceneObjects.map(obj => (
        <DitherObject key={obj.id} {...obj} />
      ))}
      <OrbitControls />
    </>
  );
}

export default function DitherCanvas() {
  const initCollaboration = useSceneStore(state => state.initCollaboration);

  useEffect(() => {
    initCollaboration('trimw-demo-room');
  }, [initCollaboration]);

  return (
    <div className="w-full h-[500px]">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}