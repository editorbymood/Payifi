import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function QuantumIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const wireRef = useRef<THREE.Mesh>(null!);
  const pointsRef = useRef<THREE.Points>(null!);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.6;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x -= delta * 0.3;
      wireRef.current.rotation.z += delta * 0.5;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group scale={1.8}>
      {/* Outer Wireframe Cage */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshBasicMaterial color="#00f2fe" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Solid Refractive Core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#7f00ff"
          roughness={0.1}
          metalness={0.9}
          emissive="#4facfe"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Floating Orbital Points */}
      <points ref={pointsRef}>
        <sphereGeometry args={[1.8, 16, 16]} />
        <pointsMaterial color="#e100ff" size={0.035} transparent opacity={0.6} />
      </points>
    </group>
  );
}

export default function PayifiCanvas() {
  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={2.5} color="#00f2fe" />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#e100ff" />
        <QuantumIcosahedron />
      </Canvas>
    </div>
  );
}
