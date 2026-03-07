import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function NeuralCanvas() {
    const pointsRef = useRef();
    const linesRef = useRef();
    const { camera } = useThree();
    const timeRef = useRef(0);

    const particleCount = 250;
    const maxDistance = 3.5;

    const [positions, lines, colors] = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const col = new Float32Array(particleCount * 3);
        const lin = [];

        const colorBase = new THREE.Color('#00f3ff');
        const colorHighlight = new THREE.Color('#8a2be2');

        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 25;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 25;

            const mixedColor = colorBase.clone().lerp(colorHighlight, Math.random());
            col[i * 3] = mixedColor.r;
            col[i * 3 + 1] = mixedColor.g;
            col[i * 3 + 2] = mixedColor.b;
        }

        // Connect nearby dots with synapse lines
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = pos[i * 3] - pos[j * 3];
                const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < maxDistance) {
                    lin.push(
                        pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
                        pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
                    );
                }
            }
        }

        return [pos, new Float32Array(lin), col];
    }, []);

    useFrame((state, delta) => {
        timeRef.current += delta;

        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.03;
            pointsRef.current.rotation.x += delta * 0.015;
        }
        if (linesRef.current) {
            linesRef.current.rotation.y += delta * 0.03;
            linesRef.current.rotation.x += delta * 0.015;
        }

        camera.position.z = 15 + Math.sin(timeRef.current * 0.1) * 2;
        camera.position.y = Math.sin(timeRef.current * 0.05) * 1;
    });

    return (
        <group>
            {/* Dots */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particleCount}
                        array={positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={particleCount}
                        array={colors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.12}
                    vertexColors
                    transparent
                    opacity={0.8}
                    sizeAttenuation
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Synapse Lines connecting the dots */}
            <lineSegments ref={linesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={lines.length / 3}
                        array={lines}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    color="#00f3ff"
                    transparent
                    opacity={0.12}
                    blending={THREE.AdditiveBlending}
                />
            </lineSegments>
        </group>
    );
}
