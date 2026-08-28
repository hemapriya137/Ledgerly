"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function FloatingAmbientNode({
  position,
  scale = 1,
  color = "#10b981",
  geometryType = "octahedron",
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
  geometryType?: "octahedron" | "tetrahedron" | "dodecahedron" | "icosahedron";
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometryType === "octahedron" && <octahedronGeometry args={[1, 0]} />}
        {geometryType === "tetrahedron" && <tetrahedronGeometry args={[1, 0]} />}
        {geometryType === "dodecahedron" && <dodecahedronGeometry args={[1, 0]} />}
        {geometryType === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.22}
          roughness={0.2}
          metalness={0.5}
          transmission={0.6}
          ior={1.4}
          wireframe={Math.random() > 0.5}
        />
      </mesh>
    </Float>
  );
}

function AmbientScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[-10, 10, 5]} intensity={1.5} color="#10b981" />
      <pointLight position={[10, -10, 5]} intensity={1.5} color="#f59e0b" />

      {/* Subtle nodes scattered across viewport */}
      <FloatingAmbientNode position={[-7, 4, -4]} scale={1.2} color="#10b981" geometryType="octahedron" />
      <FloatingAmbientNode position={[8, -3, -5]} scale={1.5} color="#f59e0b" geometryType="icosahedron" />
      <FloatingAmbientNode position={[-5, -4, -3]} scale={0.9} color="#34d399" geometryType="dodecahedron" />
      <FloatingAmbientNode position={[6, 5, -6]} scale={1.3} color="#d97706" geometryType="tetrahedron" />
      <FloatingAmbientNode position={[0, -6, -4]} scale={1.1} color="#059669" geometryType="octahedron" />
    </>
  );
}

export function AmbientCanvas3D() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        dpr={[1, 1]}
      >
        <AmbientScene />
      </Canvas>
    </div>
  );
}
export default AmbientCanvas3D;
