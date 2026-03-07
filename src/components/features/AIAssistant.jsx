import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Bot, User, Sparkles, BookOpen } from 'lucide-react';

const INITIAL_MESSAGE = {
    role: 'assistant',
    text: "Hey! I'm Synapse AI — your personal learning assistant. You can type or use your voice to ask me anything. Try: \"Explain gradient descent\" or \"Help me understand React hooks.\""
};

const QUICK_PROMPTS = [
    "Explain backpropagation",
    "What are React hooks?",
    "Gradient descent basics",
    "TCP vs UDP",
];

export function AIAssistant() {
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (text) => {
        const userMessage = text || input;
        if (!userMessage.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setIsTyping(true);

        try {
            const savedAI = localStorage.getItem('synapse_ai_settings');
            const aiSettings = savedAI ? JSON.parse(savedAI) : { useOllama: true, useBedrock: false };

            const chatMessages = [
                ...messages.slice(-6),
                { role: 'user', text: userMessage }
            ];

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: chatMessages,
                    aiSettings
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || 'API error');
            }
            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);

            if (voiceEnabled) {
                setIsSpeaking(true);
                setTimeout(() => setIsSpeaking(false), 3000);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', text: `Error: ${error.message}` }]);
        } finally {
            setIsTyping(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            setIsListening(false);
            return;
        }

        setIsListening(true);
        // Simulate voice recognition filling the input
        setTimeout(() => {
            const prompts = ["Explain backpropagation in simple terms", "What are React hooks?", "How does gradient descent work?"];
            setInput(prompts[Math.floor(Math.random() * prompts.length)]);
            setIsListening(false);
        }, 2000);
    };

    return (
        <div className="glass-panel" style={{
            width: '100%', maxWidth: '750px', padding: '0', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', height: '580px'
        }}>
            {/* Header */}
            <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'linear-gradient(135deg, #00f3ff, #8a2be2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Sparkles size={16} color="white" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>Synapse AI</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                            {isTyping ? 'Thinking...' : isSpeaking ? 'Speaking...' : 'Online'}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Speaking indicator */}
                    {isSpeaking && (
                        <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '18px', marginRight: '0.5rem' }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} style={{
                                    width: '3px', borderRadius: '2px', backgroundColor: '#00f3ff',
                                    animation: `wave 0.6s ease-in-out ${i * 0.08}s infinite alternate`,
                                }} />
                            ))}
                        </div>
                    )}
                    {/* Voice toggle */}
                    <button
                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                        title={voiceEnabled ? 'Disable voice responses' : 'Enable voice responses'}
                        style={{
                            padding: '0.4rem', borderRadius: '6px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backgroundColor: voiceEnabled ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                            color: voiceEnabled ? '#00f3ff' : 'rgba(255,255,255,0.3)',
                            cursor: 'pointer', display: 'flex'
                        }}
                    >
                        {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1, overflowY: 'auto', padding: '1.25rem',
                display: 'flex', flexDirection: 'column', gap: '1rem'
            }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        display: 'flex', gap: '0.6rem',
                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                        alignItems: 'flex-start',
                        animation: 'fadeSlide 0.4s ease-out'
                    }}>
                        <div style={{
                            width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                            backgroundColor: msg.role === 'user' ? 'rgba(138, 43, 226, 0.2)' : 'rgba(0, 243, 255, 0.15)',
                            border: `1px solid ${msg.role === 'user' ? 'rgba(138, 43, 226, 0.4)' : 'rgba(0, 243, 255, 0.3)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {msg.role === 'user' ? <User size={14} color="#d8b4fe" /> : <Bot size={14} color="#00f3ff" />}
                        </div>
                        <div style={{
                            padding: '0.85rem 1rem', borderRadius: '14px',
                            maxWidth: '78%', fontSize: '0.92rem', lineHeight: 1.65,
                            backgroundColor: msg.role === 'user'
                                ? 'rgba(138, 43, 226, 0.12)'
                                : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${msg.role === 'user'
                                ? 'rgba(138, 43, 226, 0.25)'
                                : 'rgba(255,255,255,0.06)'}`,
                            color: 'var(--color-text-secondary)',
                            whiteSpace: 'pre-line'
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                        <div style={{
                            width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                            backgroundColor: 'rgba(0, 243, 255, 0.15)',
                            border: '1px solid rgba(0, 243, 255, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Bot size={14} color="#00f3ff" />
                        </div>
                        <div style={{
                            padding: '0.85rem 1.2rem', borderRadius: '14px',
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex', gap: '4px'
                        }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{
                                    width: '6px', height: '6px', borderRadius: '50%',
                                    backgroundColor: '#00f3ff',
                                    animation: `bounce 1s ease infinite ${i * 0.15}s`
                                }} />
                            ))}
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 1 && (
                <div style={{
                    padding: '0 1.25rem 0.75rem',
                    display: 'flex', gap: '0.5rem', flexWrap: 'wrap'
                }}>
                    {QUICK_PROMPTS.map((prompt, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(prompt)}
                            style={{
                                padding: '0.4rem 0.75rem', borderRadius: '20px',
                                border: '1px solid rgba(255,255,255,0.12)',
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                color: 'var(--color-text-secondary)',
                                cursor: 'pointer', fontSize: '0.8rem',
                                transition: 'all 0.2s ease',
                                display: 'flex', alignItems: 'center', gap: '0.35rem'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(0, 243, 255, 0.4)';
                                e.currentTarget.style.color = '#00f3ff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                                e.currentTarget.style.color = 'var(--color-text-secondary)';
                            }}
                        >
                            <BookOpen size={12} /> {prompt}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div style={{
                padding: '0.75rem 1.25rem',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', gap: '0.6rem', alignItems: 'center'
            }}>
                <button
                    onClick={toggleListening}
                    style={{
                        padding: '0.6rem', borderRadius: '50%',
                        border: `1px solid ${isListening ? '#ff6464' : 'rgba(255,255,255,0.12)'}`,
                        backgroundColor: isListening ? 'rgba(255, 100, 100, 0.15)' : 'rgba(255,255,255,0.04)',
                        color: isListening ? '#ff6464' : 'var(--color-text-secondary)',
                        cursor: 'pointer', display: 'flex',
                        animation: isListening ? 'pulse 1.5s ease infinite' : 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isListening ? '🎤 Listening...' : 'Ask anything...'}
                    style={{
                        flex: 1, padding: '0.7rem 1rem', borderRadius: '10px',
                        backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white', fontSize: '0.95rem', outline: 'none',
                        transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(0, 243, 255, 0.4)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    style={{
                        padding: '0.6rem', borderRadius: '50%',
                        border: `1px solid ${input.trim() ? 'rgba(0, 243, 255, 0.4)' : 'rgba(255,255,255,0.1)'}`,
                        backgroundColor: input.trim() ? 'rgba(0, 243, 255, 0.12)' : 'rgba(255,255,255,0.04)',
                        color: input.trim() ? '#00f3ff' : 'rgba(255,255,255,0.15)',
                        cursor: input.trim() ? 'pointer' : 'default', display: 'flex',
                        transition: 'all 0.2s'
                    }}
                >
                    <Send size={18} />
                </button>
            </div>

            <style>{`
                @keyframes fadeSlide {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(255, 100, 100, 0.3); }
                    50% { box-shadow: 0 0 0 8px rgba(255, 100, 100, 0); }
                }
                @keyframes wave {
                    from { height: 4px; }
                    to { height: 16px; }
                }
                @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-6px); }
                }
            `}</style>
        </div>
    );
}
