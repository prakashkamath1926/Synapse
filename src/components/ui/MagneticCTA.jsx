import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export function MagneticCTA({ children, href = "#", className = "" }) {
    const buttonRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const btn = buttonRef.current;
        const txt = textRef.current;

        // Smooth, long easing curve (Power4.out)
        const hoverEase = "power4.out";

        const handleMouseMove = (e) => {
            const { left, top, width, height } = btn.getBoundingClientRect();
            const x = (e.clientX - (left + width / 2)) * 0.3; // Magnetic pull strength
            const y = (e.clientY - (top + height / 2)) * 0.3;

            gsap.to(btn, { x, y, duration: 1, ease: hoverEase });
            // Parallax text inside
            gsap.to(txt, { x: x * 0.5, y: y * 0.5, duration: 1, ease: hoverEase });
        };

        const handleMouseLeave = () => {
            gsap.to(btn, { x: 0, y: 0, duration: 1.5, ease: "elastic.out(1, 0.3)" });
            gsap.to(txt, { x: 0, y: 0, duration: 1.5, ease: "elastic.out(1, 0.3)" });
        };

        btn.addEventListener("mousemove", handleMouseMove);
        btn.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            btn.removeEventListener("mousemove", handleMouseMove);
            btn.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <a
            href={href}
            ref={buttonRef}
            className={`magnetic-cta ${className}`}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem 2.5rem',
                borderRadius: '30px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                textDecoration: 'none',
                fontFamily: 'var(--font-primary)',
                fontWeight: '600',
                letterSpacing: '1px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'background-color 0.3s ease, border-color 0.3s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 243, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(0, 243, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
        >
            <span ref={textRef} style={{ pointerEvents: 'none', display: 'inline-block' }}>
                {children}
            </span>
        </a>
    );
}
