"use client";
import { useState, useRef, useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type Message = {
    role: "user" | "bot";
    text: string;
};

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "bot",
            text: "👋 Hello! I'm your Poshak Fabrics assistant. Ask me about our products and I'll find the perfect match for you!",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // Focus input when chat opens
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 100);
    }, [open]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        setMessages((prev) => [...prev, { role: "user", text }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(`${BACKEND_URL}/api/chatbot/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
            });
            const data = await res.json();
            setMessages((prev) => [...prev, { role: "bot", text: data.text }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "Sorry, something went wrong. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <>
            {/* Custom keyframe animations — only these need a <style> tag */}
            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(16px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                }
                @keyframes pulseRing {
                    0%   { transform: scale(1);    opacity: 0.65; }
                    100% { transform: scale(1.6);  opacity: 0;    }
                }
                @keyframes dotBounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40%           { transform: translateY(-6px); }
                }
                .chat-slide-up { animation: slideUp 0.22s ease forwards; }
                .pulse-ring    { animation: pulseRing 1.8s ease-out infinite; }
                .typing-dot    { animation: dotBounce 1.2s infinite ease-in-out; }
                .typing-dot:nth-child(2) { animation-delay: 0.15s; }
                .typing-dot:nth-child(3) { animation-delay: 0.30s; }
                .chat-messages::-webkit-scrollbar       { width: 4px; }
                .chat-messages::-webkit-scrollbar-track { background: transparent; }
                .chat-messages::-webkit-scrollbar-thumb { background: #d4b896; border-radius: 4px; }
            `}</style>

            {/* ── Floating toggle button ───────────────────────────── */}
            <div className="fixed bottom-6 right-5 sm:bottom-7 sm:right-7 z-[9999]">
                {/* Pulse ring (visible only when closed) */}
                {!open && (
                    <span className="pulse-ring absolute inset-0 rounded-full border-[3px] border-[#b07d4a] pointer-events-none" />
                )}

                <button
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Open Poshak Fabrics chatbot"
                    className="relative z-10 w-14 h-14 sm:w-[58px] sm:h-[58px] rounded-full
                               bg-gradient-to-br from-[#c9883a] to-[#7a4a1e]
                               flex items-center justify-center border-0 cursor-pointer
                               shadow-[0_6px_24px_rgba(122,74,30,0.45)]
                               transition-all duration-200
                               hover:scale-110 hover:shadow-[0_8px_28px_rgba(122,74,30,0.6)]
                               active:scale-95"
                >
                    {open ? (
                        /* X icon */
                        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    ) : (
                        /* Chat bubble icon */
                        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* ── Chat window ──────────────────────────────────────── */}
            {open && (
                <div className="chat-slide-up fixed z-[9998] flex flex-col overflow-hidden font-sans border border-[rgba(201,136,58,0.18)] shadow-[0_20px_60px_rgba(0,0,0,0.22)] rounded-2xl bottom-[88px] left-3 right-3 max-h-[75vh] sm:left-auto sm:right-6 sm:w-[360px] sm:max-h-[520px] sm:bottom-[100px] md:w-[390px]">

                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-3 sm:px-[18px] sm:py-[14px] bg-gradient-to-br from-[#c9883a] to-[#7a4a1e] shrink-0">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg shrink-0">
                            🧵
                        </div>
                        <div>
                            <p className="text-white font-bold text-[15px] leading-tight">Poshak Assistant</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-[7px] h-[7px] rounded-full bg-[#6dffa0] inline-block" />
                                <span className="text-white/75 text-xs">Online</span>
                            </div>
                        </div>
                    </div>

                    {/* Messages area */}
                    <div className="chat-messages flex-1 overflow-y-auto px-3.5 py-4 sm:px-[14px] bg-[#fdf8f3] flex flex-col gap-3">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`
                                        max-w-[82%] sm:max-w-[80%] px-[14px] py-[10px]
                                        text-[13.5px] leading-[1.55] whitespace-pre-wrap break-words
                                        ${msg.role === "user"
                                            ? "rounded-[18px_18px_4px_18px] bg-gradient-to-br from-[#c9883a] to-[#7a4a1e] text-white shadow-[0_3px_12px_rgba(122,74,30,0.28)]"
                                            : "rounded-[18px_18px_18px_4px] bg-white text-[#3d2b1a] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                                        }
                                    `}
                                >
                                    {/* Auto-linkify URLs */}
                                    {msg.text.split(/(https?:\/\/[^\s]+)/g).map((part, j) =>
                                        /^https?:\/\//.test(part) ? (
                                            <a
                                                key={j}
                                                href={part}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`underline font-semibold break-all ${msg.role === "user" ? "text-[#ffe0b2]" : "text-[#c9883a]"}`}
                                            >
                                                {part}
                                            </a>
                                        ) : (
                                            part
                                        )
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-[18px_18px_18px_4px] px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex gap-[5px] items-center">
                                    {[0, 1, 2].map((n) => (
                                        <span
                                            key={n}
                                            className="typing-dot block w-[7px] h-[7px] rounded-full bg-[#b07d4a]"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input bar */}
                    <div className="flex items-center gap-2 px-3.5 py-3 sm:px-[14px] bg-white border-t border-[#f0e0cc] shrink-0">
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about our products..."
                            disabled={loading}
                            className="
                                flex-1 rounded-full px-4 py-[9px] text-[13.5px]
                                bg-[#fdf8f3] text-[#3d2b1a]
                                border border-[#e8d0b0]
                                outline-none transition-colors duration-200
                                focus:border-[#c9883a]
                                disabled:opacity-60 disabled:cursor-not-allowed
                            "
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            aria-label="Send message"
                            className={`
                                w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                transition-all duration-200 border-0
                                ${loading || !input.trim()
                                    ? "bg-[#e0cbb5] cursor-not-allowed"
                                    : "bg-gradient-to-br from-[#c9883a] to-[#7a4a1e] cursor-pointer shadow-[0_3px_10px_rgba(122,74,30,0.35)] hover:scale-[1.08] active:scale-95"
                                }
                            `}
                        >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}