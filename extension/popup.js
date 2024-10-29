document.getElementById("analyzeButton").addEventListener("click", async () => {
    const analyzeButton = document.getElementById("analyzeButton");
    const topicList = document.getElementById("topicList");

    analyzeButton.disabled = true; // Disable button to prevent multiple clicks
    topicList.innerHTML = "Loading..."; // Show loading state

    try {
        // Retrieve browsing history
        const historyItems = await new Promise((resolve, reject) => {
            chrome.history.search({ text: '', maxResults: 100 }, (items) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`Failed to fetch history: ${chrome.runtime.lastError.message}`));
                } else {
                    resolve(items);
                }
            });
        });

        // Extract titles from history items
        const historyData = historyItems.map(item => item.title);
        const searchQueries = []; // TODO: Implement search query retrieval if needed

        // Send request to analyze topics
        const response = await fetch("http://localhost:3000/analyze-topics", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ historyData, searchQueries })
        });

        // Check if the response is okay
        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Network response was not ok: ${errorDetails.error}`);
        }

        // Parse the response
        const result = await response.json();
        topicList.innerHTML = ""; // Clear previous results

        // Display the topics in the UI as plain text
        const topicsArray = result.topics.split("\n"); // Ensure that your backend returns a properly formatted string
        topicsArray.forEach((topic) => {
            const li = document.createElement("li");
            li.textContent = topic; // Set the text directly
            topicList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        topicList.innerHTML = `Error fetching topics: ${error.message}`; // Provide detailed error message
    } finally {
        analyzeButton.disabled = false; // Re-enable button
    }
});
