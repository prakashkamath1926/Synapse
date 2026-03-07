import React, { useState } from 'react';
import { Users, Bot, ThumbsUp, ThumbsDown, MessageSquare, Award, ChevronDown, ChevronUp, Send, Flame, Target, Zap } from 'lucide-react';

// Initial Mock Data wrapped in State
const INITIAL_QUESTIONS = [
    {
        id: 1,
        question: "Explain the difference between TCP and UDP protocols.",
        author: "Alex_Dev",
        aiAnswer: "TCP is a connection-oriented protocol that ensures reliable, ordered delivery through error checking and retransmission. UDP is connectionless and faster, sending packets without guarantees — perfect for streaming or gaming.",
        contributions: [
            {
                id: 1,
                author: "NetNinja",
                text: "Think of TCP like a phone call (you confirm connection first) vs UDP which is like sending a postcard (fire and forget).",
                upvotes: 12,
                downvotes: 1,
                userVote: null
            },
            {
                id: 2,
                author: "SarahCodes",
                text: "Don't forget that TCP uses a 3-way handshake (SYN → SYN-ACK → ACK) to establish connections. This is why it's slower but reliable. UDP skips this entirely.",
                upvotes: 8,
                downvotes: 0,
                userVote: null
            }
        ]
    },
    {
        id: 2,
        question: "What is the Virtual DOM in React?",
        author: "ReactNewbie",
        aiAnswer: "The Virtual DOM is a lightweight in-memory copy of the actual DOM. When state changes, React creates a new Virtual DOM tree, diffs it with the previous one, and only updates the real DOM where changes occurred.",
        contributions: [
            {
                id: 3,
                author: "FrontendMaster",
                text: "Think of it like editing a Google Doc draft first, then only publishing the final changes — instead of rewriting the entire published document from scratch every time.",
                upvotes: 15,
                downvotes: 2,
                userVote: null
            }
        ]
    }
];

