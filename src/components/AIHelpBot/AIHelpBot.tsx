import { FormEvent, useMemo, useRef, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import styles from './AIHelpBot.module.css';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export function AIHelpBot() {
  const { state } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'What step are you stuck on? I can give you a hint first.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const appContext = useMemo(() => {
    const route = state.selectedRoute;

    if (!route) {
      return [
        'No route is currently selected.',
        `Current mode filter: ${state.modeFilter}.`,
        `Current search query: ${state.searchQuery || 'none'}.`,
      ].join('\n');
    }

    const terminals = route.shapes.map((shape) => shape.head).filter(Boolean).join(' to ');

    return [
      `Selected route: ${route.code} - ${route.name}.`,
      `Mode: ${route.mode}.`,
      `Zone: ${route.zone}.`,
      `Headway seconds: ${route.headwaySecs ?? 'unknown'}.`,
      `Terminals: ${terminals || 'unknown'}.`,
      `Current mode filter: ${state.modeFilter}.`,
      `Current search query: ${state.searchQuery || 'none'}.`,
    ].join('\n');
  }, [state.modeFilter, state.searchQuery, state.selectedRoute]);

  function openBot() {
    setIsOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = input.trim();
    if (!question || isLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: question }];
    setMessages(nextMessages);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          context: appContext,
          history: messages,
        }),
      });

      const data = await response.json() as { answer?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? 'The AI Help Bot could not respond.');
      }

      setMessages([...nextMessages, {
        role: 'assistant',
        content: data.answer ?? 'I could not generate a response.',
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The AI Help Bot could not respond.');
      setMessages(nextMessages);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.root}>
      {isOpen && (
        <section className={styles.panel} aria-label="AI Help Bot">
          <header className={styles.header}>
            <div>
              <h2 className={styles.title}>AI Help Bot</h2>
              <p className={styles.provider}>Powered by Qwen</p>
            </div>
            <button
              className={styles.iconButton}
              type="button"
              aria-label="Close AI Help Bot"
              onClick={() => setIsOpen(false)}
            >
              x
            </button>
          </header>

          <div className={styles.messages} aria-live="polite">
            {messages.map((message, index) => (
              <div
                className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
                key={`${message.role}-${index}`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                Thinking through the step...
              </div>
            )}
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              className={styles.input}
              value={input}
              placeholder="Ask for a hint..."
              rows={3}
              onChange={(event) => setInput(event.target.value)}
            />
            <button className={styles.sendButton} type="submit" disabled={isLoading || !input.trim()}>
              Send
            </button>
          </form>
        </section>
      )}

      <button
        className={styles.launchButton}
        type="button"
        aria-expanded={isOpen}
        aria-label="Open AI Help Bot"
        onClick={openBot}
      >
        AI Help
      </button>
    </div>
  );
}
