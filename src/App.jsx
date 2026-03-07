import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { NeuralCanvas } from './components/3d/NeuralCanvas';
import { Sidebar } from './components/ui/Sidebar';
import { MagneticCTA } from './components/ui/MagneticCTA';
import { TimetableChart } from './components/features/TimetableChart';
import { RoadmapGenerator } from './components/features/RoadmapGenerator';
import { MotivationAgent } from './components/features/MotivationAgent';
import { ErrorFeedbackSystem } from './components/features/ErrorFeedbackSystem';
import { FocusMode } from './components/features/FocusMode';
import { VisualSummary } from './components/features/VisualSummary';
import { ImageFeedback } from './components/features/ImageFeedback';
import { PeerCollab } from './components/features/PeerCollab';
import { FloatingAI } from './components/features/FloatingAI';
import gsap from 'gsap';

function Section({ id, children }) {
    const ref = useRef(null);

    useEffect(() => {
        gsap.fromTo(ref.current,
            { opacity: 0, y: 40, filter: 'blur(8px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power4.out' }
        );
    }, []);

    return (
        <section
            id={id}
            ref={ref}
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem 4rem 4rem 5rem',
                position: 'relative',
                zIndex: 10
            }}
        >
            {children}
        </section>
    );
}

function App() {
    const [activeSection, setActiveSection] = useState('roadmap');

    const handleNavigate = (sectionId) => {
        setActiveSection(sectionId);
        const el = document.getElementById(sectionId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const sections = ['roadmap', 'schedule', 'focus', 'visual', 'errors', 'photo', 'collab'];
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { threshold: 0.4 });

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />
            <MotivationAgent />
            <FloatingAI />

            <div className="fixed-canvas">
                <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                    <color attach="background" args={['#000000']} />
                    <ambientLight intensity={0.5} />
                    <NeuralCanvas />
                </Canvas>
            </div>

            <div className="app-container" style={{ marginLeft: '60px' }}>
                {/* 1: Hero + Roadmap */}
                <Section id="roadmap">
                    <div style={{ width: '100%', maxWidth: '1000px' }}>
                        <h1 className="intelligence-glow" style={{ fontSize: '5vw', color: 'white', marginBottom: '1rem' }}>
                            Synapse
                        </h1>
                        <p style={{ maxWidth: '500px', fontSize: '1.2rem', marginBottom: '3rem' }}>
                            Your AI-powered learning companion. Tell us what you want to master, and we'll build a personalized roadmap that adapts to your pace, your schedule, and your progress.
                        </p>
                        <RoadmapGenerator />
                    </div>
                </Section>

                {/* 2: Schedule */}
                <Section id="schedule">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1000px' }}>
                        <h2 className="intelligence-glow" style={{ fontSize: '3vw', color: 'white' }}>Your Learning Schedule</h2>
                        <p style={{ marginTop: '1rem', marginBottom: '2rem', textAlign: 'center', maxWidth: '600px' }}>
                            Organize your day around learning. Choose time-based blocks or a flexible task list — whichever fits your style.
                        </p>
                        <TimetableChart />
                        <div style={{ marginTop: '2rem' }}>
                            <MagneticCTA href="#schedule">SAVE SCHEDULE</MagneticCTA>
                        </div>
                    </div>
                </Section>

                {/* 3: Focus Mode */}
                <Section id="focus">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1000px' }}>
                        <h2 className="intelligence-glow" style={{ fontSize: '3vw', color: 'white' }}>Stay Focused</h2>
                        <p style={{ marginTop: '1rem', marginBottom: '2rem', textAlign: 'center', maxWidth: '600px' }}>
                            Use the Pomodoro technique to study in focused bursts. The system will remind you to rest when it's time.
                        </p>
                        <FocusMode />
                    </div>
                </Section>

                {/* 4: Visual Summaries */}
                <Section id="visual">
                    <div style={{ width: '100%', maxWidth: '1000px' }}>
                        <h2 className="intelligence-glow" style={{ fontSize: '3.5vw', color: 'white' }}>
                            Visual Summaries
                        </h2>
                        <p style={{ maxWidth: '600px', fontSize: '1.2rem', marginTop: '1rem', marginBottom: '2rem' }}>
                            Complex topics broken down into simple, step-by-step visual flows. Tap through at your own pace.
                        </p>
                        <VisualSummary />
                    </div>
                </Section>

                {/* 5: Learn From Mistakes */}
                <Section id="errors">
                    <div style={{ width: '100%', maxWidth: '1000px' }}>
                        <h2 className="intelligence-glow" style={{ fontSize: '4vw', color: 'white' }}>
                            Learn From Mistakes
                        </h2>
                        <p style={{ maxWidth: '600px', fontSize: '1.2rem', marginTop: '1rem', marginBottom: '2rem' }}>
                            Paste your solution or answer below. We'll pinpoint exactly where you went wrong and explain the concept you're missing.
                        </p>
                        <ErrorFeedbackSystem />
                    </div>
                </Section>

                {/* 6: Photo Review */}
                <Section id="photo">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1000px' }}>
                        <h2 className="intelligence-glow" style={{ fontSize: '3.5vw', color: 'white' }}>
                            Photo Review
                        </h2>
                        <p style={{ marginTop: '1rem', marginBottom: '2rem', textAlign: 'center', maxWidth: '600px' }}>
                            Snap a picture of your handwritten answer or diagram. We'll tell you what's right, what's missing, and how to improve.
                        </p>
                        <ImageFeedback />
                    </div>
                </Section>

                {/* 7: Peer Collaboration */}
                <Section id="collab">
                    <div style={{ width: '100%', maxWidth: '1000px' }}>
                        <h2 className="intelligence-glow" style={{ fontSize: '3.5vw', color: 'white' }}>
                            Learn Together
                        </h2>
                        <p style={{ maxWidth: '600px', fontSize: '1.2rem', marginTop: '1rem', marginBottom: '2rem' }}>
                            AI gives you a solid starting answer. Peers add real-world examples and insights. The best contributions rise to the top.
                        </p>
                        <PeerCollab />
                    </div>
                </Section>
            </div>
        </>
    );
}

export default App;
