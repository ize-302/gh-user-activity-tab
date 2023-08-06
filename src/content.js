// close dialog method
function closeDialog() {
  $('#ghua-body').empty() // remove list items
  let dialog = $('#ghua-extension')
  dialog.removeAttr('open')
  $('body').css({ overflow: 'auto' })
}

// API CALLS
function sendMessageToBackground(action, payload) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ action, payload }, response => {
      resolve(response);
    });
  });
}

async function fetchActivities() {
  // EVENT TYPES - https://docs.github.com/en/webhooks-and-events/events/github-event-types
  const apiUrl = `https://api.github.com/users${window.location.pathname}/events/public?per_page=100`;
  const apiOptions = {
    method: 'GET',
  };
  const activities = await sendMessageToBackground('fetchActivities', {
    url: apiUrl,
    options: apiOptions,
  });
  if (!activities.error) {
    let filteredactivities = activities.filter(activity => ['PublicEvent', 'WatchEvent', 'ReleaseEvent', 'PushEvent'].includes(activity.type))
    let ghuaBodyElem = $('#ghua-body')
    let row = ''
    filteredactivities.map(activity => {
      let repoLinkElem = `<a href='https://github.com/${activity.repo.name}' class='Link--primary no-underline wb-break-all' target='_blank'>${activity.repo.name}</a>`
      row = '<div>'
      console.log(activity)
      switch (activity.type) {
        // PublicEvent
        case 'PublicEvent':
          row += `<span class='color-fg-muted' style="display: flex; align-items: center; gap: 4px">
          <img src='${chrome.runtime.getURL("assets/world.svg")}' width='16px' /> made ${repoLinkElem} public
          · ${dayjs(activity.created_at).format('DD MMM YYYY')} 
          </span>`;
          break;
        // WatchEvent
        case 'WatchEvent':
          row += `<span class='color-fg-muted' style="display: flex; align-items: center; gap: 4px"><img src='${chrome.runtime.getURL("assets/star.svg")}' width='16px' /> starred ${repoLinkElem}
          · ${dayjs(activity.created_at).format('DD MMM YYYY')} 
          </span>`;
          break;
        // PushEvent
        case 'PushEvent':
          row += `<span class='color-fg-muted' style="display: flex; align-items: center; gap: 4px"><img src='${chrome.runtime.getURL("assets/git-commit.svg")}' width='16px' /> created a 
          <a href='https://github.com/${activity.repo.name}/commit/${activity?.payload?.commits[0]?.sha}' class='Link--primary no-underline wb-break-all' target='_blank'>commit</a>
          to ${repoLinkElem}
          · ${dayjs(activity.created_at).format('DD MMM YYYY')} 
          </span>`;
          break;
        // PushEvent
        case 'PushEvent':
          row += `<span class='color-fg-muted' style="display: flex; align-items: center; gap: 4px">
          <img src='${chrome.runtime.getURL("assets/git-commit.svg")}' width='16px' />pushed a 
          <a href='https://github.com/${activity.repo.name}/commit/${activity?.payload?.commits[0]?.sha}' class='Link--primary no-underline wb-break-all' target='_blank'>commit</a>
          to ${repoLinkElem}
          · ${dayjs(activity.created_at).format('DD MMM YYYY')} 
          </span>`;
          break;
        // ReleaseEvent
        case 'ReleaseEvent':
          row += `<span class='color-fg-muted' style="display: flex; align-items: center; gap: 4px">
          <img src='${chrome.runtime.getURL("assets/tag.svg")}' width='16px' />released 
          <a href='${activity?.payload?.release?.html_url}' class='Link--primary no-underline wb-break-all' target='_blank'>${activity?.payload?.release?.tag_name}</a>
          of ${repoLinkElem}
          · ${dayjs(activity.created_at).format('DD MMM YYYY')} 
          </span>`;
      }
      row += `</div>`
      ghuaBodyElem.append(row)
    })
  } else {
    console.error('API Request Error:', activities.error);
  }
}

let isProfile = document.querySelector('body').classList.contains('page-profile') // is current page a profile page?

$(document).ready(() => {
  if (isProfile) {
    // create new li element for activities. append activitiesTabElem to parent nav
    $.get(chrome.runtime.getURL('/activityTab.html'), (data) => {
      $(data).appendTo('ul.UnderlineNav-body')[0];
      $("#activitiesTab img").attr("src", chrome.runtime.getURL("assets/activity.svg"));
      $('#activitiesTab img:last-child').attr("src", chrome.runtime.getURL("assets/fire.gif")).attr('width', '16px')
    });

    // Append extension into the current page
    $.get(chrome.runtime.getURL('/content.html'), (data) => {
      $(data).appendTo('body');
      $("#ghua-close img").attr("src", chrome.runtime.getURL("assets/close.svg"));
      $("#ghua-username").text(window.location.pathname.replace('/', ''));
    });

    //open dialog when activity tab is clicked
    $(document).on("click", "ul.UnderlineNav-body li:last-child", function () {
      let dialog = $('#ghua-extension')
      dialog.attr('open', true) // opens dialog
      $('body').css({ overflow: 'hidden' })
      fetchActivities();
    });

    // close dialog when overlay is clicked
    $(document).on("click", "#ghua-overlay", function () {
      closeDialog()
    });
    // close dialog when close button is triggered
    $(document).on("click", "#ghua-close", function () {
      closeDialog()
    });
  }
});

