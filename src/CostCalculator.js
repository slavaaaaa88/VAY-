import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const SERVICES = [
  { key: "design", label: "Базовый дизайн (минимализм/Bento UI)", price: 10000 },
  { key: "wow", label: "WOW-визуалы (3D, градиенты)", price: 15000 },
  { key: "anim", label: "Анимации (GSAP, микроинтеракции)", price: 12000 },
  { key: "ai", label: "Интеграция AI-ассистента", price: 20000 },
  { key: "mobile", label: "Mobile-first адаптивность", price: 8000 },
  { key: "inter", label: "Интерактивные элементы", price: 10000 },
  { key: "pwa", label: "PWA (оффлайн-доступ)", price: 5000 },
  { key: "seo", label: "SEO-оптимизация", price: 7000 },
  { key: "analytics", label: "Интеграция с аналитикой", price: 4000 },
  { key: "custom", label: "Персональные фишки", price: 18000 },
];

function Site3DModel() {
  return (
    <mesh>
      <boxGeometry args={[1.8, 1.1, 0.18]} />
      <meshStandardMaterial color="#df83fd" roughness={0.33} />
      <mesh position={[0,0,0.12]}>
        <planeGeometry args={[1.7,0.8,8,8]} />
        <meshStandardMaterial color="#fff" roughness={0.13} />
      </mesh>
    </mesh>
  );
}

function format(num) {
  return `${num.toLocaleString("ru-RU")} руб.`;
}

export default function CostCalculator() {
  const [selected, setSelected] = useState(Object.fromEntries(SERVICES.map(s=>[s.key,true])));
  const [count, setCount] = useState(1);
  const [rush, setRush] = useState(false);
  const [price, setPrice] = useState(0);

  const priceRef = useRef(null);

  useEffect(() => {
    let sum = SERVICES.filter(s=>selected[s.key]).reduce((acc,s)=>acc+s.price,0);
    sum += count*1000;
    if (rush) sum = Math.round(sum * 1.5);
    setPrice(sum);
    if (priceRef.current) gsap.fromTo(priceRef.current, { scale:0.85 }, { scale:1.18, yoyo:true, repeat:1, duration:0.25 });
  }, [selected, count, rush]);

  // Конфетти на финал (эмулируется wow-эффект)
  const confettiRef = useRef(null);
  const [fired, setFired] = useState(false);
  const fireConfetti = () => {
    setFired(true); setTimeout(()=>setFired(false),1100);
    if (window.aiChatSend) window.aiChatSend(`Цена ${price} руб. Хочешь скидку или доработки?`);
  };

  return (
    <section style={{padding:'7vw 2vw',background:'#f3f9ff',position:'relative',overflow:'hidden'}}>
      {/* WOW! 3D за формой */}
      <div style={{position:"absolute",zIndex:1, left:0,right:0,top:'-50px',width:"100%",height:280, pointerEvents:"none",opacity:0.95}}>
        <Canvas style={{width:"100%",height:"100%"}} camera={{position:[0,0,3]}}>
          <ambientLight intensity={0.35}/>
          <directionalLight position={[2,4,6]}/>
          <Site3DModel/>
          <OrbitControls enableZoom={false} autoRotate />
        </Canvas>
      </div>
      <AnimatePresence>
        {fired && (
          <motion.div key="confetti" initial={{opacity:1,scale:0.65}} animate={{opacity:0,scale:1.5}} exit={{opacity:0}} style={{
            position:'fixed',left:0,top:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:99,
            background:"radial-gradient(ellipse at 70% 40%, #ff85e2aa 25%, transparent 70%)"
          }}/>
        )}
      </AnimatePresence>
      <motion.div initial={{opacity:0,y:65}} whileInView={{opacity:1,y:0}} transition={{duration:.65}}>
        <h2 style={{
          fontSize:'clamp(2.3rem,5vw,3.1rem)',textAlign:'center',fontWeight:800,letterSpacing:'0.01em',marginBottom:32,
          background:'linear-gradient(90deg,#a770ef, #ff69b4 80%)',backgroundClip:'text',WebkitBackgroundClip:'text',color:'transparent'
        }}>Рассчитай стоимость сайта</h2>
        <form style={{
          background:'#fff',maxWidth:460,margin:'20px auto',borderRadius:32,boxShadow:'0 4px 32px #9f52f233',
          padding:'2.2rem 1.6rem',position:'relative',zIndex:2,display:'flex',flexDirection:'column',gap:18
        }} onSubmit={e=>{e.preventDefault();fireConfetti();}}>
          {SERVICES.map(s=>(
            <label key={s.key} style={{display:'flex',alignItems:'center',gap:9,fontWeight:600}}>
              <input type="checkbox"
                     checked={selected[s.key]} onChange={e=>setSelected(o=>({...o,[s.key]:e.target.checked}))}
                     style={{width:19,height:19,accentColor:"#be52e9"}}
              />
              <span>{s.label}</span>
              <span style={{marginLeft:'auto',fontWeight:400,opacity:0.72}}>{format(s.price)}</span>
            </label>
          ))}
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <span>Количество страниц:</span>
            <input type="range" min={1} max={10} value={count} style={{flex:1}} onChange={e=>setCount(Number(e.target.value))}/>
            <b>{count}</b>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <span>Срочность:</span>
            <label style={{display:'inline-flex',alignItems:'center',gap:6}}>
              <input type="checkbox" checked={rush} onChange={e=>setRush(e.target.checked)}
                style={{width:19,height:19,accentColor:"#ff69b4"}}/>
              <span>Срочный запуск (x1.5)</span>
            </label>
          </div>
          <motion.div style={{
            background:'linear-gradient(90deg, #ff69b4 30%, #a770ef 70%)',
            color:'#fff',borderRadius:18,padding:'16px 0 9px',fontSize:'1.2rem',fontWeight:800,
            boxShadow:'0 2px 14px #ffb0ec33',textAlign:'center',letterSpacing:'0.03em'
          }} animate={{scale:[1,1.11,1]}} transition={{repeat:Infinity,duration:3,repeatType:"reverse"}}>
            <span>ИТОГО:</span><br/>
            <span ref={priceRef} style={{fontSize:'1.7rem',display:'inline-block',marginTop:5}}>{format(price)}</span>
          </motion.div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:11,gap:5}}>
            <button type="submit"
              style={{
                flex:1,
                background:'linear-gradient(90deg,#ff69b4,#a770ef 80%)',
                color:'#fff',padding:'14px',fontWeight:800,border:'none',
                borderRadius:30,fontSize:'1.04rem',cursor:'pointer',boxShadow:'0 2px 16px #ff74db66,0 1px 5px #0001'
              }}>
              Заказать
            </button>
            <a target="_blank" rel="noopener noreferrer"
              href={`data:text/plain,Ваш расчёт: ${format(price)}. ${Object.entries(selected).filter(([k,v])=>v).map(([k])=>SERVICES.find(s=>s.key===k).label).join(', ')}. Cтраниц: ${count}, Срочность: ${rush?"СРОЧНО":"стандарт"}.`}
              download="kalkul_site.txt"
              style={{
                flex:1,background:'#fff',border:'1.5px solid #be52e9',
                color:'#be52e9',fontWeight:700,borderRadius:30,fontSize:'1.04rem',padding:'14px',textAlign:'center',textDecoration:'none'
              }}>
              Скачать PDF
            </a>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
