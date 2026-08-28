"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Text, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";

// Floating 3D Gold Coin
function GoldCoin({ position, rotationSpeed = 1, scale = 1 }: { position: [number, number, number]; rotationSpeed?: number; scale?: number }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8 * rotationSpeed;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* Coin Outer Rim */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.12, 32]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.95}
          roughness={0.2}
          emissive="#78350f"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Coin Center Emboss */}
      <mesh position={[0, 0, 0.07]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, -0.07]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  );
}

// 3D Glassmorphic Floating Invoice Card
function FloatingInvoiceCard({
  position,
  rotation,
  title,
  amount,
  client,
  status,
  isMain = false,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  amount: string;
  client: string;
  status: string;
  isMain?: boolean;
}) {
  const cardRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cardRef.current) {
      const t = state.clock.elapsedTime;
      // Gentle floating oscillation
      cardRef.current.position.y = position[1] + Math.sin(t * 1.2 + position[0]) * 0.12;
      cardRef.current.rotation.z = rotation[2] + Math.cos(t * 0.8) * 0.03;
    }
  });

  const statusColor = status === "PAID" ? "#10b981" : status === "SENT" ? "#f59e0b" : "#6366f1";

  return (
    <group ref={cardRef} position={position} rotation={rotation}>
      {/* Glass Body */}
      <RoundedBox args={[3.2, 2.0, 0.08]} radius={0.12} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={isMain ? "#0a261c" : "#061812"}
          transparent
          opacity={0.88}
          roughness={0.15}
          metalness={0.1}
          transmission={0.6}
          ior={1.4}
          reflectivity={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* Card Border Glow */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[3.24, 2.04]} />
        <meshBasicMaterial
          color={isMain ? "#34d399" : "#10b981"}
          transparent
          opacity={isMain ? 0.35 : 0.15}
          wireframe
        />
      </mesh>

      {/* Chip / Header Accent */}
      <mesh position={[-1.1, 0.65, 0.06]}>
        <planeGeometry args={[0.5, 0.25]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Top Invoice Tag */}
      <mesh position={[1.0, 0.65, 0.06]}>
        <planeGeometry args={[0.7, 0.25]} />
        <meshBasicMaterial color={statusColor} transparent opacity={0.85} />
      </mesh>

      {/* Simulated text lines */}
      <mesh position={[-0.3, 0.15, 0.06]}>
        <planeGeometry args={[2.0, 0.08]} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.6} />
      </mesh>
      <mesh position={[-0.5, -0.1, 0.06]}>
        <planeGeometry args={[1.6, 0.08]} />
        <meshBasicMaterial color="#64748b" transparent opacity={0.4} />
      </mesh>

      {/* Main Amount Bar */}
      <mesh position={[-0.6, -0.5, 0.06]}>
        <planeGeometry args={[1.4, 0.2]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

// Floating Low-Poly Geometric Accents
function FloatingCrystal({ position, scale = 1, color = "#10b981" }: { position: [number, number, number]; scale?: number; color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.1}
          metalness={0.8}
          transmission={0.4}
          ior={1.6}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

// Particle Dust Field
function ParticleField({ count = 60 }: { count?: number }) {
  const points = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 16;
      coords[i * 3 + 1] = (Math.random() - 0.5) * 12;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return coords;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
      pointsRef.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#fbbf24"
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

// Scene Root with Interactive Mouse Tilt
function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Parallax mouse tilt
      const targetX = (state.pointer.x * Math.PI) / 10;
      const targetY = (-state.pointer.y * Math.PI) / 12;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetY, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffffff" castShadow />
      <pointLight position={[-4, 3, 2]} intensity={2.5} color="#10b981" distance={10} />
      <pointLight position={[4, -2, 3]} intensity={3.0} color="#f59e0b" distance={10} />
      <spotLight position={[0, 6, 4]} intensity={1.5} angle={0.6} penumbra={1} color="#34d399" />

      {/* Floating 3D Invoice Cards (Cascading Stack) */}
      <FloatingInvoiceCard
        position={[0.2, 0.3, 0.5]}
        rotation={[-0.1, -0.2, 0.05]}
        title="Brand Strategy & 3D"
        amount="$6,200.00"
        client="Aurora Capital"
        status="SENT"
        isMain={true}
      />
      <FloatingInvoiceCard
        position={[-1.6, -0.7, -0.3]}
        rotation={[0.1, 0.25, -0.1]}
        title="Design System & Motion"
        amount="$4,500.00"
        client="Nexus Dynamics"
        status="PAID"
      />
      <FloatingInvoiceCard
        position={[1.8, -0.9, -0.6]}
        rotation={[-0.15, -0.3, 0.15]}
        title="Enterprise Spatial UI"
        amount="$12,500.00"
        client="CyberVault"
        status="DRAFT"
      />

      {/* Floating Gold Coins */}
      <GoldCoin position={[-2.4, 1.4, 0.8]} rotationSpeed={1.2} scale={0.7} />
      <GoldCoin position={[2.6, 1.2, 0.4]} rotationSpeed={-0.9} scale={0.85} />
      <GoldCoin position={[1.2, -1.8, 1.0]} rotationSpeed={1.4} scale={0.6} />

      {/* Floating Crystals */}
      <FloatingCrystal position={[-2.8, -1.6, 0.2]} scale={0.7} color="#34d399" />
      <FloatingCrystal position={[2.9, -0.4, 0.5]} scale={0.85} color="#fbbf24" />
      <FloatingCrystal position={[0.4, 2.2, -0.5]} scale={0.6} color="#10b981" />

      {/* Particle Stars */}
      <ParticleField count={80} />
    </group>
  );
}

export function HeroScene3D() {
  return (
    <div className="relative w-full h-[480px] lg:h-[580px] select-none">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
export default HeroScene3D;
