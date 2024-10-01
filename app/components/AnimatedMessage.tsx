import React, { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

interface AnimatedMessageProps {
  role: string;
  content: string;
  isNew: boolean;
}

const AnimatedMessage: React.FC<AnimatedMessageProps> = ({
  role,
  content,
  isNew,
}) => {
  const messageRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line
  const [shouldAnimate, setShouldAnimate] = useState(isNew);
  useEffect(() => {
    if (messageRef.current && isNew) {
      messageRef.current.style.opacity = "0";
      messageRef.current.style.transform = "translateY(20px)";

      setTimeout(() => {
        if (messageRef.current) {
          messageRef.current.style.opacity = "1";
          messageRef.current.style.transform = "translateY(0)";
        }
      }, 10);
    }
  }, [isNew]);

  return (
    <div
      ref={messageRef}
      className={`flex ${
        role === "user" ? "justify-end" : "justify-start"
      } mb-4 transition-all duration-300 ease-in-out`}
    >
      <div
        className={`max-w-3/4 p-4 rounded-lg ${
          role === "user"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {shouldAnimate ? (
          <ReactMarkdown
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={
              {
                // 마크다운 관련 컴포넌트 삭제됨
              }
            }
          >
            {content}
          </ReactMarkdown>
        ) : (
          <ReactMarkdown
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={
              {
                // 마크다운 관련 컴포넌트 삭제됨
              }
            }
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default AnimatedMessage;
