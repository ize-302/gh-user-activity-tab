function sendMessageToBackground(action, payload) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ action, payload }, response => {
      resolve(response);
    });
  });
}

async function fetchDataFromApi() {
  const apiUrl = `https://api.github.com/users${window.location.pathname}/events/public`;
  const apiOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const activities = await sendMessageToBackground('makeApiRequest', {
    url: apiUrl,
    options: apiOptions,
  });
  if (!activities.error) {
    let dialogbodyElem = document.querySelector('.dialogBody')

    // EVENT TYPES - https://docs.github.com/en/webhooks-and-events/events/github-event-types

    activities.map((activity) => {
      console.log(activity)
      let activityElem = document.createElement('div')
      activityElem.innerHTML = activity.id
      dialogbodyElem.appendChild(activityElem)
    })

  } else {
    // Handle the API request error here
    console.error('API Request Error:', activities.error);
  }
}
fetchDataFromApi();

$(document).ready(() => {
  $("#close-button img").attr("src", chrome.runtime.getURL("assets/close.svg"));
  $('#activitiesTab img').attr("src", chrome.runtime.getURL("assets/activity.svg"))
  $('#activitiesTab img:last-child').attr("src", chrome.runtime.getURL("assets/fire.gif")).attr('width', '16px')
});