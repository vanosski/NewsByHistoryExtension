const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Enable CORS for your Chrome extension
app.use(cors({
    origin: 'chrome-extension://fcffcdpdpihffihadfgohjpembbahbdi' // Replace with your actual extension ID
}));

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Sample function to analyze topics
const analyzeTopics = (historyData, searchQueries) => {
    // Placeholder logic for topic analysis
    // You can implement your LDA or other topic modeling logic here
    const allData = [...historyData, ...searchQueries];
    const uniqueTopics = [...new Set(allData)]; // Simple unique topic extraction
    return uniqueTopics.slice(0, 10); // Return the top 10 topics
};

// Endpoint to analyze topics from browsing history and search queries
app.post('/analyze-topics', (req, res) => {
    const { historyData, searchQueries } = req.body;

    // Validate input data
    if (!Array.isArray(historyData) || historyData.length === 0) {
        return res.status(400).json({ error: "No browsing history provided." });
    }

    // Call the analyzeTopics function
    try {
        const topics = analyzeTopics(historyData, searchQueries);
        const topicsText = topics.join("\n"); // Convert the array to a string for easy display
        res.json({ topics: topicsText }); // Send back the topics in JSON format
    } catch (error) {
        console.error('Error processing topics:', error);
        return res.status(500).json({ error: "Error processing topics." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
