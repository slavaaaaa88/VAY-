import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from 'react-modal';

const projects = [
  {
    id: 1,
    title: 'Свой дом НН',
    desc: 'Одностраничник о каркасных домах и ипотечном кредитовании.',
    link: 'https://dom-svoi52.github.io/---52/',
    img : 'https://placehold.co/600x400/pink/white?text=Svoi+Dom+NN'
  },
  { id: 2, title: 'Placeholder A', desc: 'Описание проекта-плейсхолдера.', link: '#',
    img: 'https://placehold.co/600x400/indigo/white?text=Project+2' },
  { id: 3, title: 'Placeholder B', desc: 'Ещё один проект.', link: '#',
    img: 'https://placehold.co/600x400/teal/white?text=Project+3' },
  { id: 4, title: 'Placeholder C', desc: 'Описание.', link: '#',
    img: 'https://placehold.co/600x400/orange/white?text=Project+4' }
];

export default function Gallery() {
  const [active, setActive] = useState(null);
  const close = () => setActive(null);

  const askAI = (p) => {
    window?.aiChatSend?.(`Расскажи о проекте «${p.title}»`);
  };

  return (
    <section style={{padding:'8vw 4vw',background:'#fafafa'}}>
      <motion.h2
        initial={{y:60,opacity:0}} whileInView={{y:0,opacity:1}}
        transition={{duration:0.6}}
        style={{textAlign:'center',fontSize:'clamp(2rem,5vw,3.2rem)',marginBottom:'4rem',fontWeight:800}}
      >
        Мои проекты
      </motion.h2>

      <div style={{
        display:'grid',gap:'2rem',
        gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))'
      }}>
        {projects.map(p=>(
          <motion.div key={p.id}
            whileHover={{scale:1.05,rotateX:3,rotateY:-3}}
            transition={{type:'spring',stiffness:260,damping:18}}
            onClick={()=>setActive(p)}
            style={{
              cursor:'pointer',borderRadius:24,overflow:'hidden',
              background:'#fff',boxShadow:'0 10px 28px rgba(0,0,0,.1)'
            }}>
            <img src={p.img} alt={p.title}
                 onError={e=>e.currentTarget.src='https://placehold.co/600x400/cccccc/ffffff?text=No+image'}
                 style={{width:'100%',height:200,objectFit:'cover'}}/>
            <div style={{padding:'1.2rem 1.4rem'}}>
              <h3 style={{margin:0,fontSize:'1.25rem'}}>{p.title}</h3>
              <p style={{marginTop:6,color:'#666',fontSize:'.95rem'}}>{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* модал */}
      <Modal
        isOpen={!!active} onRequestClose={close}
        style={{
          content:{inset:'12% auto auto 50%',transform:'translateX(-50%)',
                   maxWidth:680,borderRadius:24,padding:0,border:'none',overflow:'hidden'},
          overlay:{background:'rgba(0,0,0,.55)',zIndex:1300}
        }}>
        {active && (
          <>
            <img src={active.img} alt="" style={{width:'100%',height:300,objectFit:'cover'}}/>
            <div style={{padding:'2rem'}}>
              <h2 style={{marginTop:0}}>{active.title}</h2>
              <p>{active.desc}</p>
              <a href={active.link} target="_blank" rel="noopener noreferrer">
                Перейти на сайт →
              </a>
              <button
                onClick={()=>askAI(active)}
                style={{
                  marginTop:18,padding:'12px 28px',
                  background:'#ff69b4',color:'#fff',border:'none',
                  borderRadius:28,cursor:'pointer'
                }}>
                Спросить AI
              </button>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
