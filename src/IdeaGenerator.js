import React, { useState } from "react";
import { motion } from "framer-motion";
import Modal from "react-modal";
import axios from "axios";

const FEATURES = [
  "AI", "3D", "Анимации", "Генераторы", "Личный кабинет", "WOW-меню", "Видео", "SEO"
];

const initialForm = {
  type: "Лендинг",
  target: "Бизнес",
  features: [],
  budget: 2,
  idea: "",
};

const budgets = ["Низкий", "Средний", "Высокий"];

function getPrompt(form) {
  return [
    "Представь себя креативным AI-консультантом и придумай 3 идеи сайта на русском языке.",
    `Тип: ${form.type}. ЦА: ${form.target}. Бюджет: ${budgets[form.budget]}.`,
    `Фичи: ${form.features.join(", ")||"любые"}.`,
    form.idea ? `Основа: ${form.idea}.` : "",
    "Формат: нумерованный список, с юмором и WOW-описанием, max 2 строки на идею."
  ].join(" ");
}

export default function IdeaGenerator() {
  const [form, setForm] = useState(initialForm);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalImg, setModalImg] = useState(null);

  const generate = async () => {
    setLoading(true);
    setIdeas([]);
    try {
      const resp = await axios.post(
        "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct",
        {inputs:getPrompt(form),parameters:{max_new_tokens:180,temperature:0.82}},
        {headers:{Authorization:`Bearer ${process.env.REACT_APP_HF_API_KEY}`}}
      );
      let text = resp?.data?.generated_text || Array.isArray(resp?.data)&&resp.data[0]?.generated_text;
      if (!text) throw new Error();
      setIdeas(text.trim().split(/\d+\.\s/).filter(x=>x).map(s=>s.replace(/^[-–]*\s?/,"")));
    } catch {
      setIdeas(["Идеи временно не доступны. Попробуйте позже!"]);
    }
    setLoading(false);
    if (window.aiChatSend) window.aiChatSend("Классная идея! Давай доработаем?");
  };

  return (
    <section style={{padding:'8vw 4vw',background:'#fffbfa'}}>
      <motion.h2 initial={{y:53,opacity:0}} whileInView={{y:0,opacity:1}} transition={{duration:.65}}
        style={{marginBottom:36,fontWeight:800,fontSize:'clamp(2rem,4vw,3rem)',textAlign:'center',
        background:'linear-gradient(90deg,#ef7bff 40%,#80eaff 100%)',backgroundClip:'text',color:'transparent'}}
      >
        Генератор идей для&nbsp;твоего проекта
      </motion.h2>
      <motion.form
        initial={{y:62,opacity:0}} whileInView={{y:0,opacity:1}} transition={{duration:.53}}
        style={{
          background:'#fff',maxWidth:520,margin:'0 auto',borderRadius:32,
          boxShadow:'0 4px 32px #ff51b733',padding:'2.1rem 1.5rem',
          display:'grid',gap:15,zIndex:2,position:'relative'
        }}
        onSubmit={e=>{e.preventDefault();generate();}}
      >
        <div>
          <label>Тип проекта:</label>
          <select value={form.type} style={{marginLeft:12}} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
            <option>Лендинг</option><option>Многостраничник</option><option>PWA</option>
          </select>
        </div>
        <div>
          <label>Целевая аудитория:</label>
          <select value={form.target} style={{marginLeft:12}} onChange={e=>setForm(f=>({...f,target:e.target.value}))}>
            <option>Бизнес</option><option>Личное</option><option>E-commerce</option>
          </select>
        </div>
        <div>
          <label>Ключевые фичи:</label>
          <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:4}}>
            {FEATURES.map(f=>(
              <label key={f} style={{
                background:form.features.includes(f)?'#a770ef':'#f0f0f0',
                color:form.features.includes(f)?'#fff':'#4a4186',fontWeight:600,padding:'4px 11px',borderRadius:17,cursor:'pointer'
              }}>
                <input type="checkbox" checked={form.features.includes(f)}
                  onChange={e=>{
                    setForm(fr=>({...fr,
                      features:e.target.checked?[...fr.features,f]:fr.features.filter(x=>x!==f)
                    }));
                  }}
                  style={{display:'none'}}
                />{f}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label>Бюджет: </label>
          <input type="range" min={0} max={2} value={form.budget}
                 onChange={e=>setForm(f=>({...f,budget:Number(e.target.value)}))}
                 style={{accentColor:"#ef7bff",margin:"0 8px"}}/>
          <b>{budgets[form.budget]}</b>
        </div>
        <div>
          <label>Тема/идея:</label>
          <input value={form.idea} onChange={e=>setForm(f=>({...f,idea:e.target.value}))}
            placeholder="Сайт для кафе с WOW-меню..." style={{width:'66%',marginLeft:12}}/>
        </div>
        <button type="submit"
          disabled={loading}
          style={{
            marginTop:6,background:'linear-gradient(90deg,#ef7bff,#80eaff)',
            color:'#fff',fontWeight:700,padding:'13px',border:'none',borderRadius:30,
            fontSize:'1.1rem',boxShadow:'0 2px 14px #aefff477',cursor:'pointer'
          }}>
          {loading ? 'Генерирую…' : 'Сгенерировать'}
        </button>
      </motion.form>
      <motion.div style={{margin:'42px auto 0',maxWidth:950,display:'grid',gap:28,
        gridTemplateColumns:'repeat(auto-fit, minmax(270px,1fr))'}}
        initial={{opacity:0,y:38}} animate={ideas.length?{opacity:1,y:0}:{}} transition={{duration:.55}}>
        {ideas.map((idea,i)=>(
          <motion.div key={i}
            initial={{rotateX:60,opacity:0,scale:0.77}}
            animate={{rotateX:0,opacity:1,scale:1}}
            transition={{delay:i*0.18,type:'spring',stiffness:200}}
            style={{
              borderRadius:24,padding:'1.5rem 1.3rem',background:'#fff',boxShadow:'0 2px 20px #c3a6ff1c',
              fontWeight:600,fontSize:'1.12rem',color:'#8324ae',minHeight:90,position:'relative'
            }}>
            <div style={{fontWeight:800,color:'#be52e9',marginBottom:12}}>Идея {i+1}</div>
            <div>{idea}</div>
            <div style={{marginTop:10,display:'flex',gap:9}}>
              <button onClick={()=>window?.aiChatSend && window.aiChatSend(`Обсуди идею: ${idea}`)}
                style={{background:'#ae7bff',color:'#fff',border:'none',borderRadius:18,padding:'8px 16px',fontWeight:700,cursor:'pointer',fontSize:'1rem'}}>
                Обсудить с AI
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
