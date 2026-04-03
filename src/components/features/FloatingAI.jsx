import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, MicOff, Volume2, VolumeX, MonitorSmartphone, User, Bot } from 'lucide-react';

// Section descriptions for screen-reading
const SECTION_EXPLANATIONS = {
    roadmap: "You're looking at the **Roadmap Generator**. Here's how it works:\n\n1. **Enter a learning goal** in the text box — like \"Learn Python\" or \"Master Machine Learning\"\n2. **Click Generate Roadmap** — the AI will create a month-by-month, week-by-week plan\n3. Each milestone shows the topics you need to cover in order\n\nThe roadmap adapts to your pace. Want me to explain any part in more detail?",
    schedule: "This is your **Learning Schedule**. You can switch between:\n\n• **Time-Based** — shows your day hour by hour with study blocks\n• **Task-Based** — a checklist of learning goals with priorities\n\nTap any empty slot to add a study block, or check off completed tasks.",
    focus: "You're in **Focus Mode** — a Pomodoro-style timer:\n\n1. **Focus** (25 min) → deep work with no distractions\n2. **Short Break** (5 min) → stretch and rest\n3. **Long Break** (15 min) → after 4 focus sessions\n\nHit Start to begin. The ring fills as time progresses.",
    visual: "These are **Visual Summaries** — complex topics broken into step-by-step flows.\n\nPick a concept (like Neural Networks or React Lifecycle), then tap through each step at your own pace. Great for visual learners!",
    errors: "This is the **Neural Error Analysis** section.\n\nPaste your code or solution attempt, and the AI identifies:\n• The exact mistake\n• The concept gap behind it\n• A suggested correction\n\nIt teaches you WHY you're wrong, not just what's right.",
    photo: "**Photo Review** lets you upload handwritten work or diagrams.\n\nThe AI scans your image and gives feedback on:\n• What you did well\n• What's missing\n• How to improve\n\nGreat for checking math solutions or diagrams before submitting.",
    collab: "**Learn Together** is a peer Q&A space.\n\nBrowse questions, read AI-generated answers, and see peer contributions. The best insights from other learners rise to the top via upvotes."
};

