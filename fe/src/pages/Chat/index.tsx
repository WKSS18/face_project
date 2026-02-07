import { useState, useRef, useEffect } from 'react';
import { chatApi } from './service';
import { MarkdownContent } from './MarkdownContent';
import { Button } from '@face-project/ui';
import './index.css';
interface Message {
  role: 'user' | 'assistant';
  content: string;
  thinkingContent?: string;
}
const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = messageListRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'assistant', content: '', thinkingContent: '' }]);
    let fullResponse = '';
    let fullThinking = '';
    await chatApi(
      messages.concat([{ role: 'user', content: userMessage }]),
      (chunk) => {
        fullResponse += chunk;
        setMessages((prev) => {
          const next = [...prev];
          const last = next.length - 1;
          if (last >= 0) next[last] = { role: 'assistant', content: fullResponse, thinkingContent: next[last].thinkingContent ?? '' };
          return next;
        });
      },
      () => setIsLoading(false),
      (chunk) => {
        fullThinking += chunk;
        setMessages((prev) => {
          const next = [...prev];
          const last = next.length - 1;
          if (last >= 0) next[last] = { ...next[last], thinkingContent: fullThinking };
          return next;
        });
      },
      email.trim() || undefined
    );
  };
  return (
    <div className="chat-container">
      <div className="message-list" ref={messageListRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.role === 'assistant' && msg.thinkingContent && (
              <div className="thinking-block">
                <span className="thinking-label">思考过程</span>
                <pre className="thinking-content">{msg.thinkingContent}</pre>
              </div>
            )}
            <div className="bubble">
              {msg.role === 'assistant' ? (
                <MarkdownContent content={msg.content || ''} />
              ) : (
                <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </pre>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="typing-indicator">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        )}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="和 GLM-4.7 对话..."
          disabled={isLoading}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="可选：接收结果的邮箱"
          disabled={isLoading}
          style={{ marginLeft: 8 }}
        />
        <Button size='lg' variant="danger" onClick={handleSend} disabled={isLoading}>发送</Button>
      </div>
    </div>
  );
};
export default Chat;