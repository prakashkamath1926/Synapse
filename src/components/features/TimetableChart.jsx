import React, { useState } from 'react';
import { Clock, BookOpen, AlertCircle, Target, CheckCircle } from 'lucide-react';

// Time-based mock data
const MOCK_TIME_SCHEDULE = [
    { id: 1, hour: 8, task: "Linear Algebra: Matrices", duration: 1, type: "math", status: "completed" },
    { id: 2, hour: 9, task: "Linear Algebra: Exercises", duration: 1, type: "math", status: "completed" },
    { id: 3, hour: 10, task: "Probability: Distributions", duration: 1, type: "stats", status: "missed" },
    { id: 4, hour: 11, task: "Break & Recharge", duration: 0.5, type: "break", status: "scheduled" },
    { id: 5, hour: 14, task: "Python: Data Structures", duration: 2, type: "code", status: "scheduled" },
];

// Task-based mock data
const MOCK_TASK_LIST = [
    { id: 1, task: "Complete Matrix Multiplication exercises", subject: "Linear Algebra", priority: "high", status: "completed" },
    { id: 2, task: "Read Chapter 4: Probability Distributions", subject: "Probability", priority: "high", status: "in-progress" },
    { id: 3, task: "Build a simple REST API", subject: "Python", priority: "medium", status: "pending" },
    { id: 4, task: "Practice 5 LeetCode Easy problems", subject: "DSA", priority: "medium", status: "pending" },
    { id: 5, task: "Review notes on Gradient Descent", subject: "ML Basics", priority: "low", status: "pending" },
];

