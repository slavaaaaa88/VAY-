import React, {
  useState, useRef, useEffect, forwardRef, useImperativeHandle
} from "react";
import axios from "axios";

const apiUrl =
  "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct";
const systemPrompt =
  "Ты креативный AI-гид по портфолио веб-разработчика. Отвечай кратко, с юмором. Примеры: На 'покажи работы' — опиши галерею. На 'Свой дом НН' — 'Это проект о каркасных домах, ссылка: https://dom-svoi52.github.io/---52/'. Если вопрос не по теме, предложи спросить о портфолио.\n";
const initialMsg =
  "👋 Привет! Я AI-гид по портфолио. Спроси меня про проекты! Бесплатная версия, возможны задержки.";

const AIChat = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: initialMsg }]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const chatBoxRef = useRef();
  const inputRef  = useRef();

  /* доступ из Hero / Gallery */
  useImperativeHandle(ref, () => ({
    openChat: () => setOpen(true)
  }), []);

  /* глобальная функция, которой пользуется Gallery */
  useEffect(() => {
    window.aiChatSend = (txt) => {
      setOpen(true);
      setTimeout(() => {
        setInput(txt);
        document.getElementById('ai-chat-submit')?.click();   // имитация отправки
      }, 200);
    };
    return () => delete window.aiChatSend;
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (open && chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages(m => [...m, { from: 'user', text }]);
    setPending(true);
    setInput("");
    try {
      const res = await axios.post(
        apiUrl,
        { inputs: systemPrompt + text, parameters: { max_new_tokens: 150, temperature: 0.7 } },
        { headers: { Authorization: `Bearer ${process.env.REACT_APP_HF_API_KEY}` } }
      );
      const answer =
        res?.data?.generated_text ||
        (Array.isArray(res.data) && res.data[0]?.generated_text) ||
        "Ответ не получен.";
      setMessages(m => [...m, { from: 'bot', text: answer.trim() }]);
    } catch {
      setMessages(m => [...m, { from: 'bot', text: 'Лимит Hugging Face, попробуй позже!'}]);
    }
    setPending(false);
  };

  const isMobile = window.innerWidth < 700;

  if (!showBubble) return null;

  return (
    <>
      {/* плавающая кнопка 💬 */}
      <div style={{
        position:'fixed', right:20, bottom:20, zIndex:1000,
        display: open || isMobile ? 'none' : 'block'
      }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            width:56, height:56, borderRadius:'50%', border:'none',
            background:'linear-gradient(135deg,#ff69b4,#bd36ad)',
            color:'#fff', fontSize:26, cursor:'pointer',
            boxShadow:'0 4px 20px #d14bdb5a'
          }}
        >
          💬
        </button>
      </div>

      {/* окно чата */}
      {open && (
        <div style={{
          position:'fixed', right:isMobile?4:24, bottom:isMobile?4:24,
          width:isMobile?'96vw':360, height:isMobile?'65vh':420,
          background:'#fff4fe', borderRadius:18, zIndex:1200,
          boxShadow:'0 8px 48px #ff88d029'
        }}>
          {/* header */}
          <div style={{
            background:'linear-gradient(90deg,#ff69b4,#d923b9)',
            color:'#fff', padding:'12px 18px 10px', fontWeight:700,
            borderTopLeftRadius:18, borderTopRightRadius:18,
            display:'flex', justifyContent:'space-between', alignItems:'center'
          }}>
            AI-помощник
            <button onClick={() => setOpen(false)}
              style={{background:'none',border:'none',color:'#fff',fontSize:26,cursor:'pointer'}}>×</button>
          </div>

          {/* сообщения */}
          <div ref={chatBoxRef}
               style={{flex:1,overflowY:'auto',padding:'12px',background:'#fff'}}>
            {messages.map((m,i)=>(
              <div key={i} style={{margin:'6px 0',textAlign:m.from==='bot'?'left':'right'}}>
                <div style={{
                  display:'inline-block', maxWidth:230,
                  background:m.from==='bot'?'#ffe0ef':'#e7f4ff',
                  borderRadius:m.from==='bot'?'0 15px 15px 15px':'15px 0 15px 15px',
                  padding:'9px 14px',fontSize:15,wordBreak:'break-word'
                }}>{m.text}</div>
              </div>
            ))}
            {pending && <div style={{color:'#999',fontSize:14}}>AI думает…</div>}
          </div>

          {/* ввод */}
          <form onSubmit={(e)=>{e.preventDefault();send();}}
                style={{display:'flex',padding:'8px 10px',borderTop:'1px solid #ff69b432'}}>
            <input
              value={input}
              ref={inputRef}
              onChange={(e)=>setInput(e.target.value)}
              placeholder="Ваш вопрос…"
              style={{flex:1,border:'none',outline:'none',fontSize:15,background:'transparent'}}
            />
            <button id="ai-chat-submit" type="submit" disabled={pending||!input.trim()}
              style={{
                marginLeft:6,padding:'8px 18px',border:'none',borderRadius:16,
                background:'linear-gradient(90deg,#ff69b4,#d923b9)',color:'#fff',
                cursor:pending?'not-allowed':'pointer',opacity:pending||!input.trim()?0.6:1
              }}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
});

export default AIChat;
