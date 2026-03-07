import React, { useState, useEffect } from 'react';
import { Target, AlertTriangle, Coffee, Sparkles } from 'lucide-react';
import gsap from 'gsap';

// Mock system states to showcase the different motivation types
const SYSTEM_STATES = [
    {
        type: "unfinished",
        title: "Unfinished Work",
        message: "You still have exercises left in 'Linear Algebra'. Finish those before starting something new — you're almost there!",
        action: "Continue Learning",
        color: "#00f3ff",
        icon: Target
    },
    {
        type: "capability",
        title: "Ready to Build!",
        message: "You've learned React State & Fetch API — that's enough to build a Weather Dashboard. Want to try it?",
        action: "Start Project",
        color: "#8a2be2",
        icon: Sparkles
    },
    {
        type: "burnout",
        title: "Time for a Break",
        message: "You've been at it for a while and made a few errors in a row. Take a walk, drink some water, and come back fresh.",
        action: "Take a Break",
        color: "#ff6464",
        icon: Coffee
    }
];

export function MotivationAgent() {
    const [currentStateIndex, setCurrentStateIndex] = useState(0);
    const state = SYSTEM_STATES[currentStateIndex];
    const Icon = state.icon;

    // Cycle through mock states for demonstration purposes
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStateIndex(prev => (prev + 1) % SYSTEM_STATES.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    // Fade animation on state change
    useEffect(() => {
        gsap.fromTo(".agentic-overlay",
            { opacity: 0, y: 20, filter: 'blur(10px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, ease: "power4.out" }
        );
    }, [currentStateIndex]);

    return (
        <div
            className="agentic-overlay"
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                maxWidth: '380px',
                zIndex: 100,
                backgroundColor: 'rgba(15, 15, 20, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${state.color}40`, // 40 is hex opacity
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: `0 8px 32px 0 rgba(0,0,0,0.5), 0 0 20px -10px ${state.color}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                borderLeft: `4px solid ${state.color}`
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    backgroundColor: `${state.color}20`,
                    color: state.color
                }}>
                    <Icon size={20} />
                </div>
                <h4 style={{ margin: 0, color: 'white', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                    {state.title}
                </h4>
            </div>

            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                {state.message}
            </p>

            <button style={{
                marginTop: '0.5rem',
                padding: '0.75rem 0',
                width: '100%',
                borderRadius: '8px',
                backgroundColor: `${state.color}15`,
                border: `1px solid ${state.color}50`,
                color: state.color,
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
            }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${state.color}30`;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${state.color}15`;
                }}
            >
                {state.action}
            </button>
        </div>
    );
}