export function TimetableChart() {
    const [mode, setMode] = useState('time'); // 'time' or 'task'
    const [schedule] = useState(MOCK_TIME_SCHEDULE);
    const [tasks] = useState(MOCK_TASK_LIST);

    const hours = Array.from({ length: 17 }, (_, i) => i + 6);

    const getTaskForHour = (hour) => schedule.find(item => item.hour === hour);

    const getStatusColor = (status, type) => {
        if (status === 'completed') return 'rgba(0, 243, 255, 0.2)';
        if (status === 'missed') return 'rgba(255, 100, 100, 0.2)';
        if (type === 'break') return 'rgba(138, 43, 226, 0.2)';
        return 'rgba(255, 255, 255, 0.05)';
    };

    const getStatusBorder = (status, type) => {
        if (status === 'completed') return '1px solid rgba(0, 243, 255, 0.5)';
        if (status === 'missed') return '1px solid rgba(255, 100, 100, 0.5)';
        if (type === 'break') return '1px solid rgba(138, 43, 226, 0.5)';
        return '1px solid rgba(255, 255, 255, 0.1)';
    };

    const getTaskStatusColor = (status) => {
        if (status === 'completed') return { bg: 'rgba(0, 243, 255, 0.15)', border: 'rgba(0, 243, 255, 0.4)', text: '#00f3ff' };
        if (status === 'in-progress') return { bg: 'rgba(138, 43, 226, 0.15)', border: 'rgba(138, 43, 226, 0.4)', text: '#d8b4fe' };
        return { bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.1)', text: 'var(--color-text-secondary)' };
    };

    const getPriorityTag = (priority) => {
        const colors = {
            high: { bg: 'rgba(255, 100, 100, 0.2)', text: '#ff6464' },
            medium: { bg: 'rgba(255, 200, 50, 0.2)', text: '#ffc832' },
            low: { bg: 'rgba(255, 255, 255, 0.1)', text: 'var(--color-text-secondary)' }
        };
        return colors[priority] || colors.low;
    };

    return (
        <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '2rem', marginTop: '2rem' }}>
            {/* Mode Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 className="intelligence-glow" style={{ fontSize: '1.5rem', margin: 0 }}>
                    {mode === 'time' ? 'Daily Schedule' : 'Today\'s Tasks'}
                </h3>
                <div style={{ display: 'flex', gap: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px' }}>
                    <button
                        onClick={() => setMode('time')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: mode === 'time' ? 'rgba(0, 243, 255, 0.2)' : 'transparent',
                            color: mode === 'time' ? '#00f3ff' : 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Clock size={14} /> Time-Based
                    </button>
                    <button
                        onClick={() => setMode('task')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: mode === 'task' ? 'rgba(138, 43, 226, 0.2)' : 'transparent',
                            color: mode === 'task' ? '#d8b4fe' : 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Target size={14} /> Task-Based
                    </button>
                </div>
            </div>

            {/* TIME-BASED VIEW */}
            {mode === 'time' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {hours.map((hour) => {
                        const task = getTaskForHour(hour);
                        const isCurrentHour = new Date().getHours() === hour;

                        return (
                            <div
                                key={hour}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    backgroundColor: isCurrentHour ? 'rgba(255,255,255,0.08)' : 'transparent',
                                    borderLeft: isCurrentHour ? '3px solid var(--color-intelligence-cyan)' : '3px solid transparent',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ width: '80px', flexShrink: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>
                                    {hour > 12 ? hour - 12 : hour}:00 {hour < 12 ? 'AM' : 'PM'}
                                </div>

                                <div style={{ flex: 1 }}>
                                    {task ? (
                                        <div
                                            style={{
                                                backgroundColor: getStatusColor(task.status, task.type),
                                                border: getStatusBorder(task.status, task.type),
                                                padding: '1rem',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                minHeight: `${Math.max(3, task.duration * 3)}rem`,
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {task.status === 'completed' && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: 'var(--color-intelligence-cyan)' }} />}
                                            {task.status === 'missed' && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: '#ff6464' }} />}

                                            {task.type === 'break' ? <Clock size={18} color="rgba(138, 43, 226, 0.8)" /> :
                                                task.status === 'missed' ? <AlertCircle size={18} color="#ff6464" /> :
                                                    <BookOpen size={18} color="rgba(255,255,255,0.7)" />}

                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1rem', color: task.status === 'missed' ? 'rgba(255,255,255,0.7)' : 'white' }}>
                                                    {task.task}
                                                </h4>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                                                    {task.duration} hr block • {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{
                                            height: '3rem',
                                            border: '1px dashed rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            paddingLeft: '1rem',
                                            color: 'rgba(255,255,255,0.2)',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(0, 243, 255, 0.5)';
                                                e.currentTarget.style.color = 'rgba(0, 243, 255, 0.8)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                                e.currentTarget.style.color = 'rgba(255,255,255,0.2)';
                                            }}
                                        >
                                            + Add a study block
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* TASK-BASED VIEW */}
            {mode === 'task' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {tasks.map((task) => {
                        const statusStyle = getTaskStatusColor(task.status);
                        const priorityStyle = getPriorityTag(task.priority);

                        return (
                            <div
                                key={task.id}
                                style={{
                                    padding: '1rem 1.25rem',
                                    borderRadius: '10px',
                                    backgroundColor: statusStyle.bg,
                                    border: `1px solid ${statusStyle.border}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                            >
                                {/* Status Indicator */}
                                <div style={{
                                    width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                                    border: task.status === 'completed' ? '2px solid #00f3ff' : task.status === 'in-progress' ? '2px solid #d8b4fe' : '2px solid rgba(255,255,255,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: task.status === 'completed' ? 'rgba(0, 243, 255, 0.2)' : 'transparent'
                                }}>
                                    {task.status === 'completed' && <CheckCircle size={14} color="#00f3ff" />}
                                </div>

                                {/* Task Info */}
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: '1rem', color: 'white', fontWeight: '500',
                                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                        opacity: task.status === 'completed' ? 0.6 : 1
                                    }}>
                                        {task.task}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                                        {task.subject}
                                    </div>
                                </div>

                                {/* Priority Tag */}
                                <span style={{
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '4px',
                                    backgroundColor: priorityStyle.bg,
                                    color: priorityStyle.text,
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {task.priority}
                                </span>
                            </div>
                        );
                    })}

                    {/* Add Task */}
                    <div style={{
                        padding: '1rem',
                        border: '1px dashed rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.5)';
                            e.currentTarget.style.color = 'rgba(138, 43, 226, 0.8)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.color = 'rgba(255,255,255,0.2)';
                        }}
                    >
                        + Add a learning goal
                    </div>
                </div>
            )}
        </div>
    );
}
