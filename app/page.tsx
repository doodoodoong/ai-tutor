"use client";

import { useState, useEffect, useRef } from "react";
import {
  PaperAirplaneIcon,
  ArrowPathIcon,
  PlusIcon,
  PencilIcon,
  CheckIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import AnimatedMessage from "./components/AnimatedMessage";

type ChatSession = {
  id: string;
  title: string;
  messages: Array<{ role: string; content: string }>;
};

export default function Home() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 로컬 스토리지에서 채팅 세션 불러오기
    const savedSessions = localStorage.getItem("chatSessions");
    const savedCurrentSessionId = localStorage.getItem("currentSessionId");

    if (savedSessions) {
      setChatSessions(JSON.parse(savedSessions));
    }
    if (savedCurrentSessionId) {
      setCurrentSessionId(savedCurrentSessionId);
    }
  }, []);

  useEffect(() => {
    // 채팅 세션이 변경될 때마다 로컬 스토리지에 저장
    if (chatSessions.length > 0) {
      localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  useEffect(() => {
    // 현재 세션 ID가 변경될 때마다 로컬 스토리지에 저장
    if (currentSessionId) {
      localStorage.setItem("currentSessionId", currentSessionId);
    }
  }, [currentSessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatSessions]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `새 대화 ${chatSessions.length + 1}`,
      messages: [],
    };
    setChatSessions((prevSessions) => [...prevSessions, newSession]);
    setCurrentSessionId(newSession.id);
  };

  const handleSessionClick = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !currentSessionId) return;

    const newMessage = { role: "user" as const, content: input };
    setInput("");
    setIsLoading(true);

    try {
      const currentSession = chatSessions.find(
        (session) => session.id === currentSessionId
      );
      if (!currentSession) throw new Error("세션을 찾을 수 없습니다.");

      const updatedMessages = [...currentSession.messages, newMessage];

      setChatSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === currentSessionId
            ? { ...session, messages: updatedMessages }
            : session
        )
      );

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error("API 응답 오류");
      }

      const data = await response.json();

      // API 응답 로깅
      console.log("API 응답:", data);

      // API 응답을 문자열로 처리
      let aiReply = "";
      if (typeof data.reply === "string") {
        aiReply = data.reply;
      } else {
        aiReply = JSON.stringify(data.reply);
      }

      // 처리된 응답 로깅
      console.log("처리된 응답:", aiReply);

      setChatSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === currentSessionId
            ? {
                ...session,
                messages: [
                  ...updatedMessages,
                  { role: "assistant", content: aiReply },
                ],
              }
            : session
        )
      );
    } catch (error) {
      console.error("API 호출 오류:", error);
      setChatSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === currentSessionId
            ? {
                ...session,
                messages: [
                  ...session.messages,
                  newMessage,
                  {
                    role: "assistant",
                    content: `오류가 발생했습니다: ${(error as Error).message}`,
                  },
                ],
              }
            : session
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (sessionId: string, title: string) => {
    setEditingSessionId(sessionId);
    setEditingTitle(title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  const handleTitleSubmit = (sessionId: string) => {
    setChatSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === sessionId ? { ...session, title: editingTitle } : session
      )
    );
    setEditingSessionId(null);
  };

  const currentSession = chatSessions.find(
    (session) => session.id === currentSessionId
  );

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <aside className="w-1/4 max-w-xs bg-white border-r border-gray-200 flex flex-col shadow-md">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={createNewSession}
            className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
          >
            <PlusIcon className="h-5 w-5 mr-2" />새 대화 시작
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatSessions.map((session) => (
            <div
              key={session.id}
              className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                currentSessionId === session.id
                  ? "bg-blue-50 border-l-4 border-blue-600"
                  : ""
              }`}
            >
              {editingSessionId === session.id ? (
                <input
                  type="text"
                  value={editingTitle}
                  onChange={handleTitleChange}
                  onBlur={() => handleTitleSubmit(session.id)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleTitleSubmit(session.id)
                  }
                  className="flex-1 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => handleSessionClick(session.id)}
                  className="flex-1 cursor-pointer truncate flex items-center"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-gray-500" />
                  {session.title}
                </span>
              )}
              <button
                onClick={() => handleEditClick(session.id, session.title)}
                className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors"
              >
                {editingSessionId === session.id ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <PencilIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </aside>
      <main className="flex-1 flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {currentSession?.messages.map((message, index) => (
            <AnimatedMessage
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-full p-4 shadow-sm">
                <ArrowPathIcon className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white border-t border-gray-200"
        >
          <div className="flex items-center space-x-2 max-w-4xl mx-auto">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-4 py-2 shadow-sm"
              placeholder="질문을 입력하세요..."
              disabled={isLoading || !currentSessionId}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-full p-2 transition-all duration-200 ease-in-out hover:bg-blue-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !currentSessionId}
            >
              {isLoading ? (
                <ArrowPathIcon className="h-6 w-6 animate-spin" />
              ) : (
                <PaperAirplaneIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
