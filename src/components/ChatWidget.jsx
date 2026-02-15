import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import "./ChatWidget.css";

const N8N_WEBHOOK_URL =
  "https://lamviecthongminh.com/webhook/a2ff836a-862e-4a05-bf60-34a75009b3c6";

/* ================= SESSION ================= */

function getSessionId() {
  let session = localStorage.getItem("chat_session_id");
  if (!session) {
    session = crypto.randomUUID();
    localStorage.setItem("chat_session_id", session);
  }
  return session;
}

export default function ChatWidget({ hasCart }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartHeight, setCartHeight] = useState(0);

  const sessionIdRef = useRef(getSessionId());
  const isMounted = useRef(true);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);

  /* ================= CLEANUP ================= */

  useEffect(() => {
    return () => {
      isMounted.current = false;
      abortControllerRef.current?.abort();
      clearTimeout(timeoutRef.current);
    };
  }, []);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ================= LOAD MESSAGES ================= */

  useEffect(() => {
    if (!open) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("id, role, content, created_at")
        .eq("session_id", sessionIdRef.current)
        .order("created_at", { ascending: true })
        .limit(100);

      if (!error && data && isMounted.current) {
        setMessages(data);
      }
    };

    loadMessages();
  }, [open]);

  /* ================= REALTIME LISTENER ================= */

  useEffect(() => {
    if (!open) return;

    const channel = supabase
      .channel("chat-" + sessionIdRef.current)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${sessionIdRef.current}`,
        },
        (payload) => {
          const newMessage = payload.new;

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });

          if (newMessage.role === "ai") {
            setLoading(false);
            clearTimeout(timeoutRef.current);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [open]);

  /* ================= SEND MESSAGE ================= */

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput("");
    setLoading(true);

    try {
      // 1️⃣ Insert user message
      const { error } = await supabase.from("chat_messages").insert([
        {
          session_id: sessionIdRef.current,
          role: "user",
          content: message,
        },
      ]);

      if (error) throw error;

      // 2️⃣ Call webhook
      abortControllerRef.current = new AbortController();

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          session_id: sessionIdRef.current,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Webhook failed");
      }

      const data = await response.json();

      // 3️⃣ Fallback nếu n8n không insert AI
      if (data?.reply) {
        timeoutRef.current = setTimeout(async () => {
          if (!isMounted.current) return;

          const { data: latest } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("session_id", sessionIdRef.current)
            .eq("role", "ai")
            .order("created_at", { ascending: false })
            .limit(1);

          const alreadyInserted =
            latest?.length > 0 &&
            latest[0].content === data.reply;

          if (!alreadyInserted) {
            await supabase.from("chat_messages").insert([
              {
                session_id: sessionIdRef.current,
                role: "ai",
                content: data.reply,
              },
            ]);
          }

          setLoading(false);
        }, 4000);
      }
    } catch (err) {
      console.error("Send error:", err);

      if (isMounted.current) {
        setLoading(false);

        await supabase.from("chat_messages").insert([
          {
            session_id: sessionIdRef.current,
            role: "ai",
            content:
              "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.",
          },
        ]);
      }
    }
  }, [input, loading]);

  /* ================= CART HEIGHT CALC ================= */

  useEffect(() => {
  const updateCartHeight = () => {
    const cart = document.querySelector(".checkout-bar");

    if (cart) {
      setCartHeight(cart.offsetHeight);
    } else {
      setCartHeight(0);
    }
  };

  updateCartHeight();

  window.addEventListener("resize", updateCartHeight);

  const observer = new MutationObserver(updateCartHeight);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => {
    window.removeEventListener("resize", updateCartHeight);
    observer.disconnect();
  };
}, [hasCart]);


  const toggleBottom = hasCart ? cartHeight + 20 : 20;
  const containerBottom = hasCart ? cartHeight + 90 : 90;

  /* ================= UI ================= */

  return (
    <>
      {/* ===== CHAT TOGGLE ===== */}
      <div
        className="chat-toggle"
        style={{
          bottom: `${toggleBottom}px`,
          transition: "bottom 0.3s ease",
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        💬
      </div>

      {/* ===== CHAT WINDOW ===== */}
      {open && (
        <div
          className="chat-container"
          style={{
            bottom: `${containerBottom}px`,
            transition: "bottom 0.3s ease",
          }}
        >
          <div className="chat-header">
            <span>668Mart AI</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-bubble ai">
                Xin chào 👋 Tôi có thể giúp gì cho bạn?
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble ${
                  msg.role === "user" ? "user" : "ai"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble ai">
                Đang trả lời...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
            />
            <button onClick={sendMessage} disabled={loading}>
              {loading ? "..." : "Gửi"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
