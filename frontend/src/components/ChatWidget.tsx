"use client";

import { useState, useRef, useEffect } from "react";
import { getOrCreateSessionId } from "@/lib/session";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api";

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Xin chào! Tôi là trợ lý AI của GiftCraft Studio 🎁\nTôi có thể giúp bạn tìm quà tặng phù hợp, tư vấn sản phẩm hoặc hỗ trợ đặt hàng. Bạn cần giúp gì hôm nay?",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || streaming) return;
    const userText = input.trim();
    setInput("");

    const history: ChatMessage[] = [
      ...messages,
      { role: "user", content: userText },
    ];
    setMessages([...history, { role: "assistant", content: "" }]);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const sessionId = getOrCreateSessionId();

      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": sessionId,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error("stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === "[DONE]") continue;
          try {
            const evt = JSON.parse(raw);
            if (
              evt.type === "content_block_delta" &&
              evt.delta?.type === "text_delta" &&
              evt.delta?.text
            ) {
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last.role === "assistant") {
                  next[next.length - 1] = {
                    ...last,
                    content: last.content + (evt.delta.text as string),
                  };
                }
                return next;
              });
            }
          } catch {
            // skip malformed JSON lines
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last.role === "assistant" && !last.content) {
            next[next.length - 1] = {
              ...last,
              content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
            };
          }
          return next;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat với GiftCraft AI"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gray-900 text-white shadow-2xl flex items-center justify-center hover:bg-gray-700 transition-colors"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden max-h-[500px]">
          {/* Header */}
          <div className="bg-gray-900 text-white px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-gray-900 font-bold text-sm flex-shrink-0">
              AI
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">GiftCraft AI</div>
              <div className="text-xs text-gray-400">Tư vấn quà tặng</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    msg.role === "user"
                      ? "bg-gray-900 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {msg.content ||
                    (streaming && i === messages.length - 1 ? (
                      <span className="inline-flex items-center gap-1 py-0.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </span>
                    ) : null)}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2 flex-shrink-0">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Nhắn tin tư vấn…"
              rows={1}
              disabled={streaming}
              className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50 max-h-24 overflow-y-auto"
            />
            <button
              onClick={send}
              disabled={!input.trim() || streaming}
              className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 disabled:opacity-40 transition-colors flex-shrink-0"
              aria-label="Gửi"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
