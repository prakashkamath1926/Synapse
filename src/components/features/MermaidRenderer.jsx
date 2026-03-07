import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'var(--font-secondary)',
    themeVariables: {
        primaryColor: 'rgba(0, 243, 255, 0.1)',
        primaryTextColor: '#ffffff',
        primaryBorderColor: 'rgba(0, 243, 255, 0.4)',
        lineColor: 'rgba(255, 255, 255, 0.2)',
        secondaryColor: 'rgba(216, 180, 254, 0.1)',
        tertiaryColor: 'rgba(0, 0, 0, 0.4)'
    }
});

export function MermaidRenderer({ chart }) {
    const containerRef = useRef(null);
    const [zoom, setZoom] = useState(1);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.4));
    const handleResetZoom = () => setZoom(1);

    useEffect(() => {
        if (!chart || !containerRef.current) return;

        // Ensure unique IDs to prevent SVG conflicts across renders
        const renderId = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;

        const renderDiagram = async () => {
            try {
                // Clear any existing contents
                containerRef.current.innerHTML = '';

                const { svg, bindFunctions } = await mermaid.render(renderId, chart);
                containerRef.current.innerHTML = svg;

                if (bindFunctions) {
                    bindFunctions(containerRef.current);
                }
            } catch (err) {
                console.error("Mermaid generation failed:", err);
                containerRef.current.innerHTML = `
                    <div style="color: #ff4444; padding: 1rem; text-align: center; border: 1px solid rgba(255,68,68,0.2); border-radius: 8px; background: rgba(0,0,0,0.3);">
                        <p style="margin: 0; font-weight: bold;">Failed to render structural diagram.</p>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; opacity: 0.8;">The AI generated complex overlapping logic that couldn't be correctly visually parsed.</p>
                    </div>
                `;
            }
        };

        renderDiagram();
    }, [chart]);

    return (
        <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>

            {/* Zoom Controls */}
            <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                display: 'flex',
                gap: '0.5rem',
                zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
            }}>
                <button
                    onClick={handleZoomOut}
                    title="Zoom Out"
                    style={{
                        background: 'transparent', border: 'none', color: '#00f3ff', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem',
                        transition: 'opacity 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                    <ZoomOut size={18} />
                </button>
                <button
                    onClick={handleResetZoom}
                    title="Reset Zoom"
                    style={{
                        background: 'transparent', border: 'none', color: '#d8b4fe', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem',
                        transition: 'opacity 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                    <Maximize size={18} />
                </button>
                <button
                    onClick={handleZoomIn}
                    title="Zoom In"
                    style={{
                        background: 'transparent', border: 'none', color: '#00f3ff', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem',
                        transition: 'opacity 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                    <ZoomIn size={18} />
                </button>
            </div>

            <div style={{
                width: '100%',
                overflow: 'auto',
                minHeight: '350px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div
                    ref={containerRef}
                    style={{
                        transform: `scale(${zoom})`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        padding: '2rem'
                    }}
                />
            </div>
        </div>
    );
}
