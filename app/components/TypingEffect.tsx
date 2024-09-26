import React, { useState, useEffect } from "react";

interface TypingEffectProps {
  text: string;
  delay?: number;
  children: (text: string) => React.ReactNode;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, delay = 20, children }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // 새 텍스트가 시작될 때 초기화
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, delay);

    return () => clearInterval(typingInterval);
  }, [text, delay]);

  return <>{children(displayedText)}</>;
};

export default TypingEffect;
