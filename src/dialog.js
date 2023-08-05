// create activities dialog element
var dialog = document.createElement("dialog");
dialog.setAttribute('style', 'position: fixed; border: none; top: 0; left: 0; z-index: 10; background: transparent; width: 100%; height: 100vh; padding: 0;')

function closeDialog() {
  dialog.removeAttribute('open')
  document.querySelector('body').style.overflow = 'auto'
}

// create overlay for dialog, append to dialog
let overlay = document.createElement("div");
overlay.setAttribute('style', 'position: relative; background: rgba(0,0,0,0.4); width: 100%; height: 100%')
overlay.addEventListener('click', function () {
  closeDialog()
})
dialog.appendChild(overlay)

// content for dialog, append to dialog
let dialogContent = document.createElement("div")
dialogContent.setAttribute('class', 'dialog-content-animation')
dialogContent.setAttribute('style', 'background: #161c22; position: absolute; z-ndex: 99; border-right: 1px solid #3E444D; max-width: 500px; width: 100%; top: 0; left: 0; height: 100%')
dialog.appendChild(dialogContent)

// wrapper for dialog heading, append to dialogcontent
let dialogMainHeader = document.createElement('div')
dialogMainHeader.setAttribute('style', 'display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.5rem 0.5rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.05)')
dialogContent.appendChild(dialogMainHeader)

// wrapper for title, append to dialogmainheader
let dialogTitle = document.createElement('h4')
dialogTitle.setAttribute('style', 'font-weight: 400; color: #D9DFE6')
dialogTitle.setAttribute('class', 'Overlay-title')
dialogTitle.innerHTML = window.location.pathname.replace('/', '') + "'s recent activities"
dialogMainHeader.appendChild(dialogTitle)

// wrapper for close button, append to dialog mainheader
let closeButton = document.createElement('button')
closeButton.setAttribute('id', 'close-button')
closeButton.setAttribute('class', 'close-button Overlay-closeButton')
closeButton.addEventListener('click', function () {
  closeDialog()
})
dialogMainHeader.appendChild(closeButton)

// img for button, append to closebutton
let closeButtonImg = document.createElement('img')
closeButton.append(closeButtonImg)

// append dialog element to body
document.querySelector('body').appendChild(dialog)

// INSERT NEW ACTIVITIES TAB WHEN PAGE IS LOADED
$(document).ready(() => {
  var parentElem = $("ul.UnderlineNav-body")[0];
  // create new li element for activities
  var activitiesTabElem = document.createElement("li");
  activitiesTabElem.setAttribute('id', 'activitiesTab')
  activitiesTabElem.setAttribute('data-view-component', 'true')
  activitiesTabElem.setAttribute('class', 'd-inline-flex UnderlineNav-item')
  // activitiesTabElem.style.background = '#171B21';

  // create span element for the tab text abd append to href
  var spanText = document.createElement("span")
  spanText.style.color = '#D9DFE6';
  spanText.setAttribute('data-view-component', 'true')
  spanText.appendChild(document.createTextNode("Activities"));
  let activitiesTabImg = document.createElement('img')
  activitiesTabImg.style.marginRight = '0.5rem'
  activitiesTabElem.appendChild(activitiesTabImg)
  activitiesTabElem.appendChild(spanText)

  // append activitiesTabElem to parent nav
  parentElem.appendChild(activitiesTabElem);

  // ACTIONS
  //open dialog when activity tab is clicked
  $("ul.UnderlineNav-body li:last-child").click(function () {
    dialog.setAttribute('open', true) // opens dialog
    document.querySelector('body').style.overflow = 'hidden'
  });
});
