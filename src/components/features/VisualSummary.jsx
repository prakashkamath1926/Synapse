import React, { useState, useEffect, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { Eye, ChevronRight, BookOpen, Sparkles, AlertCircle, LayoutTemplate, Network, Brain } from 'lucide-react';
import gsap from 'gsap';
import { MermaidRenderer } from './MermaidRenderer';

export function VisualSummary() {
    const [selectedConcept, setSelectedConcept] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [topic, setTopic] = useState('');
    const [isGeneratingSteps, setIsGeneratingSteps] = useState(false);
    const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('steps'); // 'steps' | 'diagram'

    const stepCardRef = useRef(null);
    const dynamicIconRef = useRef(null);
    const iconAnimationContextRef = useRef(null);

    // Animate the card changing whenever the activeStep updates
    useEffect(() => {
        if (selectedConcept && selectedConcept.steps && selectedConcept.steps[activeStep] && stepCardRef.current) {
            gsap.fromTo(stepCardRef.current,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
            );
        }
    }, [activeStep, selectedConcept]);

    // 2. Animate the Dynamic Content Icon based on the AI's requested physics
    useEffect(() => {
        if (selectedConcept && selectedConcept.steps && selectedConcept.steps[activeStep] && dynamicIconRef.current) {
            const currentStep = selectedConcept.steps[activeStep];
            const animType = currentStep.animation || 'glow';

            // Clean up previous animations on this ref
            if (iconAnimationContextRef.current) {
                iconAnimationContextRef.current.revert();
            }

            iconAnimationContextRef.current = gsap.context(() => {
                const el = dynamicIconRef.current;

                switch (animType.toLowerCase()) {
                    case 'spin':
                        gsap.to(el, { rotation: 360, duration: 4, repeat: -1, ease: 'linear' });
                        break;
                    case 'pulse':
                        gsap.to(el, { scale: 1.2, duration: 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
                        break;
                    case 'float':
                        gsap.to(el, { y: -10, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
                        break;
                    case 'bounce':
                        gsap.to(el, { y: -15, duration: 0.5, repeat: -1, yoyo: true, ease: 'power1.out' });
                        break;
                    case 'glow':
                    default:
                        gsap.to(el, { filter: 'drop-shadow(0 0 12px #00f3ff)', duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
                        break;
                }
            }, dynamicIconRef);
        }

        return () => {
            if (iconAnimationContextRef.current) {
                iconAnimationContextRef.current.revert();
            }
        };
    }, [activeStep, selectedConcept]);

    const handleGenerateSteps = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setIsGeneratingSteps(true);
        setError(null);
        setSelectedConcept(null);
        setActiveStep(0);

        try {
            const savedAI = localStorage.getItem('synapse_ai_settings');
            const aiSettings = savedAI ? JSON.parse(savedAI) : { useOllama: true, useBedrock: false };

            const response = await fetch('/api/visual-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, aiSettings })
            });

            if (!response.ok) throw new Error('API error');
            const data = await response.json();
            setSelectedConcept(data);
            setViewMode('steps');
        } catch (error) {
            console.error('Visual Summary generation failed:', error);
            setError('Failed to generate visual breakdown. Please try again.');
        } finally {
            setIsGeneratingSteps(false);
        }
    };

    const handleGenerateDiagram = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setIsGeneratingDiagram(true);
        setError(null);
        setSelectedConcept(null);
        setActiveStep(0);

        try {
            const savedAI = localStorage.getItem('synapse_ai_settings');
            const aiSettings = savedAI ? JSON.parse(savedAI) : { useOllama: true, useBedrock: false };

            const response = await fetch('/api/mermaid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, aiSettings })
            });

            if (!response.ok) throw new Error('API error');
            const data = await response.json();
            setSelectedConcept(data);
            setViewMode('diagram');
        } catch (error) {
            console.error('Mermaid Diagram generation failed:', error);
            setError('Failed to generate mind map. Please try again.');
        } finally {
            setIsGeneratingDiagram(false);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '800px' }}>
            {!selectedConcept ? (
                /* Concept Input Selection */
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Eye className="intelligence-glow" size={24} color="#00f3ff" />
                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>Generate Visual Summary</h3>
                    </div>

                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                        Enter any complex topic, and Synapse AI will elegantly break it down into a step-by-step visual learning flow.
                    </p>

                    <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. How Black Holes Work, React Lifecycle, Photosynthesis..."
                                style={{
                                    flex: 1,
                                    padding: '1rem 1.5rem',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontFamily: 'var(--font-secondary)',
                                    fontSize: '1.1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'rgba(0, 243, 255, 0.5)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={(e) => handleGenerateSteps(e)}
                                disabled={isGeneratingSteps || isGeneratingDiagram || !topic.trim()}
                                style={{
                                    flex: 1,
                                    padding: '0.9rem',
                                    borderRadius: '12px',
                                    backgroundColor: isGeneratingSteps ? 'rgba(255,255,255,0.1)' : 'rgba(0, 243, 255, 0.15)',
                                    border: `1px solid ${isGeneratingSteps ? 'rgba(255,255,255,0.2)' : 'rgba(0, 243, 255, 0.4)'}`,
                                    color: isGeneratingSteps ? 'var(--color-text-secondary)' : '#00f3ff',
                                    fontWeight: 'bold',
                                    cursor: (isGeneratingSteps || isGeneratingDiagram || !topic.trim()) ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {isGeneratingSteps ? (
                                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>↻</span>
                                ) : <Brain size={18} />}
                                {isGeneratingSteps ? 'Visualizing...' : 'Visualize'}
                            </button>
                            <button
                                type="button"
                                onClick={(e) => handleGenerateDiagram(e)}
                                disabled={isGeneratingSteps || isGeneratingDiagram || !topic.trim()}
                                style={{
                                    flex: 1,
                                    padding: '0.9rem',
                                    borderRadius: '12px',
                                    backgroundColor: isGeneratingDiagram ? 'rgba(255,255,255,0.1)' : 'rgba(216, 180, 254, 0.15)',
                                    border: `1px solid ${isGeneratingDiagram ? 'rgba(255,255,255,0.2)' : 'rgba(216, 180, 254, 0.4)'}`,
                                    color: isGeneratingDiagram ? 'var(--color-text-secondary)' : '#d8b4fe',
                                    fontWeight: 'bold',
                                    cursor: (isGeneratingSteps || isGeneratingDiagram || !topic.trim()) ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {isGeneratingDiagram ? (
                                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>↻</span>
                                ) : <Network size={18} />}
                                {isGeneratingDiagram ? 'Rendering Map...' : 'Generate Mind Map'}
                            </button>
                        </div>
                        {error && (
                            <div style={{ color: '#ff4444', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}
                    </form>
                </div>
            ) : (
                /* Step-by-Step Visual Flow */
                <div>
                    <button
                        onClick={() => setSelectedConcept(null)}
                        style={{
                            marginBottom: '1.5rem', padding: '0.5rem 1rem', borderRadius: '6px',
                            border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent',
                            color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '0.85rem'
                        }}
                    >
                        ← Back to topics
                    </button>

                    <h3 className="intelligence-glow" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                        {selectedConcept.title}
                    </h3>

                    {/* View Toggle removed to fully decouple Steps vs Diagram views */}

                    {/* Step-by-Step Flow Content */}
                    {viewMode === 'steps' && selectedConcept.steps && (
                        <>
                            {/* Progress Bar */}
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem' }}>
                                {selectedConcept.steps.map((_, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            flex: 1, height: '4px', borderRadius: '2px',
                                            backgroundColor: i <= activeStep ? '#00f3ff' : 'rgba(255,255,255,0.1)',
                                            transition: 'background-color 0.5s ease'
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Active Step Card */}
                            <div ref={stepCardRef} className="glass-panel" style={{
                                padding: '2rem', marginBottom: '1.5rem',
                                borderLeft: '4px solid #00f3ff',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem'
                            }}>
                                {/* Dynamic Content Visual Area */}
                                <div style={{
                                    width: '100%', height: '160px', borderRadius: '12px',
                                    backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0, 243, 255, 0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'relative', overflow: 'hidden'
                                }}>
                                    {/* Ambient background glow */}
                                    <div style={{
                                        position: 'absolute', width: '150px', height: '150px',
                                        background: 'radial-gradient(circle, rgba(0,243,255,0.15) 0%, rgba(0,0,0,0) 70%)',
                                        borderRadius: '50%'
                                    }} />

                                    {/* The AI's dynamically selected SVG Icon */}
                                    <div ref={dynamicIconRef} style={{ zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {(() => {
                                            const currentStep = selectedConcept.steps[activeStep];
                                            const DynamicSvg = LucideIcons[currentStep.icon] || Sparkles;
                                            return <DynamicSvg size={64} color="#00f3ff" strokeWidth={1.5} />;
                                        })()}
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <div style={{
                                            width: '28px', height: '28px', borderRadius: '50%',
                                            backgroundColor: 'rgba(0, 243, 255, 0.2)', border: '2px solid #00f3ff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.8rem', fontWeight: 'bold', color: '#00f3ff'
                                        }}>
                                            {activeStep + 1}
                                        </div>
                                        <h4 style={{ margin: 0, color: '#00f3ff', fontSize: '1.2rem' }}>
                                            {selectedConcept.steps[activeStep].label}
                                        </h4>
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                                        {selectedConcept.steps[activeStep].detail}
                                    </p>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                                <button
                                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                                    disabled={activeStep === 0}
                                    style={{
                                        padding: '0.75rem 1.5rem', borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent',
                                        color: activeStep === 0 ? 'rgba(255,255,255,0.2)' : 'white',
                                        cursor: activeStep === 0 ? 'default' : 'pointer', fontWeight: '500'
                                    }}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setActiveStep(Math.min(selectedConcept.steps.length - 1, activeStep + 1))}
                                    disabled={activeStep === selectedConcept.steps.length - 1}
                                    style={{
                                        padding: '0.75rem 1.5rem', borderRadius: '8px',
                                        border: `1px solid ${activeStep === selectedConcept.steps.length - 1 ? 'rgba(255,255,255,0.15)' : 'rgba(0, 243, 255, 0.4)'}`,
                                        backgroundColor: activeStep === selectedConcept.steps.length - 1 ? 'transparent' : 'rgba(0, 243, 255, 0.1)',
                                        color: activeStep === selectedConcept.steps.length - 1 ? 'rgba(255,255,255,0.2)' : '#00f3ff',
                                        cursor: activeStep === selectedConcept.steps.length - 1 ? 'default' : 'pointer', fontWeight: '500'
                                    }}
                                >
                                    Next Step
                                </button>
                            </div>
                        </>
                    )}

                    {viewMode === 'diagram' && selectedConcept.diagram && (
                        <div className="glass-panel" style={{ padding: '1rem', borderTop: '4px solid #d8b4fe' }}>
                            <MermaidRenderer chart={selectedConcept.diagram} />
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); filter: blur(5px); }
                    to { opacity: 1; transform: translateY(0); filter: blur(0px); }
                }
            `}</style>
        </div>
    );
}