export function FloatingAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hi! I'm Synapse AI 🤖 your learning buddy\n\nI can help you learn — type a question, use voice 🎤, or tap the 🖥️ button to have me explain what's on your screen." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const messagesEndRef = useRef(null);

    // Drag state
    const [pos, setPos] = useState({ x: window.innerWidth - 92, y: window.innerHeight - 92 });
    const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, startPosX: 0, startPosY: 0, moved: false });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Drag handlers
    const handlePointerDown = (e) => {
        e.preventDefault();
        dragRef.current = {
            isDragging: true,
            startX: e.clientX,
            startY: e.clientY,
            startPosX: pos.x,
            startPosY: pos.y,
            moved: false
        };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!dragRef.current.isDragging) return;
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            dragRef.current.moved = true;
        }
        const newX = Math.min(Math.max(0, dragRef.current.startPosX + dx), window.innerWidth - 60);
        const newY = Math.min(Math.max(0, dragRef.current.startPosY + dy), window.innerHeight - 60);
        setPos({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
        const wasDrag = dragRef.current.moved;
        dragRef.current.isDragging = false;
        dragRef.current.moved = false;
        if (!wasDrag) {
            setIsOpen(prev => !prev);
        }
    };

    // Send message to backend
    const sendMessage = async (text) => {
        const userMessage = text || input;
        if (!userMessage.trim() || isLoading) return;

        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            const savedAI = localStorage.getItem('synapse_ai_settings');
            const aiSettings = savedAI ? JSON.parse(savedAI) : { useOllama: false, useBedrock: true };

            const chatMessages = [
                ...messages.slice(-6),
                { role: 'user', text: userMessage }
            ];

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: chatMessages, aiSettings })
            });

            if (!response.ok) throw new Error('API error');
            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', text: `Sorry, couldn't get a response. (${error.message})` }]);
        }
        setIsLoading(false);
    };

    // Screen reader — detect current section and explain it
    const handleScreenRead = () => {
        const sections = ['roadmap', 'schedule', 'focus', 'visual', 'errors', 'photo', 'collab'];
        let currentSection = 'roadmap';

        for (const id of sections) {
            const el = document.getElementById(id);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
                    currentSection = id;
                }
            }
        }

        const explanation = SECTION_EXPLANATIONS[currentSection] || "I can see you're exploring the app. Ask me anything!";
        const sectionName = currentSection.charAt(0).toUpperCase() + currentSection.slice(1);

        setMessages(prev => [
            ...prev,
            { role: 'user', text: `Help me understand: "${sectionName}"` },
            { role: 'assistant', text: explanation }
        ]);
    };

    // Voice recognition
    const toggleListening = () => {
        if (isListening) {
            setIsListening(false);
            return;
        }

        setIsListening(true);

        // Use Web Speech API if available
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };

            recognition.onerror = () => {
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.start();
        } else {
            // Fallback
            setTimeout(() => {
                setInput("Explain this concept to me");
                setIsListening(false);
            }, 2000);
        }
    };

    return (
        <>
            {/* Floating Robot Icon — draggable */}
            <button
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{
                    position: 'fixed',
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00f3ff, #8a2be2)',
                    border: 'none',
                    cursor: dragRef.current.isDragging ? 'grabbing' : 'grab',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    boxShadow: '0 4px 25px rgba(0, 243, 255, 0.35)',
                    transition: dragRef.current.isDragging ? 'none' : 'box-shadow 0.3s',
                    transform: isOpen ? 'rotate(0deg)' : 'rotate(-12deg)',
                    animation: (isOpen || dragRef.current.isDragging) ? 'none' : 'robotFloat 3s ease-in-out infinite',
                    touchAction: 'none',
                    userSelect: 'none'
                }}
            >
                {isOpen
                    ? <X size={24} color="white" />
                    : <Bot size={28} color="rgba(255,255,255,0.95)" />
                }
            </button>

            {/* Chat Panel — positioned relative to bot button */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    left: `${Math.min(pos.x - 340, window.innerWidth - 420)}px`,
                    top: `${Math.max(10, pos.y - 550)}px`,
                    width: '400px',
                    height: '540px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(10, 10, 20, 0.96)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 999,
                    boxShadow: '0 10px 50px rgba(0,0,0,0.6)',
                    animation: 'chatSlideUp 0.3s ease-out',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '0.9rem 1.25rem',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                            <div style={{
                                width: '34px', height: '34px', borderRadius: '10px',
                                background: 'linear-gradient(135deg, #00f3ff, #8a2be2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Bot size={18} color="rgba(255,255,255,0.9)" />
                            </div>
                            <div>
                                <div style={{ color: 'white', fontWeight: '600', fontSize: '0.95rem' }}>Synapse AI</div>
                                <div style={{ color: '#00f3ff', fontSize: '0.7rem' }}>● Online</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {/* Voice toggle */}
                            <button
                                onClick={() => setVoiceEnabled(!voiceEnabled)}
                                title={voiceEnabled ? 'Mute voice' : 'Enable voice'}
                                style={{
                                    padding: '0.35rem', borderRadius: '6px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    backgroundColor: voiceEnabled ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255,255,255,0.04)',
                                    color: voiceEnabled ? '#00f3ff' : 'rgba(255,255,255,0.3)',
                                    cursor: 'pointer', display: 'flex'
                                }}
                            >
                                {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                            </button>

                            {/* Screen reader */}
                            <button
                                onClick={handleScreenRead}
                                title="Explain current screen"
                                style={{
                                    padding: '0.35rem', borderRadius: '6px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    backgroundColor: 'rgba(138, 43, 226, 0.1)',
                                    color: '#d8b4fe',
                                    cursor: 'pointer', display: 'flex'
                                }}
                            >
                                <MonitorSmartphone size={14} />
                            </button>

                            {/* Close */}
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    padding: '0.35rem', borderRadius: '6px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    backgroundColor: 'rgba(255,255,255,0.04)',
                                    color: 'var(--color-text-secondary)',
                                    cursor: 'pointer', display: 'flex'
                                }}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1, padding: '1rem', overflowY: 'auto',
                        display: 'flex', flexDirection: 'column', gap: '0.75rem'
                    }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                display: 'flex', gap: '0.6rem',
                                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                                alignItems: 'flex-start'
                            }}>
                                {/* Avatar */}
                                <div style={{
                                    width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                                    backgroundColor: msg.role === 'user' ? 'rgba(138, 43, 226, 0.2)' : 'rgba(0, 243, 255, 0.15)',
                                    border: `1px solid ${msg.role === 'user' ? 'rgba(138, 43, 226, 0.4)' : 'rgba(0, 243, 255, 0.3)'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.7rem'
                                }}>
                                    {msg.role === 'user' ? <User size={13} color="#d8b4fe" /> : <Bot size={15} color="#00f3ff" />}
                                </div>
                                {/* Bubble */}
                                <div style={{
                                    maxWidth: '80%',
                                    padding: '0.65rem 0.9rem',
                                    borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                                    backgroundColor: msg.role === 'user' ? 'rgba(138, 43, 226, 0.12)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${msg.role === 'user' ? 'rgba(138, 43, 226, 0.25)' : 'rgba(255,255,255,0.06)'}`,
                                    color: 'var(--color-text-secondary)',
                                    fontSize: '0.85rem',
                                    lineHeight: '1.5',
                                    whiteSpace: 'pre-line',
                                    animation: 'msgFade 0.3s ease'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                                    backgroundColor: 'rgba(0, 243, 255, 0.15)',
                                    border: '1px solid rgba(0, 243, 255, 0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Bot size={14} color="#00f3ff" />
                                </div>
                                <div style={{
                                    padding: '0.65rem 1rem', borderRadius: '12px',
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
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{
                        padding: '0.65rem 1rem',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center'
                    }}>
                        {/* Mic */}
                        <button
                            onClick={toggleListening}
                            style={{
                                padding: '0.5rem', borderRadius: '50%',
                                border: `1px solid ${isListening ? '#ff6464' : 'rgba(255,255,255,0.12)'}`,
                                backgroundColor: isListening ? 'rgba(255, 100, 100, 0.15)' : 'rgba(255,255,255,0.04)',
                                color: isListening ? '#ff6464' : 'var(--color-text-secondary)',
                                cursor: 'pointer', display: 'flex',
                                animation: isListening ? 'micPulse 1.5s ease infinite' : 'none'
                            }}
                        >
                            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                        </button>

                        {/* Text Input */}
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            placeholder={isListening ? '🎤 Listening...' : 'Ask anything...'}
                            style={{
                                flex: 1, padding: '0.55rem 0.8rem', borderRadius: '8px',
                                backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white', outline: 'none', fontSize: '0.85rem',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={e => e.target.style.borderColor = 'rgba(0, 243, 255, 0.4)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />

                        {/* Send */}
                        <button
                            onClick={() => sendMessage()}
                            disabled={!input.trim()}
                            style={{
                                padding: '0.5rem', borderRadius: '50%',
                                border: `1px solid ${input.trim() ? 'rgba(0, 243, 255, 0.4)' : 'rgba(255,255,255,0.1)'}`,
                                backgroundColor: input.trim() ? 'rgba(0, 243, 255, 0.12)' : 'rgba(255,255,255,0.04)',
                                color: input.trim() ? '#00f3ff' : 'rgba(255,255,255,0.15)',
                                cursor: input.trim() ? 'pointer' : 'default', display: 'flex'
                            }}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes robotFloat {
                    0%, 100% { transform: rotate(-12deg) translateY(0); }
                    50% { transform: rotate(-12deg) translateY(-6px); }
                }
                @keyframes chatSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes msgFade {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes micPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(255, 100, 100, 0.3); }
                    50% { box-shadow: 0 0 0 8px rgba(255, 100, 100, 0); }
                }
                @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-6px); }
                }
            `}</style>
        </>
    );
}
