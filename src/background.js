chrome.runtime.onInstalled.addListener(() => {
  console.log('hi, gH')
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchActivities' || message.action === 'fetchRepoData') {
    const { url, options } = message.payload;
    fetch(url, options)
      .then(response => response.json())
      .then(data => sendResponse(data))
      .catch(error => sendResponse({ error }));
    return true; // Needed to indicate that we will send a response asynchronously
  }
});