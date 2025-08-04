const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// Your sensitive API credentials - store these securely in environment variables
const DIGITAL_HUMANI_API_KEY = 'DREj41ZyySBWCfY10kYmKyapiEaHLL4NOcR2ngbdMn25PHTP';
const DIGITAL_HUMANI_ENTERPRISE_ID = 'a8e32048';

// A secure endpoint on your server for the front end to call
app.post('/api/plant-tree', async (req, res) => {
    // Extract data from the request body
    const { customerEmail, quantity } = req.body;

    // Basic validation
    if (!customerEmail || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Missing or invalid parameters.' });
    }

    // Digital Humani API endpoint for planting trees
    const apiEndpoint = 'https://api.digitalhumani.com/tree';

    // Construct the request body for the Digital Humani API
    const requestBody = {
        enterpriseId: DIGITAL_HUMANI_ENTERPRISE_ID,
        treeCount: quantity,
        projectId: 1, // Use a specific project ID from Digital Humani
        treeOwner: customerEmail
    };

    try {
        // Make the secure POST request to the Digital Humani API
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'X-Api-Key': DIGITAL_HUMANI_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        // Handle the response from the Digital Humani API
        const data = await response.json();

        if (response.ok) {
            console.log('Tree(s) planted successfully:', data);
            return res.status(200).json({ message: 'Tree(s) planted!', result: data });
        } else {
            console.error('Failed to plant tree(s):', data);
            return res.status(response.status).json({ error: data.error || 'Unknown error from Digital Humani API.' });
        }
    } catch (error) {
        console.error('Error with API request:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});