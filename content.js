const observer = new MutationObserver(() => addBookmarkButton());

observer.observe(document.body, { childList: true, subtree: true });

addBookmarkButton();

function addBookmarkButton() {
  if (!onProblemsPage() || document.getElementById("bookmark-button")) return;

  const problemNav = document.querySelector(
    ".coding_nav_bg__HRkIn.p-2.nav.nav-pills.w-100 ul"
  );

  const bookmarkButton = document.createElement("img");
  bookmarkButton.src = chrome.runtime.getURL("assets/bookmark.png");
  bookmarkButton.alt = "bookmark-button";
  bookmarkButton.id = "bookmark-button";
  bookmarkButton.style.height = "30px";
  bookmarkButton.style.width = "30px";
  bookmarkButton.style.cursor = "pointer";

  problemNav.appendChild(bookmarkButton);
}

function onProblemsPage() {
  return window.location.pathname.startsWith("/problems");
}
