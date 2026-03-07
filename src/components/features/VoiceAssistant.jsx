import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Send, Bot, User } from 'lucide-react';

const MOCK_CONVERSATIONS = [
    { role: 'assistant', text: "Hi! I'm your Synapse voice tutor. Ask me anything about your current learning topics. For example, try: \"Explain backpropagation in simple terms.\"" },
];

export function VoiceAssistant() {
    const [messages, setMessages] = useState(MOCK_CONVERSATIONS);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (text) => {
        const userMessage = text || input;
        if (!userMessage.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput('');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.slice(-6)
                })
            });

            if (!response.ok) throw new Error('API error');
            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);

            // Text-to-speech
            setIsSpeaking(true);
            setTimeout(() => setIsSpeaking(false), 3000);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Could not connect to AI server. Make sure the backend is running on port 5000.' }]);
        }
    };

    const toggleListening = () => {
        setIsListening(!isListening);
        if (!isListening) {
            // Simulate voice recognition
            setTimeout(() => {
                setInput("Explain backpropagation in simple terms");
                setIsListening(false);
            }, 2000);
        }
    };

    return (
        <div className="glass-panel" style={{ width: '100%', maxWidth: '700px', padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '500px' }}>
            {/* Header */}
            <div style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Bot size={20} color="#00f3ff" />
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>Voice Tutor</h3>
                </div>
                {isSpeaking && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00f3ff', fontSize: '0.85rem' }}>
                        <Volume2 size={16} />
                        <span>Speaking...</span>
                        <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '16px' }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{
                                    width: '3px', borderRadius: '2px', backgroundColor: '#00f3ff',
                                    animation: `wave 0.8s ease-in-out ${i * 0.1}s infinite alternate`,
                                    height: `${4 + Math.random() * 12}px`
                                }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        display: 'flex', gap: '0.75rem',
                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                        alignItems: 'flex-start'
                    }}>
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                            backgroundColor: msg.role === 'user' ? 'rgba(138, 43, 226, 0.2)' : 'rgba(0, 243, 255, 0.2)',
                            border: `1px solid ${msg.role === 'user' ? 'rgba(138, 43, 226, 0.4)' : 'rgba(0, 243, 255, 0.4)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {msg.role === 'user' ? <User size={14} color="#d8b4fe" /> : <Bot size={14} color="#00f3ff" />}
                        </div>
                        <div style={{
                            padding: '0.75rem 1rem', borderRadius: '12px',
                            maxWidth: '80%', fontSize: '0.95rem', lineHeight: 1.6,
                            backgroundColor: msg.role === 'user' ? 'rgba(138, 43, 226, 0.15)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${msg.role === 'user' ? 'rgba(138, 43, 226, 0.3)' : 'rgba(255,255,255,0.08)'}`,
                            color: 'var(--color-text-secondary)',
                            animation: 'fadeIn 0.4s ease-out'
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', gap: '0.75rem', alignItems: 'center'
            }}>
                <button
                    onClick={toggleListening}
                    style={{
                        padding: '0.6rem', borderRadius: '50%',
                        border: `1px solid ${isListening ? '#ff6464' : 'rgba(255,255,255,0.15)'}`,
                        backgroundColor: isListening ? 'rgba(255, 100, 100, 0.2)' : 'rgba(255,255,255,0.05)',
                        color: isListening ? '#ff6464' : 'var(--color-text-secondary)',
                        cursor: 'pointer', display: 'flex',
                        animation: isListening ? 'pulse 1.5s ease infinite' : 'none'
                    }}
                >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isListening ? 'Listening...' : 'Type or use voice...'}
                    style={{
                        flex: 1, padding: '0.75rem 1rem', borderRadius: '8px',
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
                        border: '1px solid rgba(0, 243, 255, 0.4)',
                        backgroundColor: input.trim() ? 'rgba(0, 243, 255, 0.15)' : 'rgba(255,255,255,0.05)',
                        color: input.trim() ? '#00f3ff' : 'rgba(255,255,255,0.2)',
                        cursor: input.trim() ? 'pointer' : 'default', display: 'flex'
                    }}
                >
                    <Send size={18} />
                </button>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(255, 100, 100, 0.4); }
                    50% { box-shadow: 0 0 0 8px rgba(255, 100, 100, 0); }
                }
                @keyframes wave {
                    from { height: 4px; }
                    to { height: 14px; }
                }
            `}</style>
        </div>
    );
}
