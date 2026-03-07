import React, { useState } from 'react';
import { Users, Bot, ThumbsUp, MessageSquare, Award, ChevronDown, ChevronUp } from 'lucide-react';

const MOCK_QUESTIONS = [
    {
        id: 1,
        question: "Explain the difference between TCP and UDP protocols.",
        aiAnswer: "TCP is a connection-oriented protocol that ensures reliable, ordered delivery through error checking and retransmission. UDP is connectionless and faster, sending packets without guarantees — perfect for streaming or gaming.",
        contributions: [
            {
                id: 1,
                text: "Think of TCP like a phone call (you confirm connection first) vs UDP which is like sending a postcard (fire and forget).",
                upvotes: 12
            },
            {
                id: 2,
                text: "Don't forget that TCP uses a 3-way handshake (SYN → SYN-ACK → ACK) to establish connections. This is why it's slower but reliable. UDP skips this entirely.",
                upvotes: 8
            }
        ]
    },
    {
        id: 2,
        question: "What is the Virtual DOM in React?",
        aiAnswer: "The Virtual DOM is a lightweight in-memory copy of the actual DOM. When state changes, React creates a new Virtual DOM tree, diffs it with the previous one, and only updates the real DOM where changes occurred.",
        contributions: [
            {
                id: 3,
                text: "Think of it like editing a Google Doc draft first, then only publishing the final changes — instead of rewriting the entire published document from scratch every time.",
                upvotes: 15
            }
        ]
    }
];

export function PeerCollab() {
    const [expanded, setExpanded] = useState({});

    const toggle = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div style={{ width: '100%', maxWidth: '800px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {MOCK_QUESTIONS.map((q) => (
                    <div key={q.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                        {/* Question Header */}
                        <button
                            onClick={() => toggle(q.id)}
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                border: 'none',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                color: 'white',
                                textAlign: 'left',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <MessageSquare size={18} color="#8a2be2" style={{ flexShrink: 0 }} />
                            <span style={{ flex: 1, fontSize: '1rem', fontWeight: '500' }}>{q.question}</span>
                            {expanded[q.id] ? <ChevronUp size={18} color="var(--color-text-secondary)" /> : <ChevronDown size={18} color="var(--color-text-secondary)" />}
                        </button>

                        {/* Expanded Content */}
                        {expanded[q.id] && (
                            <div style={{ padding: '0 1.25rem 1.25rem' }}>
                                {/* AI Answer */}
                                <div style={{
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    backgroundColor: 'rgba(0, 243, 255, 0.05)',
                                    border: '1px solid rgba(0, 243, 255, 0.15)',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <Bot size={14} color="#00f3ff" />
                                        <span style={{ fontSize: '0.75rem', color: '#00f3ff', fontWeight: '600' }}>Synapse AI</span>
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: '1.5', fontSize: '0.95rem' }}>
                                        {q.aiAnswer}
                                    </p>
                                </div>

                                {/* Peer Contributions */}
                                <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Users size={14} color="#d8b4fe" />
                                    <span style={{ fontSize: '0.8rem', color: '#d8b4fe', fontWeight: '600' }}>Peer Insights</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {q.contributions.map((contrib) => (
                                        <div key={contrib.id} style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            backgroundColor: 'rgba(138, 43, 226, 0.05)',
                                            border: '1px solid rgba(138, 43, 226, 0.1)'
                                        }}>
                                            <div style={{
                                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                                gap: '2px', flexShrink: 0
                                            }}>
                                                <ThumbsUp size={14} color="#8a2be2" />
                                                <span style={{ fontSize: '0.75rem', color: '#d8b4fe', fontWeight: '600' }}>{contrib.upvotes}</span>
                                            </div>
                                            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                                                {contrib.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
