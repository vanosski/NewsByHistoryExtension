document.getElementById("fetchHistory").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "getHistoryAndGenerate" }, (response) => {
    // Store the result in a variable
    let formattedResult = response.result;

    // Remove any '#' or '*' characters from the result
    formattedResult = formattedResult.replace(/[#*]/g, "");

    // Split the result by newlines (assuming each paragraph is separated by a newline)
    const paragraphs = formattedResult.split(/\n+/);

    // Wrap each paragraph in a <p> tag with a unique ID
    formattedResult = paragraphs
      .map((paragraph, index) => `<p id="newsResult-${index}">${paragraph}</p>`)
      .join("");

    // Set the formatted result to the output element
    document.getElementById("output").innerHTML = formattedResult;
  });
});
