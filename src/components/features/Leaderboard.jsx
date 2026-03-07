import React from 'react';
import { Target, Flame, MessageSquare, Zap, Award } from 'lucide-react';

export function Leaderboard({ userScore }) {
    // Calculate total Synapse Score formula
    const totalScore = (userScore.consistency * 10) + (userScore.activity * 5) + (userScore.answers * 15);

    const TOP_PEERS = [
        { rank: 1, name: "NeuralNinja", score: 1245 },
        { rank: 2, name: "FrontendMaster", score: 980 },
        { rank: 3, name: "DataSci_Pro", score: 855 },
        { rank: 4, name: "You", score: totalScore, isUser: true }
    ].sort((a, b) => b.score - a.score);

    return (
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', fontFamily: 'var(--font-primary)', marginBottom: '0.5rem' }}>Global Leaderboard</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>Track your gamified Synapse influence against top active peers.</p>
            </div>

            {/* Top Stat Banner */}
            <div className="glass-panel" style={{
                padding: '2.5rem',
                background: 'linear-gradient(135deg, rgba(20,20,25,0.9) 0%, rgba(5,5,8,0.95) 100%)',
                position: 'relative', overflow: 'hidden',
                border: '1px solid rgba(0, 243, 255, 0.2)',
                boxShadow: '0 0 40px rgba(0, 243, 255, 0.05)'
            }}>
                {/* Decorative Glows */}
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(138,43,226,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(0,243,255,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />

                <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '600' }}>
                    <Target size={24} color="#8a2be2" />
                    Your Synapse Score
                </h3>

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '5rem', fontWeight: '900', color: 'transparent', WebkitTextStroke: '1px #00f3ff', fontFamily: 'var(--font-primary)', lineHeight: 1 }}>
                        {totalScore}
                    </span>
                    <span style={{ color: '#00f3ff', fontSize: '1.25rem', fontWeight: '600', paddingBottom: '0.75rem' }}>PTS</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <Flame size={16} color="#ffaa00" /> Consistency Streak
                        </span>
                        <span style={{ color: 'white', fontWeight: '700', fontSize: '1.25rem' }}>{userScore.consistency} days</span>
                    </div>

                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <MessageSquare size={16} color="#00f3ff" /> Questions Asked
                        </span>
                        <span style={{ color: 'white', fontWeight: '700', fontSize: '1.25rem' }}>{userScore.activity}</span>
                    </div>

                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <Zap size={16} color="#8a2be2" /> Insights Shared
                        </span>
                        <span style={{ color: 'white', fontWeight: '700', fontSize: '1.25rem' }}>{userScore.answers}</span>
                    </div>
                </div>
            </div>

            {/* Top Collaborators Standings */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '600' }}>
                    <Award size={24} color="#d8b4fe" />
                    Top Active Peers
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {TOP_PEERS.map((peer, idx) => (
                        <div key={peer.name} style={{
                            display: 'flex', alignItems: 'center', gap: '1.5rem',
                            padding: peer.isUser ? '1rem' : '0.5rem',
                            backgroundColor: peer.isUser ? 'rgba(0, 243, 255, 0.05)' : 'transparent',
                            borderRadius: '12px',
                            border: peer.isUser ? '1px solid rgba(0, 243, 255, 0.2)' : '1px solid transparent',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                backgroundColor: idx === 0 ? 'rgba(255, 170, 0, 0.15)' : idx === 1 ? 'rgba(192, 192, 192, 0.15)' : idx === 2 ? 'rgba(205, 127, 50, 0.15)' : 'rgba(255,255,255,0.03)',
                                border: idx === 0 ? '1px solid rgba(255, 170, 0, 0.4)' : idx === 1 ? '1px solid rgba(192, 192, 192, 0.4)' : idx === 2 ? '1px solid rgba(205, 127, 50, 0.4)' : '1px solid rgba(255,255,255,0.05)',
                                color: idx === 0 ? '#ffaa00' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : 'var(--color-text-secondary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.1rem', fontWeight: '800'
                            }}>
                                {idx + 1}
                            </div>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <span style={{ color: peer.isUser ? '#00f3ff' : 'white', fontSize: '1.1rem', fontWeight: peer.isUser ? '700' : '500' }}>
                                    {peer.name} {peer.isUser && "(You)"}
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                                <span style={{ color: peer.isUser ? '#00f3ff' : 'var(--color-text-secondary)', fontSize: '1.2rem', fontWeight: '700' }}>
                                    {peer.score}
                                </span>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>pts</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
