import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import gsap from 'gsap';

const MODES = {
    focus: { label: 'Focus', duration: 25 * 60, color: '#00f3ff' },
    shortBreak: { label: 'Short Break', duration: 5 * 60, color: '#8a2be2' },
    longBreak: { label: 'Long Break', duration: 15 * 60, color: '#ff6464' },
};

export function FocusMode() {
    const [currentMode, setCurrentMode] = useState('focus');
    const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionsCompleted, setSessions] = useState(0);
    const intervalRef = useRef(null);

    const mode = MODES[currentMode];
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = 1 - timeLeft / mode.duration;

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (currentMode === 'focus') {
                setSessions(prev => prev + 1);
            }
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, timeLeft]);

    const switchMode = (newMode) => {
        setCurrentMode(newMode);
        setTimeLeft(MODES[newMode].duration);
        setIsRunning(false);
        clearInterval(intervalRef.current);
    };

    const reset = () => {
        setTimeLeft(mode.duration);
        setIsRunning(false);
        clearInterval(intervalRef.current);
    };

    const circleRadius = 90;
    const circumference = 2 * Math.PI * circleRadius;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Brain size={22} color={mode.color} />
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'white' }}>Focus Mode</h3>
            </div>

            {/* Mode Tabs */}
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '2rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px' }}>
                {Object.entries(MODES).map(([key, val]) => (
                    <button
                        key={key}
                        onClick={() => switchMode(key)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: currentMode === key ? `${val.color}25` : 'transparent',
                            color: currentMode === key ? val.color : 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {val.label}
                    </button>
                ))}
            </div>

            {/* Circular Timer */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
                <svg width="220" height="220" viewBox="0 0 220 220">
                    <circle cx="110" cy="110" r={circleRadius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                    <circle
                        cx="110" cy="110" r={circleRadius}
                        fill="none"
                        stroke={mode.color}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 1s linear', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                    />
                </svg>
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    fontSize: '3rem', fontWeight: '300', color: 'white', fontFamily: 'var(--font-primary)',
                    letterSpacing: '2px'
                }}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    style={{
                        padding: '0.75rem 2.5rem',
                        borderRadius: '30px',
                        border: `1px solid ${mode.color}60`,
                        backgroundColor: `${mode.color}15`,
                        color: mode.color,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {isRunning ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
                </button>
                <button
                    onClick={reset}
                    style={{
                        padding: '0.75rem',
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.15)',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <RotateCcw size={18} />
                </button>
            </div>

            {/* Session counter */}
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                <Coffee size={14} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />
                {sessionsCompleted} focus session{sessionsCompleted !== 1 ? 's' : ''} completed today
            </div>

            {/* Wellness reminder */}
            {timeLeft === 0 && currentMode === 'focus' && (
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(138, 43, 226, 0.1)',
                    border: '1px solid rgba(138, 43, 226, 0.3)',
                    color: '#d8b4fe',
                    fontSize: '0.9rem',
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    Great work! Stand up, stretch, and grab some water before the next session.
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
