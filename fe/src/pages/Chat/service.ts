export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export const chatApi = async (
    messages: ChatMessage[],
    onMessage: (content: string) => void,
    onFinish: () => void,
    onThinking?: (chunk: string) => void,
    email?: string,
  ) => {
    try {
      const response = await fetch('http://localhost:3000/chat/agent-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages,
          model: 'glm-4.7', // 指定模型
          temperature: 0.7,
          email,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      if (!reader) return;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        // 按行分割
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 保留最后不完整的行
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine.startsWith('data: ')) continue;
          const dataStr = trimmedLine.replace('data: ', '');
          // 检查结束标记
          if (dataStr === '[DONE]') {
            onFinish();
            return;
          }
          try {
            const data = JSON.parse(dataStr);
            const delta = data.choices?.[0]?.delta;
            if (!delta) continue;
            // 正式回复内容
            const content = delta.content || '';
            if (content) onMessage(content);
            // 思考过程（智谱 reasoning_content）
            const reasoning = delta.reasoning_content || '';
            if (reasoning && onThinking) onThinking(reasoning);
          } catch (e) {
            console.warn('解析 JSON 失败:', dataStr);
          }
        }
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };