// Synapse AI API Service — connects to Express backend via Vite proxy
// Vite proxies /api → http://localhost:5000/api (configured in vite.config.js)

const API_URL = '/api';


async function apiRequest(endpoint, body) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API Error ${response.status}: ${errText}`);
    }

    return response.json();
}


// ─── Roadmap Generation ───────────────────────────────────
export async function generateRoadmap(goal) {
    try {
        const data = await apiRequest('/roadmap', { goal });
        return data;
    } catch (error) {
        console.warn('AI API unavailable, using mock data:', error.message);
        return getMockRoadmap(goal);
    }
}

function getMockRoadmap(goal) {
    return {
        title: `Your Roadmap: ${goal}`,
        months: [
            {
                id: 1,
                title: "Foundation Layer",
                weeks: [
                    { id: 1, title: "Core Basics & Syntax", topics: ["Variables", "Control Flow", "Functions"] },
                    { id: 2, title: "Data Structures", topics: ["Arrays", "Hash Maps", "Linked Lists"] }
                ]
            },
            {
                id: 2,
                title: "Application Layer",
                weeks: [
                    { id: 3, title: "State Management", topics: ["Local State", "Global Context", "Reducers"] },
                    { id: 4, title: "Network Requests", topics: ["Fetch API", "Async/Await", "Error Handling"] }
                ]
            }
        ]
    };
}

// ─── Error Analysis ───────────────────────────────────────
export async function analyzeError(code) {
    try {
        const data = await apiRequest('/feedback', { code });
        return data;
    } catch (error) {
        console.warn('AI API unavailable, using mock data:', error.message);
        return getMockErrorAnalysis();
    }
}

function getMockErrorAnalysis() {
    return {
        status: "Error Detected",
        mistake: "You mutated the state directly using `state.value = newValue` instead of using the `setState` function.",
        conceptGap: "React Immutability Principle",
        explanation: "In React, state should never be mutated directly because it prevents React from knowing when to trigger a re-render. Always use the setter function provided by `useState`.",
        suggestion: "Try: `setValue(newValue)`."
    };
}

// ─── Voice Tutor Chat ─────────────────────────────────────
export async function chatWithTutor(message, history = []) {
    try {
        const data = await apiRequest('/chat', { message, history });
        return data.reply;
    } catch (error) {
        console.warn('AI API unavailable, using mock data:', error.message);
        return getMockTutorResponse(message);
    }
}

function getMockTutorResponse(message) {
    const lower = message.toLowerCase();
    if (lower.includes('backpropagation')) {
        return "Backpropagation is how neural networks learn from mistakes. Imagine a student takes a test, gets answers wrong, and then goes back through each question to understand where the errors came from. That's exactly what backprop does — it traces errors backward through the network layers and adjusts each connection (weight) so the network gets a little better next time.";
    } else if (lower.includes('react') || lower.includes('component')) {
        return "React components are like LEGO blocks for your UI. Each block is self-contained — it has its own logic, structure, and appearance. You can nest them, reuse them, and pass data between them using 'props'. The magic is that when the data changes, React automatically updates only the blocks that need to change.";
    } else if (lower.includes('gradient')) {
        return "Gradient descent is like being blindfolded on a hill and trying to reach the bottom. You feel the slope under your feet (that's the gradient) and take a step downhill. Repeat this many times, and you'll reach the valley — which represents the best solution. The 'learning rate' controls how big each step is.";
    }
    return `That's a great question about "${message}". In a full implementation, I would connect to an AI model to give you a thorough, personalized explanation. For now, try asking about backpropagation, React components, or gradient descent!`;
}

// ─── Image Feedback ───────────────────────────────────────
export async function analyzeImage(imageFile) {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`${API_URL}/photo-review`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${API_KEY}` },
            body: formData,
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return response.json();
    } catch (error) {
        console.warn('AI API unavailable, using mock data:', error.message);
        return getMockImageFeedback();
    }
}

function getMockImageFeedback() {
    return {
        score: "7/10",
        strengths: [
            "Clear handwriting and well-organized layout",
            "Correct formula for the quadratic equation"
        ],
        missing: [
            "Step 3 is incomplete — you skipped the discriminant calculation",
            "No units mentioned in the final answer"
        ],
        suggestions: [
            "Always show the discriminant (b²-4ac) step explicitly",
            "Add units to your final answer for full marks",
            "Consider labeling each step for clarity"
        ]
    };
}

// ─── Motivation Engine ────────────────────────────────────
export async function getMotivationState(userProgress) {
    try {
        const data = await apiRequest('/motivation/check', { progress: userProgress });
        return data;
    } catch (error) {
        console.warn('AI API unavailable, using mock cycle');
        return null; // Component will use its built-in mock cycle
    }
}
