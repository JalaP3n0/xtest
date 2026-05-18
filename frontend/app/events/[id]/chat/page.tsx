"use client";

import { useEffect, useState, useRef, use } from "react";
import { io, Socket } from "socket.io-client";
import { Header } from "@/components/Header";
import { authService } from "@/services/auth.service";

interface Message {
  eventId: string;
  content: string;
  senderId: string;
  senderName: string;
}

export default function EventChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001", {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to chat");
      socket.emit("joinEvent", eventId);
    });

    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [eventId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current) return;

    const msg: Message = {
      eventId,
      content: input,
      senderId: user?.id || "unknown",
      senderName: user?.name || "User",
    };

    socketRef.current.emit("sendMessage", msg);
    setInput("");
  };

  return (
    <main className="app-shell" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <div className="content-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingBottom: '20px' }}>
        <header style={{ marginBottom: '32px' }}>
          <p className="eyebrow">Real-time Operations</p>
          <h1 className="page-title compact" style={{ fontSize: '1.75rem' }}>Event Channel: <span className="gold-text">{eventId}</span></h1>
        </header>
        
        <div className="chat-window glass" style={{ 
          flex: 1, 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.01)'
        }}>
          <div className="messages-area" style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {messages.length === 0 && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: '0.9rem', letterSpacing: '1px' }}>SECURE CHANNEL INITIALIZED.<br/>AWAITING MESSAGES...</p>
              </div>
            )}
            {messages.map((msg, i) => {
              const isMe = msg.senderId === user?.id;
              return (
                <div key={i} style={{ 
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {msg.senderName}
                  </div>
                  <div style={{ 
                    background: isMe ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.05)',
                    color: isMe ? 'var(--accent-strong)' : 'var(--ink)',
                    padding: '14px 20px',
                    borderRadius: '16px',
                    borderTopRightRadius: isMe ? '2px' : '16px',
                    borderTopLeftRadius: isMe ? '16px' : '2px',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    boxShadow: isMe ? '0 4px 15px rgba(212, 175, 55, 0.2)' : 'none',
                    border: isMe ? 'none' : '1px solid rgba(255,255,255,0.05)'
                  }}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={sendMessage} style={{ padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.02)' }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Compose secure message..."
                style={{ height: '54px' }}
              />
            </div>
            <button type="submit" className="button" style={{ width: '120px', height: '54px' }}>
              SEND
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
