const AZ_PROBLEMS = "AZ_PROBLEMS";

const bookmarkSection = document.getElementById("bookmarks");

const imgMap = {
  play: chrome.runtime.getURL("assets/play.png"),
  delete: chrome.runtime.getURL("assets/delete.png"),
};

getBookmarks();

function getBookmarks() {
  chrome.storage.sync.get([AZ_PROBLEMS], (result) => {
    const bookmarks = result[AZ_PROBLEMS] || [];
    displayBookmarks(bookmarks);
  });
}

function displayBookmarks(bookmarks) {
  if (bookmarks.length === 0) {
    bookmarkSection.innerHTML = "<i>No bookmarks found</i>";
    return;
  }

  bookmarks.forEach((bookmark) => createBookmark(bookmark));
}

function createBookmark(bookmarkObj) {
  const bookmark = document.createElement("div");
  bookmark.className = "bookmark";

  const bookmarkTitle = document.createElement("div");
  bookmarkTitle.className = "bookmark-title";
  bookmarkTitle.textContent = bookmarkObj.name;

  const bookmarkControls = document.createElement("div");
  bookmarkControls.className = "bookmark-controls";
  bookmarkControls.setAttribute("url", bookmarkObj.url);
  bookmarkControls.setAttribute("problem-id", bookmarkObj.id);

  setAttributes(imgMap["play"], onPlay, bookmarkControls);
  setAttributes(imgMap["delete"], onDelete, bookmarkControls);

  bookmark.append(bookmarkTitle);
  bookmark.append(bookmarkControls);

  bookmarkSection.append(bookmark);
}

function setAttributes(src, handler, parentDiv) {
  const imgEl = document.createElement("img");
  imgEl.src = src;

  imgEl.addEventListener("click", handler);

  parentDiv.append(imgEl);
}

function onPlay(event) {
  const url = event.target.parentNode.getAttribute("url");

  window.open(url, "_blank");
}

function onDelete(event) {
  const id = event.target.parentNode.getAttribute("problem-id");
  const bookmarkItem = event.target.parentNode.parentNode;

  bookmarkItem.remove();

  removeBookmark(id);
}

function removeBookmark(idToRemove) {
  chrome.storage.sync.get([AZ_PROBLEMS], (result) => {
    const bookmarks = result[AZ_PROBLEMS] || [];
    const updatedBookmarks = bookmarks.filter(
      (bookmark) => bookmark.id !== idToRemove
    );

    chrome.storage.sync.set({ AZ_PROBLEMS: updatedBookmarks }, () => {
      if (updatedBookmarks.length === 0) {
        bookmarkSection.innerHTML = "<i>No bookmarks found</i>";
      }
    });
  });
}
