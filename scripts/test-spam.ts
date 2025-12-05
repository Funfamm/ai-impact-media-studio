
async function testSpamSubmit() {
    console.log('Testing Spam Submission (Honeypot)...');

    const payload = {
        companyName: "Spam Corp",
        contactName: "Spam Bot",
        email: "spammer@bad-bot.com",
        partnershipType: "Investment",
        message: "I am a bot filling out your form.",
        _honey: "I am a bot" // This should trigger the honeypot
    };

    try {
        const url = 'http://localhost:3000/api/sponsor/submit';
        console.log(`Sending POST request to ${url} with _honey field`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Success (Expected):', data);
            console.log('NOTE: Ensure server logs verify that "Spam detection" was triggered and NO email was sent.');
        } else {
            console.error('Error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
}

testSpamSubmit();
