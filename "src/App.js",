import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Hero() {
  const titleRef = useRef();
  useEffect(() => {
    gsap.from(titleRef.current, { opacity: 0, y: -50, duration: 1, ease: 'power3.out' });
  }, []);

  const aiGreet = () => alert('Привет! Я AI-гид. Хочешь узнать о примерах работ? Спроси о "Свой дом НН"!');

  return (
    <section style={{ height: '100vh', position: 'relative' }}>
      <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
        <OrbitControls />
      </Canvas>
      <h1 ref={titleRef} style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '3em' }}>
        Открой революцию в веб-дизайне
      </h1>
      <button onClick={aiGreet} style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)' }}>
        Поговори с AI-ассистентом
      </button>
    </section>
  );
}

function Gallery() {
  const cardRef = useRef();
  const [isHovered, setHovered] = useState(false);

  useEffect(() => {
    if (isHovered) {
      gsap.to(cardRef.current, { rotationY: 180, duration: 0.5, ease: 'power2.inOut' });
    } else {
      gsap.to(cardRef.current, { rotationY: 0, duration: 0.5 });
    }
  }, [isHovered]);

  return (
    <section style={{ padding: '50px', background: '#f0f0f0' }}>
      <h2>Примеры работ</h2>
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ width: '300px', height: '200px', background: 'white', border: '1px solid #ccc', padding: '20px', cursor: 'pointer', transformStyle: 'preserve-3d' }}
      >
        <h3>Свой дом НН | Современные каркасные дома</h3>
        <p>Классический лендинг с потенциалом для WOW-улучшений.</p>
        <a href="https://dom-svoi52.github.io/---52/" target="_blank" rel="noopener noreferrer">Посмотреть</a>
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <Hero />
      <Gallery />
    </>
  );
}

export default App;
