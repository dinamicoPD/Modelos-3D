'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

// Modelo de caja simple con rotación
export function SimpleBox() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4f46e5" />
    </mesh>
  );
}

// Modelo de robot simple
export function SimpleRobot() {
  const groupRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Cuerpo */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 2, 0.8]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      
      {/* Cabeza */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      
      {/* Ojos */}
      <mesh position={[-0.3, 1.7, 0.5]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.3, 1.7, 0.5]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Brazos */}
      <mesh position={[-1.2, 0.5, 0]}>
        <boxGeometry args={[0.4, 1.5, 0.4]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[1.2, 0.5, 0]}>
        <boxGeometry args={[0.4, 1.5, 0.4]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      
      {/* Piernas */}
      <mesh position={[-0.4, -1.5, 0]}>
        <boxGeometry args={[0.5, 1.5, 0.5]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0.4, -1.5, 0]}>
        <boxGeometry args={[0.5, 1.5, 0.5]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}

// Modelo de casa simple
export function SimpleHouse() {
  return (
    <group position={[0, -1, 0]}>
      {/* Base de la casa */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 2, 2.5]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      
      {/* Techo */}
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[2.2, 1.5, 4]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      
      {/* Puerta */}
      <mesh position={[0, -0.5, 1.26]}>
        <boxGeometry args={[0.6, 1.2, 0.1]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
      
      {/* Ventanas */}
      <mesh position={[-0.8, 0.2, 1.26]}>
        <boxGeometry args={[0.5, 0.5, 0.1]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <mesh position={[0.8, 0.2, 1.26]}>
        <boxGeometry args={[0.5, 0.5, 0.1]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
    </group>
  );
}

// Modelo de coche simple
export function SimpleCar() {
  const carRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (carRef.current) {
      carRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={carRef} position={[0, -0.5, 0]}>
      {/* Carrocería principal */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 0.8, 1.5]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      
      {/* Cabina */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.8, 0.8, 1.3]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      
      {/* Ruedas */}
      <mesh position={[-1, -0.6, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[1, -0.6, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-1, -0.6, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[1, -0.6, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      
      {/* Faros */}
      <mesh position={[1.5, 0, 0.4]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[1.5, 0, -0.4]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}