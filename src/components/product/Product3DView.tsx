import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { Suspense } from 'react';
import { motion } from 'framer-motion';

function ServerModel() {
  return (
    <mesh>
      <boxGeometry args={[1, 0.5, 1.5]} />
      <meshStandardMaterial color="#2F2F2F" />
      {/* Front panel details */}
      <mesh position={[0, 0, 0.76]}>
        <boxGeometry args={[0.8, 0.3, 0.02]} />
        <meshStandardMaterial color="#1F1F1F" />
      </mesh>
      {/* LED lights */}
      <mesh position={[-0.3, 0.1, 0.77]}>
        <sphereGeometry args={[0.02]} />
        <meshStandardMaterial color="#4ADE80" emissive="#4ADE80" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.2, 0.1, 0.77]}>
        <sphereGeometry args={[0.02]} />
        <meshStandardMaterial color="#60A5FA" emissive="#60A5FA" emissiveIntensity={2} />
      </mesh>
    </mesh>
  );
}

export default function Product3DView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-[400px] bg-gray-300 rounded-lg overflow-hidden"
    >
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <ServerModel />
          </Stage>
          <OrbitControls
            autoRotate
            autoRotateSpeed={4}
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}