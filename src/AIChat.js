import React, {
  useState, useRef, useEffect, forwardRef, useImperativeHandle
} from "react";
import axios from "axios";

const apiUrl = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct";
const systemPrompt = "Ты креативный AI-гид по портфолио веб-разработчика. Отвечай кратко, с юмором. Примеры: На 'покажи работы' — опиши галерею. На 'Свой дом НН' — 'Это проект о каркасных домах, ссылка: https://dom-svoi52.github.io/---52/'. Если вопрос не по теме, предложи спросить о портфолио.\n";
const initialMsg = "👋 Привет! Я AI-гид по портфолио, расскажу о проектах, дам совет или пошучу. Бесплатная версия, бывают задержки (лимиты API). Спроси меня про \"Свой дом НН\" или портфолио!";

const AIChat = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: initialMsg },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const inputRef = useRef(null);

  // Делаем публичную функцию для открытия чата
  useImperativeHandle(ref, () => ({
    openChat: () => setOpen(true),
  }), []);

  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 1100);
    return () => clearTimeout(t);
  }, []);

  const chatBoxRef = useRef();
  useEffect(() => {
    if (open && chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, open]);

  const onSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((m) => [...m, { from: "user", text: input }]);
    setPending(true);
    setInput("");

    try {
      const response = await axios.post(
        apiUrl,
        {
          inputs: systemPrompt + input,
          parameters: { max_new_tokens: 150, temperature: 0.7 },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_HF_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      let answer =
        response?.data?.generated_text ||
        (Array.isArray(response?.data) && response.data[0]?.generated_text);
      if (!answer) answer = "Ответ не получен.";
      setMessages((m) => [...m, { from: "bot", text: answer.trim() }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text: "Лимит запросов Hugging Face, попробуй позже! 🤖",
        },
      ]);
    }
    setPending(false);
  };

  const isMobile = window.innerWidth < 700 || window.matchMedia("(max-width:700px)").matches;

  if (!showBubble) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          right: 19,
          bottom: 20,
          zIndex: 1000,
          display: open || isMobile ? "none" : "block",
          backdropFilter: 'blur(0.5px)'
        }}
      >
        <button
          aria-label="Открыть чат"
          style={{
            background: "linear-gradient(135deg,#ff69b4,#bd36ad 80%)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 54,
            height: 54,
            boxShadow: "0 4px 20px #d14bdb5a",
            fontSize: 26,
            cursor: "pointer",
          }}
          onClick={() => setOpen(true)}
        >
          💬
        </button>
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            right: isMobile ? 3 : 27,
            bottom: isMobile ? 4 : 26,
            width: isMobile ? "98vw" : 360,
            maxWidth: "100vw",
            background: "#fff4fe",
            borderRadius: 18,
            boxShadow: "0px 8px 48px #ff88d029, 0 2px 15px #0002",
            zIndex: 1200,
            display: "flex",
            flexDirection: "column",
            height: isMobile ? "65vh" : 420,
            minHeight: 320,
            transition: "opacity 0.16s",
          }}
        >
          <div
            style={{
              padding: "12px 18px 10px 18px",
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              background: "linear-gradient(90deg,#ff69b4,#d923b9 80%)",
              color: "#fff",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 18,
              letterSpacing: ".01em"
            }}
          >
            AI-помощник портфолио
            <button
              aria-label="Закрыть чат"
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 28,
                cursor: "pointer",
                marginLeft: 11,
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
          <div
            ref={chatBoxRef}
            style={{
              flex: 1,
              padding: "12px 12px 8px 12px",
              overflowY: "auto",
              background: "#fff",
              scrollBehavior: "smooth"
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  margin: "6px 0",
                  textAlign: m.from === "bot" ? "left" : "right",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: m.from === "bot" ? "#ffe0ef" : "#e7f4ff",
                    color: "#181818",
                    borderRadius: m.from === "bot"
                      ? "0 15px 15px 15px"
                      : "15px 0 15px 15px",
                    padding: "9px 14px",
                    maxWidth: 230,
                    fontSize: 15,
                    lineHeight: 1.38,
                    wordBreak: "break-word",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {pending && (
              <div style={{ color: "#999", fontSize: 14, marginTop: 8 }}>
                AI думает...
              </div>
            )}
          </div>
          <form
            onSubmit={onSend}
            style={{
              display: "flex",
              borderTop: "1px solid #ff69b432",
              padding: "7px 10px",
              background: "#fbf9fb",
              alignItems: "center",
            }}
          >
            <input
              ref={inputRef}
              value={input}
              autoComplete="off"
              onChange={(e) => setInput(e.target.value)}
              placeholder="Задай вопрос о портфолио..."
              disabled={pending}
              maxLength={150}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 15,
                padding: "7px 5px",
              }}
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              style={{
                border: "none",
                background: "linear-gradient(90deg,#ff69b4,#d923b9)",
                color: "#fff",
                fontWeight: 700,
                padding: "9px 18px",
                borderRadius: 16,
                marginLeft: 6,
                fontSize: 15,
                cursor: pending ? "not-allowed" : "pointer",
                opacity: pending || !input.trim() ? 0.7 : 1,
              }}
            >
              ➤
            </button>
          </form>
          <div style={{ fontSize: 12, color: "#d369b9", textAlign: "center", margin: "3px 0 2px" }}>
            Бесплатная версия — лимиты Hugging Face, бывают задержки
          </div>
        </div>
      )}
    </>
  );
});

export default AIChat;
