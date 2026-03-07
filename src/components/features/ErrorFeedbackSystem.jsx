import React, { useState } from 'react';
import { Terminal, Cpu, CheckCircle } from 'lucide-react';

export function ErrorFeedbackSystem() {
    const [attempt, setAttempt] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!attempt) return;

        setAnalyzing(true);
        setFeedback(null);

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: attempt,
                    question: "General error analysis"
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'API error');
            }

            const data = await response.json();
            setFeedback({
                status: "Analysis Complete",
                ...data
            });
        } catch (error) {
            setFeedback({
                status: "Failed",
                mistake: "Could not connect to AI safely.",
                conceptGap: "Connection Error",
                explanation: error.message,
                suggestion: "Please try again or check backend server."
            });
        }
        setAnalyzing(false);
    };

    return (
        <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Terminal className="intelligence-glow" size={24} color="#00f3ff" />
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>Neural Error Analysis</h3>
            </div>

            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                Submit your code attempt or mathematical solution here. The system will identify concept gaps rather than just giving you the answer.
            </p>

            <form onSubmit={handleSubmit}>
                <textarea
                    value={attempt}
                    onChange={(e) => setAttempt(e.target.value)}
                    placeholder="// Paste algorithm or solution attempt..."
                    rows={5}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                        outline: 'none',
                        resize: 'vertical',
                        marginBottom: '1rem',
                        transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(0, 243, 255, 0.4)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />

                <button
                    type="submit"
                    disabled={analyzing || !attempt}
                    style={{
                        padding: '0.75rem 2rem',
                        borderRadius: '8px',
                        backgroundColor: analyzing ? 'rgba(255,255,255,0.1)' : 'rgba(138, 43, 226, 0.2)', // Ultraviolet
                        border: `1px solid ${analyzing ? 'rgba(255,255,255,0.2)' : 'rgba(138, 43, 226, 0.5)'}`,
                        color: analyzing ? 'rgba(255,255,255,0.5)' : '#d8b4fe',
                        cursor: analyzing ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 'bold',
                        transition: 'all 0.3s'
                    }}
                >
                    {analyzing ? <><Cpu size={18} className="spin-animation" /> Analyzing Nodes...</> : 'Initiate Analysis'}
                </button>
            </form>

            {feedback && (
                <div style={{
                    marginTop: '2rem',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 100, 100, 0.1)',
                    borderLeft: '4px solid #ff6464',
                    animation: 'slideDown 0.5s ease-out'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#ff6464' }}>
                        <CheckCircle size={20} />
                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{feedback.status}</h4>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ color: 'white' }}>The Mistake:</strong>
                        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>{feedback.mistake}</p>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ color: 'white' }}>Concept Gap Detected:</strong>
                        <span style={{
                            display: 'inline-block',
                            marginLeft: '0.5rem',
                            padding: '0.25rem 0.5rem',
                            backgroundColor: 'rgba(0, 243, 255, 0.15)',
                            color: '#00f3ff',
                            borderRadius: '4px',
                            fontSize: '0.85rem'
                        }}>{feedback.conceptGap}</span>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ color: 'white' }}>Why it matters:</strong>
                        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>{feedback.explanation}</p>
                    </div>

                    <div>
                        <strong style={{ color: 'white' }}>Correction Vector:</strong>
                        <code style={{
                            display: 'block',
                            marginTop: '0.5rem',
                            padding: '0.75rem',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            borderRadius: '4px',
                            color: '#00f3ff'
                        }}>{feedback.suggestion}</code>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .spin-animation {
            animation: spin 2s linear infinite;
        }
        @keyframes spin {
            100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
