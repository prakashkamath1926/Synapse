import React, { useState, useEffect, useRef } from 'react';
import { X, Settings, Map as MapIcon, Database, Bell, User, Target, Flame, MessageSquare, Zap, Camera, BookOpen, Cpu, Cloud, AlertCircle } from 'lucide-react';
import gsap from 'gsap';

export function SettingsModal({ onClose, userProfile, userScore }) {
    const [activeTab, setActiveTab] = useState('profile');

    const [settings, setSettings] = useState(() => {
        const savedAI = localStorage.getItem('synapse_ai_settings');
        return {
            smartRouting: true,
            studyBreakAlerts: true,
            mistakeInsights: false,
            autoSave: true,
            aiEngines: savedAI ? JSON.parse(savedAI) : { useOllama: true, useBedrock: true }
        };
    });

    const overlayRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        // Entrance Animation
        gsap.fromTo(overlayRef.current,
            { opacity: 0, backdropFilter: 'blur(0px)' },
            { opacity: 1, backdropFilter: 'blur(15px)', duration: 0.6, ease: 'power3.out' }
        );
        gsap.fromTo(modalRef.current,
            { opacity: 0, y: 30, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.1, ease: 'back.out(1.2)' }
        );
    }, []);

    const handleClose = () => {
        // Exit Animation
        gsap.to(modalRef.current, {
            opacity: 0, y: 20, scale: 0.98, duration: 0.3, ease: 'power3.in'
        });
        gsap.to(overlayRef.current, {
            opacity: 0, backdropFilter: 'blur(0px)', duration: 0.3, delay: 0.1, ease: 'power3.in',
            onComplete: onClose
        });
    };

    const toggleSetting = (key, isAiSetting = false) => {
        setSettings(prev => {
            if (isAiSetting) {
                const newAiSettings = { ...prev.aiEngines, [key]: !prev.aiEngines[key] };
                localStorage.setItem('synapse_ai_settings', JSON.stringify(newAiSettings));
                return { ...prev, aiEngines: newAiSettings };
            }
            return { ...prev, [key]: !prev[key] };
        });
    };

    const TABS = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'ai', label: 'AI Engines', icon: Cpu },
        { id: 'general', label: 'General', icon: Settings },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'data', label: 'Data & Privacy', icon: Database },
    ];

    const ToggleSwitch = ({ checked, onChange, label, description }) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
                <div style={{ color: 'white', fontWeight: '500', fontSize: '0.95rem', marginBottom: '4px' }}>{label}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{description}</div>
            </div>
            <button
                onClick={onChange}
                style={{
                    width: '44px', height: '24px', borderRadius: '12px',
                    backgroundColor: checked ? '#00f3ff' : 'rgba(255,255,255,0.1)',
                    border: 'none', position: 'relative', cursor: 'pointer',
                    transition: 'background-color 0.3s ease', flexShrink: 0
                }}
            >
                <div style={{
                    position: 'absolute', top: '2px', left: checked ? '22px' : '2px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    backgroundColor: checked ? '#050508' : 'white',
                    transition: 'left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }} />
            </button>
        </div>
    );

    return (
        <div ref={overlayRef} style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(5, 5, 8, 0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem'
        }}>
            <div ref={modalRef} style={{
                width: '100%', maxWidth: '850px', height: '80vh', maxHeight: '650px',
                borderRadius: '24px', backgroundColor: 'rgba(15, 15, 20, 0.85)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 30px 60px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
                display: 'flex', flexDirection: 'row', overflow: 'hidden',
                position: 'relative',
                flexWrap: 'wrap' // Ensures responsiveness
            }}>
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute', top: '1.5rem', right: '1.5rem',
                        width: '36px', height: '36px', borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', zIndex: 10, transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.backgroundColor = 'rgba(255,68,68,0.2)'; e.currentTarget.style.borderColor = 'rgba(255,68,68,0.5)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                    <X size={18} />
                </button>

                {/* Left Sidebar Tabs */}
                <div style={{
                    flex: '1 1 250px', maxWidth: '300px', backgroundColor: 'rgba(5, 5, 8, 0.4)',
                    borderRight: '1px solid rgba(255,255,255,0.05)', padding: '2rem 1rem',
                    display: 'flex', flexDirection: 'column'
                }}>
                    <h2 style={{ color: 'white', fontSize: '1.25rem', fontFamily: 'var(--font-primary)', marginBottom: '2rem', paddingLeft: '1rem', fontWeight: '700' }}>
                        Settings
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {TABS.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        padding: '0.85rem 1rem', borderRadius: '12px', border: 'none',
                                        backgroundColor: isActive ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
                                        color: isActive ? '#00f3ff' : 'var(--color-text-secondary)',
                                        cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem',
                                        fontWeight: isActive ? '600' : '400', transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'white'; }}
                                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
                                >
                                    <Icon size={18} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Content Area */}
                <div style={{ flex: '3 1 400px', padding: '3rem 2.5rem', overflowY: 'auto' }}>
                    <div style={{ maxWidth: '480px' }}>
                        {activeTab === 'profile' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <h3 style={{ color: '#00f3ff', fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '700' }}>Your Profile</h3>

                                {/* Avatar & Account Info */}
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

                                    {/* Mock Avatar */}
                                    <div style={{ position: 'relative', cursor: 'pointer', group: 'avatar' }}>
                                        <div style={{
                                            width: '80px', height: '80px', borderRadius: '50%',
                                            backgroundColor: 'rgba(0, 243, 255, 0.1)', border: '2px solid #00f3ff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                                        }}>
                                            <User size={40} color="#00f3ff" />
                                        </div>
                                        <div style={{
                                            position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s'
                                        }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                                            <Camera size={24} color="white" />
                                        </div>
                                    </div>

                                    {/* Mock Credentials */}
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginBottom: '4px' }}>Email</label>
                                            <input type="email" defaultValue={userProfile?.email || "neural_ninja@synapse.com"} style={{
                                                width: '100%', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                                                backgroundColor: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none'
                                            }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginBottom: '4px' }}>Password</label>
                                            <input type="password" defaultValue="••••••••" style={{
                                                width: '100%', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                                                backgroundColor: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none'
                                            }} />
                                        </div>
                                        <button style={{
                                            alignSelf: 'flex-start', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(0, 243, 255, 0.3)',
                                            backgroundColor: 'rgba(0, 243, 255, 0.1)', color: '#00f3ff', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                                        }}>Save Changes</button>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />

                                {/* Gamification Stats */}
                                <div>
                                    <h3 style={{ color: '#8a2be2', fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '600' }}>Gamification Stats</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>

                                        {/* Total Score */}
                                        <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(138,43,226,0.05)', border: '1px solid rgba(138,43,226,0.1)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                                <Target size={14} color="#8a2be2" /> Synapse Score
                                            </div>
                                            <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800' }}>
                                                {userScore ? (userScore.consistency * 10) + (userScore.activity * 5) + (userScore.answers * 15) : 0} <span style={{ fontSize: '0.8rem', color: '#8a2be2' }}>PTS</span>
                                            </div>
                                        </div>

                                        {/* Active Courses */}
                                        <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(0, 243, 255, 0.05)', border: '1px solid rgba(0, 243, 255, 0.1)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                                <BookOpen size={14} color="#00f3ff" /> Active Courses
                                            </div>
                                            <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800' }}>
                                                {userScore?.activeCourses || 3}
                                            </div>
                                        </div>

                                        {/* Consistency */}
                                        <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(255,170,0,0.05)', border: '1px solid rgba(255,170,0,0.1)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                                <Flame size={14} color="#ffaa00" /> Day Streak
                                            </div>
                                            <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800' }}>
                                                {userScore?.consistency || 0} <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Days</span>
                                            </div>
                                        </div>

                                        {/* Activity */}
                                        <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(0,243,255,0.05)', border: '1px solid rgba(0,243,255,0.1)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                                <MessageSquare size={14} color="#00f3ff" /> Questions
                                            </div>
                                            <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800' }}>{userScore?.activity || 0}</div>
                                        </div>

                                        {/* Answers */}
                                        <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(216,180,254,0.05)', border: '1px solid rgba(216,180,254,0.1)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                                <Zap size={14} color="#d8b4fe" /> Insights
                                            </div>
                                            <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800' }}>{userScore?.answers || 0}</div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        )}

                        {activeTab === 'ai' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <Cpu size={24} color="#00f3ff" />
                                    <h3 style={{ color: '#00f3ff', fontSize: '1.25rem', margin: 0, fontWeight: '700' }}>AI Providers</h3>
                                </div>

                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    Configure which Artificial Intelligence engines power your Synapse experience.
                                    (Note: Photo Review strictly utilizes Amazon Bedrock's computer vision.)
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <ToggleSwitch
                                        label="Local AI (Ollama)"
                                        description="Run privacy-first open source models precisely on your own hardware."
                                        checked={settings.aiEngines.useOllama}
                                        onChange={() => toggleSetting('useOllama', true)}
                                    />

                                    <ToggleSwitch
                                        label="Cloud AI (AWS Bedrock)"
                                        description="Fallback to Amazon Nova instances if local engines are disabled or under heavy load."
                                        checked={settings.aiEngines.useBedrock}
                                        onChange={() => toggleSetting('useBedrock', true)}
                                    />
                                </div>

                                {(!settings.aiEngines.useOllama && !settings.aiEngines.useBedrock) && (
                                    <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(255, 68, 68, 0.1)', border: '1px solid rgba(255, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <AlertCircle size={20} color="#ff4444" />
                                        <p style={{ margin: 0, color: '#ff4444', fontSize: '0.9rem' }}>Both AI providers are disabled. Chat and Roadmap generation will fail.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'general' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <h3 style={{ color: '#00f3ff', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: '600' }}>General Preferences</h3>
                                <ToggleSwitch
                                    label="Smart Routing"
                                    description="Automatically jump to the most relevant feature based on your activity."
                                    checked={settings.smartRouting}
                                    onChange={() => toggleSetting('smartRouting')}
                                />
                                <ToggleSwitch
                                    label="Auto Save Data"
                                    description="Continuously sync roadmap progress to local storage."
                                    checked={settings.autoSave}
                                    onChange={() => toggleSetting('autoSave')}
                                />
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <h3 style={{ color: '#00f3ff', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: '600' }}>Alerts & Pings</h3>
                                <ToggleSwitch
                                    label="Study Break Alerts"
                                    description="Receive gentle reminders when you have been active for >1 hour."
                                    checked={settings.studyBreakAlerts}
                                    onChange={() => toggleSetting('studyBreakAlerts')}
                                />
                                <ToggleSwitch
                                    label="Proactive Mistake Insights"
                                    description="Allow the Floating AI to pop up immediately when a repeated error is detected."
                                    checked={settings.mistakeInsights}
                                    onChange={() => toggleSetting('mistakeInsights')}
                                />
                            </div>
                        )}

                        {activeTab === 'data' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: '600' }}>Data Management</h3>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                    Manage your local cache and export your Synapse learning profile.
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button style={{
                                        padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                                        backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s'
                                    }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}>
                                        Export Data
                                    </button>
                                    <button style={{
                                        padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid rgba(255, 68, 68, 0.3)',
                                        backgroundColor: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s'
                                    }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 68, 68, 0.2)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 68, 68, 0.1)'}>
                                        Clear Cache
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
