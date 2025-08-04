// Import necessary modules
const express = require('express');
const fetch = require('node-fetch'); // You might need to install 'node-fetch'
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON body from incoming requests
app.use(bodyParser.json());

// Your sensitive API credentials - store these securely, e.g., in environment variables
const MORETREES_API_KEY = '4518d405-9872-47ce-934f-b02570227299';
const MORETREES_ACCOUNT_CODE = '2m9ghk';

// A simple API endpoint on your server to handle the tree-planting request
app.post('/api/plant-tree', async (req, res) => {
    // You can get data from the request body, such as a customer's email
    const { customerEmail, quantity } = req.body;

    // Validate that you have the required data
    if (!customerEmail || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Missing or invalid parameters.' });
    }

    // The MoreTrees.eco API endpoint
    const apiEndpoint = 'https://transaction-management-service.platform.moretrees.eco/transaction-management-api/external/plant';

    // Construct the request body for the MoreTrees API
    const requestBody = {
        payment_account_code: MORETREES_ACCOUNT_CODE,
        plant_for_others: true,
        recipients: [
            {
                email: customerEmail,
                name: 'Your Customer', // You can get this from your website's data
                quantity: quantity
            }
        ]
    };

    try {
        // Make the POST request to the MoreTrees.eco API
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'X-API-KEY': MORETREES_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        // Parse the response from the MoreTrees.eco API
        const data = await response.json();

        // Handle a successful response
        if (response.ok) {
            console.log('Tree(s) successfully planted:', data);
            return res.status(200).json({ message: 'Trees planted!', result: data });
        } else {
            // Handle an error response from the API
            console.error('Failed to plant tree(s):', data);
            return res.status(response.status).json({ error: data.error });
        }
    } catch (error) {
        console.error('Error making API request:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start your server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});