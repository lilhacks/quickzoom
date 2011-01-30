var new_xpos;
var orig_win_width = window.innerWidth;
var SCROLLBAR_WIDTH = window.outerWidth - document.body.clientWidth;

function tryAdjustView() {
  // annoyingly, scrollTo sometimes fails. don't know why, so use this
  // hacky retry scheme. (mukesh.20110128)
  if (window.pageXOffset != new_xpos) {
    window.scrollTo(new_xpos, window.pageYOffset);
    setTimeout(tryAdjustView, 100);
  }
}

document.addEventListener('click', function(evt) {
  var rel_offset = 0;
  var el = evt.target;

  if (!evt.altKey) { return; }

  do {
    rel_offset += el.offsetLeft;
    el = el.offsetParent;
  } while (el);

  // avoid reflow, for fluid layouts (mukesh.20110128)
  document.body.style.minWidth = document.body.offsetWidth + "px";
  chrome.extension.sendRequest(
    {width: evt.target.offsetWidth + SCROLLBAR_WIDTH + 10});
  new_xpos = rel_offset - 5;
  tryAdjustView();

  evt.preventDefault();
});

document.addEventListener('keyup', function(evt) {
  if (!evt.altKey) { return; }

  if (evt.keyCode == 80) {
    chrome.extension.sendRequest({
      width: document.body.scrollWidth + SCROLLBAR_WIDTH});
    new_xpos = 0;
    tryAdjustView();
  } else if (evt.keyCode == 82) {
    chrome.extension.sendRequest({width: orig_win_width});
    new_xpos = 0;
    tryAdjustView();
  }

  evt.preventDefault();
});
