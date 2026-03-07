import React, { useState } from 'react';
import { Network, Sparkles, Target, CheckCircle, Circle } from 'lucide-react';

export function RoadmapGenerator() {
    const [goal, setGoal] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [roadmap, setRoadmap] = useState(null);
    const [completedDays, setCompletedDays] = useState({});

    const toggleDay = (monthId, weekId, dayId) => {
        const key = `${monthId}-${weekId}-${dayId}`;
        setCompletedDays(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!goal) return;

        setIsGenerating(true);
        setRoadmap(null);

        try {
            const response = await fetch('/api/roadmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goal })
            });

            if (!response.ok) throw new Error('API error');
            const data = await response.json();

            // Normalize: ensure topics array exists on each week
            if (data.months) {
                data.months = data.months.map(m => ({
                    ...m,
                    weeks: (m.weeks || []).map(w => ({
                        ...w,
                        topics: w.topics || (w.days ? w.days.map(d => d.topic) : [])
                    }))
                }));
            }

            setRoadmap(data);
        } catch (error) {
            console.error('Roadmap generation failed:', error);
            // Fallback to basic roadmap
            setRoadmap({
                title: `Your Roadmap: ${goal}`,
                months: [
                    { id: 1, title: "Foundation", weeks: [{ id: 1, title: "Getting Started", topics: ["Basics", "Setup", "First Steps"] }, { id: 2, title: "Core Skills", topics: ["Fundamentals", "Practice", "Concepts"] }] },
                    { id: 2, title: "Advanced", weeks: [{ id: 3, title: "Deep Dive", topics: ["Advanced Topics", "Projects", "Best Practices"] }, { id: 4, title: "Mastery", topics: ["Portfolio", "Job Prep", "Review"] }] }
                ]
            });
        }
        setIsGenerating(false);
    };

    return (
        <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Input Section */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <Target className="intelligence-glow" size={24} color="#00f3ff" />
                    <h3 style={{ margin: 0, fontSize: '1.5rem' }}>What do you want to learn?</h3>
                </div>

                <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g. Machine Learning Engineer, React Developer..."
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
                    <button
                        type="submit"
                        disabled={isGenerating || !goal}
                        style={{
                            padding: '0 2rem',
                            borderRadius: '12px',
                            backgroundColor: isGenerating ? 'rgba(255,255,255,0.1)' : 'rgba(0, 243, 255, 0.15)',
                            border: `1px solid ${isGenerating ? 'rgba(255,255,255,0.2)' : 'rgba(0, 243, 255, 0.5)'}`,
                            color: isGenerating ? 'rgba(255,255,255,0.5)' : '#00f3ff',
                            cursor: isGenerating ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s'
                        }}
                    >
                        {isGenerating ? (
                            <>Building your plan...</>
                        ) : (
                            <><Sparkles size={18} /> Generate Roadmap</>
                        )}
                    </button>
                </form>
            </div>

            {/* Roadmap Visualization */}
            {roadmap && (
                <div style={{ animation: 'fadeIn 1s ease-out' }}>
                    <h3 className="intelligence-glow" style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                        {roadmap.title}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
                        {/* Connecting Line */}
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '24px', width: '2px', backgroundColor: 'rgba(0, 243, 255, 0.2)' }} />

                        {roadmap.months.map((month) => (
                            <div key={month.id} className="glass-panel" style={{ padding: '2rem', position: 'relative', marginLeft: '4rem' }}>
                                {/* Node Dot */}
                                <div style={{
                                    position: 'absolute',
                                    left: '-3.7rem',
                                    top: '2.5rem',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: '#00f3ff',
                                    boxShadow: '0 0 15px rgba(0, 243, 255, 0.8)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Network size={14} color="black" />
                                </div>

                                <h4 style={{ color: '#00f3ff', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Month {month.id}: {month.title}</h4>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                    {month.weeks.map(week => (
                                        <div key={week.id} style={{
                                            padding: '1.25rem',
                                            backgroundColor: 'rgba(255,255,255,0.03)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.08)'
                                        }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '1rem', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                                                Week {week.id}: {week.title}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {week.days && week.days.length > 0 ? (
                                                    week.days.map((day, i) => {
                                                        const isCompleted = completedDays[`${month.id}-${week.id}-${day.day || i}`];
                                                        return (
                                                            <div
                                                                key={i}
                                                                onClick={() => toggleDay(month.id, week.id, day.day || i)}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'flex-start',
                                                                    gap: '0.75rem',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s',
                                                                    opacity: isCompleted ? 0.5 : 1
                                                                }}
                                                            >
                                                                <button
                                                                    style={{
                                                                        background: 'none', border: 'none', padding: 0,
                                                                        color: isCompleted ? '#00f3ff' : 'rgba(255,255,255,0.3)',
                                                                        cursor: 'pointer', flexShrink: 0, marginTop: '2px'
                                                                    }}
                                                                >
                                                                    {isCompleted ? <CheckCircle size={16} /> : <Circle size={16} />}
                                                                </button>
                                                                <div style={{
                                                                    color: 'var(--color-text-secondary)',
                                                                    fontSize: '0.95rem',
                                                                    textDecoration: isCompleted ? 'line-through' : 'none',
                                                                    textDecorationColor: '#00f3ff'
                                                                }}>
                                                                    <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Day {day.day || (i + 1)}:</strong> {day.topic}
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontStyle: 'italic' }}>No daily tasks specified</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); filter: blur(10px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }
      `}</style>
        </div>
    );
}
