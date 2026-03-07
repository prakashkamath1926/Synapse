import React, { useState } from 'react';
import { Clock, BookOpen, AlertCircle, Target, CheckCircle, Trash2, X } from 'lucide-react';

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
    const [schedule, setSchedule] = useState(MOCK_TIME_SCHEDULE);
    const [tasks, setTasks] = useState(MOCK_TASK_LIST);

    // Form states for Time-Based
    const [isAddingTime, setIsAddingTime] = useState(false);
    const [newTimeTask, setNewTimeTask] = useState('');
    const [newTimeHour, setNewTimeHour] = useState(12);

    // Form states for Task-Based
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskSubject, setNewTaskSubject] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('medium');

    const handleAddTimeTask = () => {
        if (!newTimeTask.trim()) return;
        const newTask = {
            id: Date.now(),
            hour: parseInt(newTimeHour),
            task: newTimeTask,
            duration: 1,
            type: "math", // Default type
            status: "scheduled"
        };
        // Remove existing task at that hour if any to prevent overlaps
        setSchedule(prev => [...prev.filter(t => t.hour !== newTask.hour), newTask].sort((a, b) => a.hour - b.hour));
        setNewTimeTask('');
        setIsAddingTime(false);
    };

    const handleRemoveTimeTask = (id, e) => {
        if (e) e.stopPropagation();
        setSchedule(prev => prev.filter(t => t.id !== id));
    };

    const toggleTimeStatus = (id) => {
        setSchedule(prev => prev.map(t => {
            if (t.id === id) {
                const nextStatus = t.status === 'scheduled' ? 'completed' : t.status === 'completed' ? 'missed' : 'scheduled';
                return { ...t, status: nextStatus };
            }
            return t;
        }));
    };

    const handleAddGoalTask = () => {
        if (!newTaskName.trim()) return;
        const newTask = {
            id: Date.now(),
            task: newTaskName,
            subject: newTaskSubject || "General",
            priority: newTaskPriority,
            status: "pending"
        };
        setTasks(prev => [...prev, newTask]);
        setNewTaskName('');
        setNewTaskSubject('');
        setNewTaskPriority('medium');
        setIsAddingTask(false);
    };

    const handleRemoveGoalTask = (id, e) => {
        if (e) e.stopPropagation();
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const toggleGoalTaskStatus = (id) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                const nextStatus = t.status === 'pending' ? 'in-progress' : t.status === 'in-progress' ? 'completed' : 'pending';
                return { ...t, status: nextStatus };
            }
            return t;
        }));
    };

    const hours = Array.from({ length: 17 }, (_, i) => i + 6);

    const getTaskForHour = (hour) => schedule.find(item => item.hour === hour);

    const getThemeForId = (id) => {
        const palettes = [
            { bg: 'rgba(15, 45, 80, 0.8)', border: 'rgba(0, 150, 255, 0.6)', text: '#4da6ff' }, // Blue
            { bg: 'rgba(35, 15, 60, 0.8)', border: 'rgba(138, 43, 226, 0.6)', text: '#d8b4fe' }, // Purple
            { bg: 'rgba(60, 30, 10, 0.8)', border: 'rgba(255, 140, 0, 0.6)', text: '#ffb347' }, // Brown
        ];
        const safeId = id || 0;
        return palettes[safeId % 3];
    };

    const getStatusColor = (status, type, id) => {
        if (status === 'completed') return 'rgba(10, 60, 65, 0.8)';
        if (status === 'missed') return 'rgba(70, 25, 25, 0.8)';
        return getThemeForId(id).bg;
    };

    const getStatusBorder = (status, type, id) => {
        if (status === 'completed') return '1px solid rgba(0, 243, 255, 0.6)';
        if (status === 'missed') return '1px solid #ff6464';
        return `1px solid ${getThemeForId(id).border}`;
    };

    const getTaskStatusColor = (status, id) => {
        if (status === 'completed') return { bg: 'rgba(10, 60, 65, 0.8)', border: 'rgba(0, 243, 255, 0.6)', text: '#00f3ff' };
        const theme = getThemeForId(id);
        if (status === 'in-progress') return { bg: theme.bg, border: `2px solid ${theme.border}`, text: theme.text };
        return { bg: theme.bg, border: `1px solid ${theme.border}`, text: 'var(--color-text-secondary)' };
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
                                            onClick={() => toggleTimeStatus(task.id)}
                                            style={{
                                                backgroundColor: getStatusColor(task.status, task.type, task.id),
                                                border: getStatusBorder(task.status, task.type, task.id),
                                                padding: '1rem',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                minHeight: `${Math.max(3, task.duration * 3)}rem`,
                                                position: 'relative',
                                                overflow: 'hidden',
                                                cursor: 'pointer'
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

                                            <div style={{ marginLeft: 'auto' }}>
                                                <button
                                                    onClick={(e) => handleRemoveTimeTask(task.id, e)}
                                                    style={{
                                                        background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px',
                                                        color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s', display: 'flex', alignItems: 'center'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ff6464'}
                                                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : isAddingTime && newTimeHour === hour ? (
                                        <div style={{
                                            border: '1px solid rgba(0, 243, 255, 0.3)',
                                            borderRadius: '8px',
                                            padding: '0.75rem 1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            backgroundColor: 'rgba(0, 243, 255, 0.05)'
                                        }}>
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="What will you study?"
                                                value={newTimeTask}
                                                onChange={(e) => setNewTimeTask(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddTimeTask()}
                                                style={{
                                                    flex: 1, background: 'transparent', border: 'none', color: 'white',
                                                    outline: 'none', fontSize: '0.9rem'
                                                }}
                                            />
                                            <button onClick={handleAddTimeTask} style={{
                                                background: 'rgba(0, 243, 255, 0.2)', border: 'none', color: '#00f3ff',
                                                padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold'
                                            }}>Save</button>
                                            <button onClick={() => setIsAddingTime(false)} style={{
                                                background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
                                                cursor: 'pointer', display: 'flex'
                                            }}>
                                                <X size={16} />
                                            </button>
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
                                            onClick={() => {
                                                setNewTimeHour(hour);
                                                setIsAddingTime(true);
                                                setNewTimeTask('');
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
                        const statusStyle = getTaskStatusColor(task.status, task.id);
                        const priorityStyle = getPriorityTag(task.priority);

                        return (
                            <div
                                onClick={() => toggleGoalTaskStatus(task.id)}
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

                                {/* Priority Tag & Delete */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                                    <button
                                        onClick={(e) => handleRemoveGoalTask(task.id, e)}
                                        style={{
                                            background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px',
                                            color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s', display: 'flex'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#ff6464'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {/* Add Task */}
                    {isAddingTask ? (
                        <div style={{
                            padding: '1rem',
                            border: '1px solid rgba(138, 43, 226, 0.4)',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(138, 43, 226, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Task description..."
                                value={newTaskName}
                                onChange={(e) => setNewTaskName(e.target.value)}
                                style={{
                                    background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white', padding: '8px 12px', borderRadius: '6px', outline: 'none'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Subject (e.g. Math)"
                                    value={newTaskSubject}
                                    onChange={(e) => setNewTaskSubject(e.target.value)}
                                    style={{
                                        flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white', padding: '8px 12px', borderRadius: '6px', outline: 'none'
                                    }}
                                />
                                <select
                                    value={newTaskPriority}
                                    onChange={(e) => setNewTaskPriority(e.target.value)}
                                    style={{
                                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'rgba(255,255,255,0.8)', padding: '8px 12px', borderRadius: '6px', outline: 'none'
                                    }}
                                >
                                    <option style={{ color: 'black' }} value="high">High</option>
                                    <option style={{ color: 'black' }} value="medium">Medium</option>
                                    <option style={{ color: 'black' }} value="low">Low</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                                <button onClick={() => setIsAddingTask(false)} style={{
                                    background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white',
                                    padding: '6px 16px', borderRadius: '6px', cursor: 'pointer'
                                }}>Cancel</button>
                                <button onClick={handleAddGoalTask} style={{
                                    background: 'rgba(138, 43, 226, 0.2)', border: '1px solid rgba(138, 43, 226, 0.5)', color: '#d8b4fe',
                                    padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                                }}>Save Task</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            padding: '1rem',
                            border: '1px dashed rgba(255,255,255,0.1)',
                            borderRadius: '10px',
                            textAlign: 'center',
                            color: 'rgba(255,255,255,0.2)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                            onClick={() => setIsAddingTask(true)}
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
                    )}
                </div>
            )}
        </div>
    );
}
