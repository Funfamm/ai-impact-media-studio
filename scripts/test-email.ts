
async function testSponsorSubmit() {
    console.log('Testing Sponsor Submission...');

    const payload = {
        companyName: "Test Corp",
        contactName: "Test User",
        email: "impact-media@impactaistudio.com", // Keeping a safe email, or I could use something else.
        partnershipType: "Technical",
        message: "This is a test message from the automated test script."
    };

    try {
        const url = 'http://localhost:3000/api/sponsor/submit';
        console.log(`Sending POST request to ${url}`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Success:', data);
        } else {
            console.error('Error:', response.status, response.statusText);
            const text = await response.text();
            console.error('Response body:', text);
        }
    } catch (error) {
        console.error('Request failed:', error);
        console.log('Ensure the dev server is running on http://localhost:3000');
    }
}

testSponsorSubmit();
