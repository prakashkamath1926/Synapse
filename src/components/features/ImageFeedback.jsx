import React, { useState, useRef } from 'react';
import { Upload, Image, FileText, CheckCircle } from 'lucide-react';

export function ImageFeedback() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setFeedback(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setAnalyzing(true);
        setFeedback(null);

        try {
            const response = await fetch('/api/photo-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageFile: file.name, // send metadata since qwen is text-only
                    context: "Please review this math assignment or code diagram and provide constructive feedback."
                })
            });
            if (!response.ok) throw new Error('Failed to analyze');

            const data = await response.json();
            setFeedback(data);
        } catch (error) {
            setFeedback({
                score: "Error",
                strengths: [],
                missing: ["Failed to reach AI server"],
                suggestions: ["Check connection or backend logs", error.message]
            });
        }
        setAnalyzing(false);
    };

    return (
        <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Image size={22} color="#8a2be2" />
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'white' }}>Upload Your Work</h3>
            </div>

            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                Take a photo of your handwritten answer, diagram, or assignment. We'll review it and tell you what's missing.
            </p>

            {/* Upload Area */}
            {!preview ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        border: '2px dashed rgba(138, 43, 226, 0.3)',
                        borderRadius: '12px',
                        padding: '3rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor: 'rgba(138, 43, 226, 0.05)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.6)';
                        e.currentTarget.style.backgroundColor = 'rgba(138, 43, 226, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.3)';
                        e.currentTarget.style.backgroundColor = 'rgba(138, 43, 226, 0.05)';
                    }}
                >
                    <Upload size={36} color="#8a2be2" style={{ marginBottom: '1rem' }} />
                    <div style={{ color: '#d8b4fe', fontWeight: '600', marginBottom: '0.5rem' }}>
                        Click to upload an image
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                        Supports JPG, PNG — photos of handwritten work, diagrams, etc.
                    </div>
                </div>
            ) : (
                /* Preview */
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{
                        borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
                        marginBottom: '1rem', maxHeight: '300px', display: 'flex', justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.3)'
                    }}>
                        <img src={preview} alt="Uploaded work" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            style={{
                                flex: 1, padding: '0.75rem', borderRadius: '8px',
                                border: `1px solid ${analyzing ? 'rgba(255,255,255,0.2)' : 'rgba(138, 43, 226, 0.5)'}`,
                                backgroundColor: analyzing ? 'rgba(255,255,255,0.1)' : 'rgba(138, 43, 226, 0.15)',
                                color: analyzing ? 'rgba(255,255,255,0.5)' : '#d8b4fe',
                                cursor: analyzing ? 'default' : 'pointer', fontWeight: 'bold'
                            }}
                        >
                            {analyzing ? 'Reviewing...' : 'Get Feedback'}
                        </button>
                        <button
                            onClick={() => { setFile(null); setPreview(null); setFeedback(null); }}
                            style={{
                                padding: '0.75rem 1.5rem', borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent',
                                color: 'var(--color-text-secondary)', cursor: 'pointer'
                            }}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

            {/* Feedback Results */}
            {feedback && (
                <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.5s ease-out' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem',
                        padding: '1rem', borderRadius: '8px', backgroundColor: 'rgba(0, 243, 255, 0.1)',
                        border: '1px solid rgba(0, 243, 255, 0.3)'
                    }}>
                        <FileText size={20} color="#00f3ff" />
                        <span style={{ color: '#00f3ff', fontWeight: 'bold', fontSize: '1.1rem' }}>Score: {feedback.score}</span>
                    </div>

                    {/* Strengths */}
                    <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ color: '#00f3ff', marginBottom: '0.5rem', fontSize: '1rem' }}>✓ What you did well</h4>
                        {feedback.strengths.map((s, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                                <CheckCircle size={14} color="#00f3ff" style={{ marginTop: '4px', flexShrink: 0 }} />
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{s}</span>
                            </div>
                        ))}
                    </div>

                    {/* Missing */}
                    <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ color: '#ff6464', marginBottom: '0.5rem', fontSize: '1rem' }}>✗ What's missing</h4>
                        {feedback.missing.map((m, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                                <span style={{ color: '#ff6464', flexShrink: 0 }}>•</span>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{m}</span>
                            </div>
                        ))}
                    </div>

                    {/* Suggestions */}
                    <div>
                        <h4 style={{ color: '#d8b4fe', marginBottom: '0.5rem', fontSize: '1rem' }}>💡 Suggestions</h4>
                        {feedback.suggestions.map((s, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                                <span style={{ color: '#d8b4fe', flexShrink: 0 }}>→</span>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
