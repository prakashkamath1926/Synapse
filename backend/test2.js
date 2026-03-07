import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function test() {
    try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openrouter/free',
                messages: [{ role: 'user', content: 'Create a JSON roadmap for React Developer. Return ONLY JSON.' }]
            })
        });

        const json = await res.json();
        fs.writeFileSync('err.json', JSON.stringify(json, null, 2));
        console.log("Wrote err.json");
    } catch (e) {
        console.error(e);
    }
}

test();
