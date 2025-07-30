import * as THREE from 'three';
import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import AIChat from './AIChat';
import Gallery from './Gallery';
import CostCalculator from './CostCalculator';
import IdeaGenerator from './IdeaGenerator';

function GlowSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.6,64,64]}/>
      <meshStandardMaterial color="#ff69b4" emissive="#ff5cf5" emissiveIntensity={0.8} roughness={0.17} metalness={0.11}/>
    </mesh>
  );
}

const Hero = () => {
  const titleRef = useRef(null);
  const chatRef  = useRef();

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y:-90, opacity:0 },
      { y:0, opacity:1, duration:0.8, ease:'power2' }
    );
  }, []);

  return (
    <section style={{
      height:'100vh',width:'100vw',minHeight:'100dvh',
      position:'relative',background:'radial-gradient(circle at 60% 40%, #18122b 65%, #13051e 100%)',
      overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'
    }}>
      <Canvas style={{position:'absolute',inset:0,zIndex:1}} gl={{antialias:true}}>
        <PerspectiveCamera makeDefault position={[0,0,5]} fov={66}/>
        <ambientLight intensity={0.55}/>
        <pointLight position={[10,13,10]} intensity={1.2}/>
        <Suspense fallback={null}><GlowSphere/></Suspense>
        <OrbitControls enablePan={false} enableZoom={false}
                       minPolarAngle={Math.PI/4} maxPolarAngle={3*Math.PI/4}/>
      </Canvas>
      <div style={{zIndex:2,color:'#fff',textAlign:'center',width:'100%'}}>
        <h1 ref={titleRef}
            style={{fontSize:'clamp(2.1rem,4vw,3.4rem)',margin:'0 0 30px',fontWeight:800}}>
          Открой революцию в&nbsp;веб-дизайне
        </h1>
        <button
          onClick={()=>chatRef.current?.openChat()}
          style={{
            padding:'14px 36px',fontSize:'1.08rem',border:'none',borderRadius:30,
            background:'linear-gradient(90deg,#ff69b4 40%,#a770ef 100%)',
            color:'#fff',fontWeight:700,cursor:'pointer',boxShadow:'0 6px 24px #ff74db66'
          }}>
          Поговори с AI-ассистентом
        </button>
      </div>
      <AIChat ref={chatRef}/>
    </section>
  );
};

export default function App() {
  return (
    <>
      <Hero/>
      <Gallery/>
      <CostCalculator/>
      <IdeaGenerator/>
    </>
  );
}
