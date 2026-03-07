import React, { useState } from 'react';
import { Map, Calendar, Brain, Eye, AlertTriangle, Camera, Users, ChevronLeft, ChevronRight, User, LogOut, Settings, Award } from 'lucide-react';

const NAV_ITEMS = [
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'focus', label: 'Focus', icon: Brain },
    { id: 'visual', label: 'Visual Learn', icon: Eye },
    { id: 'errors', label: 'Mistakes', icon: AlertTriangle },
    { id: 'photo', label: 'Photo Review', icon: Camera },
    { id: 'collab', label: 'Collaborate', icon: Users },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award },
];

export function Sidebar({ activeSection, onNavigate, userProfile, onLogout, onOpenSettings }) {
    const [collapsed, setCollapsed] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: collapsed ? '60px' : '200px',
            backgroundColor: 'rgba(10, 10, 15, 0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
            overflow: 'hidden'
        }}>
            {/* Logo */}
            <div style={{
                padding: collapsed ? '1.5rem 0.75rem' : '1.5rem 1.25rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                justifyContent: collapsed ? 'center' : 'flex-start'
            }}>
                <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: 'linear-gradient(135deg, #00f3ff, #8a2be2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', fontWeight: '900', color: 'black', flexShrink: 0
                }}>
                    S
                </div>
                {!collapsed && (
                    <span style={{
                        fontSize: '1.2rem', fontWeight: '700', color: 'white',
                        fontFamily: 'var(--font-primary)', whiteSpace: 'nowrap'
                    }}>
                        Synapse
                    </span>
                )}
            </div>

            {/* Nav Items */}
            <div style={{ flex: 1, padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: collapsed ? '0.75rem' : '0.75rem 1rem',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: isActive ? 'rgba(0, 243, 255, 0.12)' : 'transparent',
                                color: isActive ? '#00f3ff' : 'var(--color-text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                justifyContent: collapsed ? 'center' : 'flex-start',
                                width: '100%',
                                textAlign: 'left',
                                fontSize: '0.9rem',
                                fontWeight: isActive ? '600' : '400'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.color = 'white';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                                }
                            }}
                        >
                            <Icon size={18} style={{ flexShrink: 0 }} />
                            {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                        </button>
                    );
                })}
            </div>

            {/* Profile & Collapse Container */}
            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Profile Pill */}
                {userProfile && (
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            style={{
                                width: '100%',
                                padding: collapsed ? '0.75rem' : '0.5rem 0.75rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                backgroundColor: showProfileMenu ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                justifyContent: collapsed ? 'center' : 'flex-start',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = showProfileMenu ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)'; }}
                        >
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                backgroundColor: 'rgba(0, 243, 255, 0.2)', color: '#00f3ff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <User size={16} />
                            </div>
                            {!collapsed && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden' }}>
                                    <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>
                                        {userProfile.name}
                                    </span>
                                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>Synapse User</span>
                                </div>
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileMenu && (
                            <div style={{
                                position: 'absolute',
                                bottom: 'calc(100% + 8px)',
                                left: 0,
                                width: collapsed ? '180px' : '100%',
                                backgroundColor: 'rgba(20, 20, 25, 0.95)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                padding: '0.5rem',
                                boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
                                zIndex: 300,
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px'
                            }}>
                                <button
                                    onClick={() => { setShowProfileMenu(false); onOpenSettings(); }}
                                    style={{
                                        width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none',
                                        backgroundColor: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        fontSize: '0.9rem', fontWeight: '500', transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
                                >
                                    <Settings size={16} />
                                    <span>Settings</span>
                                </button>

                                <button
                                    onClick={() => { setShowProfileMenu(false); onLogout(); }}
                                    style={{
                                        width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none',
                                        backgroundColor: 'transparent', color: '#ff4444', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        fontSize: '0.9rem', fontWeight: '500', transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 68, 68, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <LogOut size={16} />
                                    <span>Log Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        padding: '0.5rem',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>
        </nav>
    );
}
