import React, { useState } from 'react';
import { Map, Calendar, Brain, Eye, AlertTriangle, Camera, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const NAV_ITEMS = [
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'focus', label: 'Focus', icon: Brain },
    { id: 'visual', label: 'Visual Learn', icon: Eye },
    { id: 'errors', label: 'Mistakes', icon: AlertTriangle },
    { id: 'photo', label: 'Photo Review', icon: Camera },
    { id: 'collab', label: 'Collaborate', icon: Users },
];

export function Sidebar({ activeSection, onNavigate }) {
    const [collapsed, setCollapsed] = useState(false);

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

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    padding: '1rem',
                    border: 'none',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
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
        </nav>
    );
}
