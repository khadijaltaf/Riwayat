const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.resolve(__dirname, '../.env');
let supabaseUrl = '';
let supabaseKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
        if (line.startsWith('EXPO_PUBLIC_SUPABASE_URL=')) {
            supabaseUrl = line.split('=')[1].trim();
        }
        if (line.startsWith('EXPO_PUBLIC_SUPABASE_ANON_KEY=')) {
            supabaseKey = line.split('=')[1].trim();
        }
    }
} catch (e) {
    console.error('Error reading .env file:', e);
    process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key not found in .env');
    process.exit(1);
}

// Remove trailing slash if present
if (supabaseUrl.endsWith('/')) supabaseUrl = supabaseUrl.slice(0, -1);

async function viewData() {
    const url = `${supabaseUrl}/rest/v1/onboarding_sessions?select=*&order=updated_at.desc&limit=5`;
    console.log(`Fetching from: ${url}`);

    try {
        const response = await fetch(url, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const text = await response.text();
            console.log(`HTTP_STATUS: ${response.status}`);
            console.log(`ERROR_BODY: ${text}`);
            return;
        }

        const data = await response.json();
        console.log('Found', data.length, 'records:');
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

viewData();
