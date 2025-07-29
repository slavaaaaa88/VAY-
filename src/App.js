// Фикс для Vercel build — импорт полного THREE (важно!)
import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import AIChat from './AIChat';

const Hero = () => {
  const titleRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    );
  }, []);

  return (
    <section
      style={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        background: '#111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* 3D pink-сфера и OrbitControls */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          zIndex: 1
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial color="#ff69b4" />
        </mesh>
        <OrbitControls enablePan={false} />
      </Canvas>
      <div
        style={{
          zIndex: 2,
          position: 'relative',
          color: '#fff',
          textAlign: 'center'
        }}
      >
        <h1
          ref={titleRef}
          style={{
            fontSize: '2.2rem',
            margin: '0 0 24px',
            fontWeight: 800,
            textShadow: '0 2px 10px #000'
          }}
        >
          Открой революцию в веб-дизайне
        </h1>
        <button
          style={{
            padding: '14px 32px',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '30px',
            background: '#ff69b4',
            color: '#fff',
            boxShadow: '0 4px 24px #ff69b477',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onClick={() => alert('Привет! Я AI-ассистент для креативных проектов.')}
        >
          Поговори с AI-ассистентом
        </button>
      </div>
      <AIChat />
    </section>
  );
};

const Gallery = () => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    let ctx;
    if (card) {
      ctx = gsap.context(() => {
        gsap.set(card, { y: 0 });
      }, card);
    }
    return () => ctx && ctx.revert();
  }, []);

  const onEnter = () => {
    gsap.to(cardRef.current, {
      y: 180,
      duration: 0.4,
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
        minHeight: '60vh',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        ref={cardRef}
        style={{
          background: '#f5f5f5',
          width: 280,
          height: 180,
          borderRadius: 32,
          boxShadow: '0 4px 20px #0001',
          margin: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          color: '#242424',
          cursor: 'pointer',
          transition: 'box-shadow 0.2s',
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
