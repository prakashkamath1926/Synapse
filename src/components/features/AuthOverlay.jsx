import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, Zap, ArrowRight, User } from 'lucide-react';
import gsap from 'gsap';

export function AuthOverlay({ onLogin }) {
    const [isLoginBlock, setIsLoginBlock] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const overlayRef = useRef(null);
    const cardRef = useRef(null);

    useEffect(() => {
        // Entrance Animation
        gsap.fromTo(overlayRef.current,
            { opacity: 0, backdropFilter: 'blur(0px)' },
            { opacity: 1, backdropFilter: 'blur(20px)', duration: 0.8, ease: 'power3.out' }
        );
        gsap.fromTo(cardRef.current,
            { opacity: 0, y: 50, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.2, ease: 'back.out(1.2)' }
        );
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (!isLoginBlock && !name) {
            setError('Please enter your name.');
            return;
        }

        // Simulate successful login/registration
        // GSAP Exit Animation before triggering parent state
        gsap.to(cardRef.current, {
            opacity: 0, y: -30, scale: 0.95, duration: 0.4, ease: 'power3.in'
        });
        gsap.to(overlayRef.current, {
            opacity: 0, backdropFilter: 'blur(0px)', duration: 0.4, delay: 0.2, ease: 'power3.in',
            onComplete: () => {
                onLogin({ email, name: isLoginBlock ? email.split('@')[0] : name });
            }
        });
    };

    return (
        <div ref={overlayRef} style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(5, 5, 8, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div ref={cardRef} style={{
                width: '100%',
                maxWidth: '440px',
                padding: '3rem 2.5rem',
                borderRadius: '24px',
                backgroundColor: 'rgba(20, 20, 25, 0.7)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '16px', margin: '0 auto 1.5rem',
                        background: 'linear-gradient(135deg, #00f3ff, #8a2be2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 30px rgba(0, 243, 255, 0.3)'
                    }}>
                        <Zap size={32} color="black" fill="black" />
                    </div>
                    <h1 style={{
                        fontSize: '2rem', fontWeight: '700', color: 'white',
                        fontFamily: 'var(--font-primary)', marginBottom: '0.5rem'
                    }}>
                        {isLoginBlock ? 'Welcome back' : 'Join Synapse'}
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                        {isLoginBlock ? 'Enter your credentials to continue.' : 'Create an account to track your intelligence.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {!isLoginBlock && (
                        <div style={{ position: 'relative' }}>
                            <User size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{
                                    width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px',
                                    backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                                    color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'all 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#00f3ff'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                            />
                        </div>
                    )}
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px',
                                backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                                color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'all 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#00f3ff'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px',
                                backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                                color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'all 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#00f3ff'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                        />
                    </div>

                    {error && (
                        <div style={{ color: '#ff4444', fontSize: '0.85rem', textAlign: 'center', marginTop: '-0.5rem' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="intelligence-glow"
                        style={{
                            width: '100%', padding: '1rem', borderRadius: '12px', border: 'none',
                            background: 'linear-gradient(135deg, #00f3ff, #8a2be2)',
                            color: 'black', fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            marginTop: '0.5rem', transition: 'transform 0.2s ease'
                        }}
                    >
                        {isLoginBlock ? 'Sign In' : 'Create Account'}
                        <ArrowRight size={18} />
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => { setIsLoginBlock(!isLoginBlock); setError(''); }}
                            style={{
                                background: 'transparent', border: 'none', color: 'var(--color-text-secondary)',
                                fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline', transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#00f3ff'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
                        >
                            {isLoginBlock ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
