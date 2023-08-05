let dialogbodyElem = document.querySelector('.dialogBody')
// EVENT TYPES - https://docs.github.com/en/webhooks-and-events/events/github-event-types


function createAppropriateElement(activity) {

  let activityElem = document.createElement('div')
  activityElem.set
  let actionWrapper = document.createElement('div')
  actionWrapper.setAttribute('class', 'actionwrapper color-fg-muted')
  if (activity.type === 'PublicEvent') {
    actionWrapper.innerText = 'Made '
    activityElem.appendChild(actionWrapper)
  }
  if (activity.type === 'WatchEvent') {
    actionWrapper.innerText = 'Starred '
    activityElem.appendChild(actionWrapper)
  }
  if (activity.type === 'ReleaseEvent') {
    actionWrapper.innerText = 'Released '
    activityElem.appendChild(actionWrapper)
    //version
    let versionlinkWrapper = document.createElement('a')
    versionlinkWrapper.setAttribute('href', activity.payload.release.html_url)
    versionlinkWrapper.setAttribute('class', 'Link--primary no-underline wb-break-all')
    versionlinkWrapper.setAttribute('target', '_blank')
    versionlinkWrapper.innerText = activity.payload.release.tag_name
    actionWrapper.appendChild(versionlinkWrapper)
    let span = document.createElement('span')
    span.innerText = ' Of '
    actionWrapper.appendChild(span)
  }
  if (activity.type === 'PublicEvent' || activity.type === 'WatchEvent' || activity.type === 'ReleaseEvent') {
    let linkWrapper = document.createElement('a')
    linkWrapper.setAttribute('href', `https://github.com/${activity.repo.name}`)
    linkWrapper.setAttribute('class', 'Link--primary no-underline wb-break-all')
    linkWrapper.setAttribute('target', '_blank')
    linkWrapper.innerText = activity.repo.name
    actionWrapper.appendChild(linkWrapper)
  }
  if (activity.type === 'PublicEvent') {
    let span = document.createElement('span')
    span.innerText = ' Public 🥫'
    actionWrapper.appendChild(span)
  }
  if (activity.type === 'WatchEvent') {
    let span = document.createElement('span')
    span.innerText = ' ⭐'
    actionWrapper.appendChild(span)
  }
  if (activity.type === 'ReleaseEvent') {
    let span = document.createElement('span')
    span.innerText = ' 🔖'
    actionWrapper.appendChild(span)
  }

  dialogbodyElem.appendChild(activityElem)

}


function sendMessageToBackground(action, payload) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ action, payload }, response => {
      resolve(response);
    });
  });
}

async function fetchActivities() {
  const apiUrl = `https://api.github.com/users${window.location.pathname}/events/public?per_page=100`;
  const apiOptions = {
    method: 'GET',
  };
  const activities = await sendMessageToBackground('fetchActivities', {
    url: apiUrl,
    options: apiOptions,
  });
  if (!activities.error) {
    console.log(activities)
    activities.filter(activity => ['PublicEvent', 'WatchEvent', 'ReleaseEvent'].includes(activity.type)).map((activity) => {
      createAppropriateElement(activity)
    })
  } else {
    // Handle the API request error here
    console.error('API Request Error:', activities.error);
  }
}
fetchActivities();

async function fetchRepoData(url) {
  const apiUrl = url;
  const apiOptions = {
    method: 'GET',
  };
  const repoData = await sendMessageToBackground('fetchRepoData', {
    url: apiUrl,
    options: apiOptions,
  });
  if (!repoData.error) {
    return repoData
  } else {
    // Handle the API request error here
    console.error('API Request Error:', repoData.error);
  }
}

$(document).ready(() => {
  $("#close-button img").attr("src", chrome.runtime.getURL("assets/close.svg"));
  $('#activitiesTab img').attr("src", chrome.runtime.getURL("assets/activity.svg"))
  $('#activitiesTab img:last-child').attr("src", chrome.runtime.getURL("assets/fire.gif")).attr('width', '16px')
});