export function PeerCollab({ onScoreUpdate }) {
    const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
    const [expanded, setExpanded] = useState({});

    // Inputs
    const [newQuestionStr, setNewQuestionStr] = useState('');
    const [newInsights, setNewInsights] = useState({}); // mapped by question.id

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleAskQuestion = (e) => {
        e.preventDefault();
        if (!newQuestionStr.trim()) return;

        const newQ = {
            id: Date.now(),
            question: newQuestionStr,
            author: "You",
            aiAnswer: "Analyzing your question using Synapse Local Engine... (Simulated Response: This is an excellent query. Please check back shortly for community insights!)",
            contributions: []
        };

        setQuestions([newQ, ...questions]);
        setNewQuestionStr('');
        if (onScoreUpdate) onScoreUpdate('activity'); // Gamification bump
    };

    const handleAddInsight = (qId) => {
        const text = newInsights[qId];
        if (!text || !text.trim()) return;

        setQuestions(questions.map(q => {
            if (q.id === qId) {
                return {
                    ...q,
                    contributions: [...q.contributions, {
                        id: Date.now(),
                        author: "You",
                        text: text,
                        upvotes: 0,
                        downvotes: 0,
                        userVote: null
                    }]
                };
            }
            return q;
        }));

        setNewInsights(prev => ({ ...prev, [qId]: '' }));
        if (onScoreUpdate) onScoreUpdate('answers'); // Gamification bump
    };

    const handleVote = (qId, contribId, voteType) => {
        setQuestions(questions.map(q => {
            if (q.id === qId) {
                return {
                    ...q,
                    contributions: q.contributions.map(c => {
                        if (c.id === contribId) {
                            // If clicking same vote again, remove it
                            if (c.userVote === voteType) {
                                return {
                                    ...c,
                                    userVote: null,
                                    upvotes: voteType === 'up' ? c.upvotes - 1 : c.upvotes,
                                    downvotes: voteType === 'down' ? c.downvotes - 1 : c.downvotes
                                };
                            }

                            // Switching votes or new vote
                            let newUp = c.upvotes;
                            let newDown = c.downvotes;

                            // Remove old vote effect
                            if (c.userVote === 'up') newUp--;
                            if (c.userVote === 'down') newDown--;

                            // Apply new vote effect
                            if (voteType === 'up') newUp++;
                            if (voteType === 'down') newDown++;

                            return { ...c, userVote: voteType, upvotes: newUp, downvotes: newDown };
                        }
                        return c;
                    })
                };
            }
            return q;
        }));
    };

    const handleInsightChange = (qId, val) => {
        setNewInsights(prev => ({ ...prev, [qId]: val }));
    };

    return (
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', fontFamily: 'var(--font-primary)', marginBottom: '0.5rem' }}>Peer Collaboration</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>Ask questions and share your insights to earn Synapse Points.</p>
            </div>

            {/* Interactive Q&A Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Ask Question Form */}
                <form onSubmit={handleAskQuestion} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Ask the Synapse community a question..."
                        value={newQuestionStr}
                        onChange={(e) => setNewQuestionStr(e.target.value)}
                        style={{
                            flex: 1, padding: '1rem 1.25rem', borderRadius: '12px',
                            backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                            color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'all 0.3s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#8a2be2'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                    <button
                        type="submit"
                        className="intelligence-glow"
                        style={{
                            padding: '1rem', borderRadius: '12px', border: 'none',
                            background: 'linear-gradient(135deg, #00f3ff, #8a2be2)',
                            color: 'black', fontWeight: '700', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                        <Send size={18} />
                    </button>
                </form>

                {/* Feed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {questions.map((q) => (
                        <div key={q.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                            {/* Question Header */}
                            <button
                                onClick={() => toggleExpand(q.id)}
                                style={{
                                    width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem',
                                    border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'white',
                                    textAlign: 'left', transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <MessageSquare size={18} color="#8a2be2" style={{ flexShrink: 0 }} />
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <span style={{ fontSize: '1rem', fontWeight: '500' }}>{q.question}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Asked by <span style={{ color: q.author === 'You' ? '#00f3ff' : '#d8b4fe' }}>{q.author}</span></span>
                                </div>
                                {expanded[q.id] ? <ChevronUp size={18} color="var(--color-text-secondary)" /> : <ChevronDown size={18} color="var(--color-text-secondary)" />}
                            </button>

                            {/* Expanded Content */}
                            {expanded[q.id] && (
                                <div style={{ padding: '0 1.25rem 1.25rem' }}>
                                    {/* AI Answer */}
                                    <div style={{
                                        padding: '1rem', borderRadius: '8px', backgroundColor: 'rgba(0, 243, 255, 0.05)',
                                        border: '1px solid rgba(0, 243, 255, 0.15)', marginBottom: '1.5rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <Bot size={14} color="#00f3ff" />
                                            <span style={{ fontSize: '0.75rem', color: '#00f3ff', fontWeight: '600' }}>Synapse AI Immediate Response</span>
                                        </div>
                                        <p style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: '1.5', fontSize: '0.95rem' }}>
                                            {q.aiAnswer}
                                        </p>
                                    </div>

                                    {/* Peer Contributions List */}
                                    <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Users size={14} color="#d8b4fe" />
                                        <span style={{ fontSize: '0.8rem', color: '#d8b4fe', fontWeight: '600' }}>Community Insights</span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                        {q.contributions.map((contrib) => (
                                            <div key={contrib.id} style={{
                                                display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '8px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)'
                                            }}>
                                                {/* Voting Sidebar */}
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                                    <button onClick={() => handleVote(q.id, contrib.id, 'up')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', backgroundColor: contrib.userVote === 'up' ? 'rgba(0, 243, 255, 0.2)' : 'transparent', transition: 'all 0.2s' }}>
                                                        <ThumbsUp size={14} color={contrib.userVote === 'up' ? "#00f3ff" : "var(--color-text-secondary)"} />
                                                    </button>
                                                    <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: '600' }}>{contrib.upvotes - contrib.downvotes}</span>
                                                    <button onClick={() => handleVote(q.id, contrib.id, 'down')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', backgroundColor: contrib.userVote === 'down' ? 'rgba(255, 68, 68, 0.2)' : 'transparent', transition: 'all 0.2s' }}>
                                                        <ThumbsDown size={14} color={contrib.userVote === 'down' ? "#ff4444" : "var(--color-text-secondary)"} />
                                                    </button>
                                                </div>

                                                {/* Insight Content */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                                                    <div style={{ fontSize: '0.75rem', color: contrib.author === 'You' ? '#00f3ff' : 'var(--color-text-secondary)', fontWeight: '600' }}>
                                                        {contrib.author}
                                                    </div>
                                                    <p style={{ margin: 0, color: 'white', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                                        {contrib.text}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {q.contributions.length === 0 && (
                                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.85rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                                No community insights yet. Be the first to answer!
                                            </div>
                                        )}
                                    </div>

                                    {/* Add Insight Form */}
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <textarea
                                            placeholder="Write an insight to help your peers (and earn Synapse points)..."
                                            value={newInsights[q.id] || ''}
                                            onChange={(e) => handleInsightChange(q.id, e.target.value)}
                                            style={{
                                                flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', minHeight: '60px',
                                                backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
                                                color: 'white', fontSize: '0.9rem', outline: 'none', transition: 'all 0.3s', resize: 'vertical'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#00f3ff'}
                                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                        />
                                        <button
                                            onClick={() => handleAddInsight(q.id)}
                                            style={{
                                                padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid rgba(0, 243, 255, 0.3)',
                                                backgroundColor: 'rgba(0, 243, 255, 0.1)', color: '#00f3ff', fontWeight: '600', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', alignSelf: 'stretch'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 243, 255, 0.2)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 243, 255, 0.1)'}
                                        >
                                            <Send size={16} />
                                            <span>Post</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
