import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';

function GlowSphere() {
  // Это не мешает вращению!
  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[1.6, 64, 64]} />
      <meshStandardMaterial
        color="#ff69b4"
        emissive="#ff5cf5"
        emissiveIntensity={1}
        roughness={0.2}
        metalness={0.3}
      />
    </mesh>
  );
}

const Hero = () => {
  const titleRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
    );
  }, []);

  return (
    <section
      style={{
        height: '100vh',
        width: '100vw',
        minHeight: '100dvh',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
        background: 'radial-gradient(circle at 60% 40%, #1a1140 62%, #0c071b 100%)'
      }}
    >
      <Canvas
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          background: 'none'
        }}
        shadows={true}
        camera={{ position: [0, 0, 4.7], fov: 60 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4.7]} fov={60} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[8, 10, 20]} intensity={1.5} />
        <Suspense fallback={null}>
          <GlowSphere />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />
      </Canvas>
      <div
        style={{
          zIndex: 2,
          position: 'relative',
          color: '#fff',
          textAlign: 'center',
          width: '100%',
          pointerEvents: 'auto'
        }}
      >
        <h1
          ref={titleRef}
          style={{
            fontSize: 'clamp(2.3rem,5vw,3.3rem)',
            margin: '0 0 30px',
            fontWeight: 800,
            textShadow: '0 3px 20px #ff2fcd77, 0 2px 8px #000',
            letterSpacing: '0.01em'
          }}
        >
          Открой революцию в&nbsp;веб-дизайне
        </h1>
        <button
          style={{
            padding: '14px 36px',
            fontSize: '1.08rem',
            border: 'none',
            borderRadius: 30,
            backgroundImage: 'linear-gradient(90deg, #ff69b4 40%, #a770ef 100%)',
            color: '#fff',
            boxShadow: '0 6px 24px #ff74db66',
            cursor: 'pointer',
            transition: 'background 0.18s, transform 0.18s',
            fontWeight: 700
          }}
        >
          {/* Здесь вызовите чат, если нужно */}
          Поговори с AI-ассистентом
        </button>
      </div>
    </section>
  );
};

export default function App() {
  return <Hero />;
}
