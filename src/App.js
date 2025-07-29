import * as THREE from 'three';
import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import AIChat from './AIChat';

function GlowSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.6, 64, 64]} />
      <meshStandardMaterial
        color="#ff69b4"
        emissive="#ff5cf5"
        emissiveIntensity={0.8}
        roughness={0.17}
        metalness={0.11}
      />
    </mesh>
  );
}

const Hero = () => {
  const titleRef = useRef(null);
  const chatRef = useRef();

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: -90, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2' }
    );
  }, []);

  return (
    <section
      style={{
        height: '100vh',
        width: '100vw',
        minHeight: '100dvh',
        minWidth: '100vw',
        position: 'relative',
        margin: 0,
        padding: 0,
        background: 'radial-gradient(circle at 60% 40%, #18122b 65%, #13051e 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Canvas
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'none'
        }}
        gl={{ antialias: true }}
        resize={{ scroll: false, debounce: 0 }}
        mode="concurrent"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={66} />
        <ambientLight intensity={0.55} />
        <pointLight position={[10, 13, 10]} intensity={1.2} />
        <Suspense fallback={null}>
          <GlowSphere />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={3 * Math.PI / 4} />
      </Canvas>
      <div
        style={{
          zIndex: 2,
          position: 'relative',
          color: '#fff',
          textAlign: 'center',
          width: '100%',
          userSelect: 'none',
          pointerEvents: 'auto'
        }}
      >
        <h1
          ref={titleRef}
          style={{
            fontSize: 'clamp(2.1rem, 4vw, 3.4rem)',
            margin: '0 0 30px',
            fontWeight: 800,
            textShadow: '0 3px 30px #ff2fcd77, 0 2px 8px #000',
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
          onClick={() => chatRef.current && chatRef.current.openChat()}
        >
          Поговори с AI-ассистентом
        </button>
      </div>
      <AIChat ref={chatRef} />
    </section>
  );
};

const Gallery = () => {
  const cardRef = useRef(null);

  useEffect(() => {
    let ctx;
    if (cardRef.current) {
      ctx = gsap.context(() => {
        gsap.set(cardRef.current, { y: 0 });
      }, cardRef.current);
    }
    return () => ctx && ctx.revert();
  }, []);

  const onEnter = () => {
    gsap.to(cardRef.current, {
      y: 180,
      duration: 0.35,
      ease: 'power1.out'
    });
  };

  const onLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.4,
      ease: 'power1.out'
    });
  };

  return (
    <section
      style={{
        minHeight: '58vh',
        background: '#fff',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        ref={cardRef}
        style={{
          background: '#f5f5f5',
          width: 290,
          height: 180,
          borderRadius: 32,
          boxShadow: '0 4px 28px #0001',
          margin: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.19rem',
          color: '#242424',
          cursor: 'pointer',
          transition: 'box-shadow 0.21s',
          perspective: 900
        }}
        tabIndex={0}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
      >
        <a
          href="https://svoidom-nn.ru"
          style={{
            textDecoration: 'none',
            color: 'inherit'
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div>Свой дом НН — пример работы</div>
        </a>
      </div>
    </section>
  );
};

const App = () => (
  <>
    <Hero />
    <Gallery />
  </>
);

export default App;
