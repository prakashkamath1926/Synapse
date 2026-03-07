import React, { useState } from 'react';
import { Eye, ChevronRight, BookOpen } from 'lucide-react';

const CONCEPT_DATA = [
    {
        id: 1,
        title: "How Neural Networks Learn",
        steps: [
            { label: "Input Layer", detail: "Raw data enters the network (e.g., pixel values of an image)." },
            { label: "Hidden Layers", detail: "Neurons apply weights and activation functions to transform the data." },
            { label: "Forward Pass", detail: "Data flows forward through all layers to produce a prediction." },
            { label: "Loss Calculation", detail: "The system compares the prediction against the correct answer." },
            { label: "Backpropagation", detail: "Errors flow backward, adjusting weights to improve accuracy." },
            { label: "Iteration", detail: "This process repeats thousands of times until the model converges." },
        ]
    },
    {
        id: 2,
        title: "React Component Lifecycle",
        steps: [
            { label: "Mount", detail: "Component is created and inserted into the DOM." },
            { label: "Render", detail: "React calculates the virtual DOM based on props and state." },
            { label: "useEffect", detail: "Side effects run after the component renders (API calls, subscriptions)." },
            { label: "Update", detail: "When state or props change, the component re-renders." },
            { label: "Cleanup", detail: "useEffect cleanup runs before re-render or unmount to prevent leaks." },
            { label: "Unmount", detail: "Component is removed from the DOM." },
        ]
    }
];

export function VisualSummary() {
    const [selectedConcept, setSelectedConcept] = useState(null);
    const [activeStep, setActiveStep] = useState(0);

    return (
        <div style={{ width: '100%', maxWidth: '800px' }}>
            {!selectedConcept ? (
                /* Concept Selection */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {CONCEPT_DATA.map((concept) => (
                        <div
                            key={concept.id}
                            className="glass-panel"
                            onClick={() => { setSelectedConcept(concept); setActiveStep(0); }}
                            style={{
                                padding: '1.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0, 243, 255, 0.4)'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Eye size={20} color="#00f3ff" />
                                <div>
                                    <div style={{ fontWeight: '600', color: 'white', fontSize: '1.1rem' }}>{concept.title}</div>
                                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{concept.steps.length} steps</div>
                                </div>
                            </div>
                            <ChevronRight size={20} color="var(--color-text-secondary)" />
                        </div>
                    ))}
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

                    <h3 className="intelligence-glow" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                        {selectedConcept.title}
                    </h3>

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
                    <div className="glass-panel" style={{
                        padding: '2rem', marginBottom: '1.5rem',
                        borderLeft: '4px solid #00f3ff',
                        animation: 'fadeIn 0.5s ease-out'
                    }}>
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
