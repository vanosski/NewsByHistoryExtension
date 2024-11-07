chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});

// Function to fetch browsing history
async function getBrowsingHistory() {
  const history = await chrome.history.search({ text: '', maxResults: 100 });
  return history.map(item => item.title || item.url).join(" ");
}

// Function to call the backend API
async function sendToBackend(prompt) {
  const response = await fetch("https://newsbyhistory.onrender.com/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });

  const data = await response.json();

  // Log the response structure for debugging
  console.log("Backend response:", data);

  // Directly return the generated text from the backend response
  return data.response || "Failed to generate content.";
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getHistoryAndGenerate") {
    getBrowsingHistory().then(async (historyText) => {
      const prompt = `"
      
"Analyze the following browsing history and identify the top 5 most relevant fields. For each selected field, provide a concise news summary, no longer than 3 lines, focused on the latest developments. The news should be up-to-date, informative, and clear. The topics/fields are:
Format for news:
TOP NEWS BASED ON YOUR SEARCH HISTORY 

In [Newspaper style headline for the Field] 
new line  [Provide in style of news paper article concise news summary of no more than 3 lines, focusing on the most recent developments.]
Here is the search history:${historyText}`;
      const result = await sendToBackend(prompt);
      sendResponse({ result: result });
    });
    return true; // Indicates async response
  }
});
