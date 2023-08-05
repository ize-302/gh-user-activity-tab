$(document).ready(() => {
  $("#close-button img").attr("src", chrome.runtime.getURL("assets/close.svg"));
  $('#activitiesTab img').attr("src", chrome.runtime.getURL("assets/activity.svg"))
});