import React, { useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import TypingEffect from "./TypingEffect";

interface AnimatedMessageProps {
  role: string;
  content: string;
}

const AnimatedMessage: React.FC<AnimatedMessageProps> = ({ role, content }) => {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.style.opacity = "0";
      messageRef.current.style.transform = "translateY(20px)";

      setTimeout(() => {
        if (messageRef.current) {
          messageRef.current.style.opacity = "1";
          messageRef.current.style.transform = "translateY(0)";
        }
      }, 10);
    }
  }, []);

  return (
    <div
      ref={messageRef}
      className={`flex ${
        role === "user" ? "justify-end" : "justify-start"
      } transition-all duration-300 ease-out`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-4 shadow-sm ${
          role === "user"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {role === "assistant" ? (
          <TypingEffect text={content}>
            {(text) => (
              <ReactMarkdown
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <pre className={`bg-gray-800 text-white p-2 rounded ${className}`}>
                        <code className={`language-${match[1]}`} {...props}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code className={`bg-gray-200 text-gray-800 px-1 rounded ${className}`} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {text}
              </ReactMarkdown>
            )}
          </TypingEffect>
        ) : (
          <ReactMarkdown
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <pre className={`bg-gray-800 text-white p-2 rounded ${className}`}>
                    <code className={`language-${match[1]}`} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className={`bg-gray-200 text-gray-800 px-1 rounded ${className}`} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default AnimatedMessage;
