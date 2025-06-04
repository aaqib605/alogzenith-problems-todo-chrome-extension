const AZ_PROBLEMS = "AZ_PROBLEMS";

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

  bookmarkButton.addEventListener("click", addNewBookmark);
}

function onProblemsPage() {
  return window.location.pathname.startsWith("/problems");
}

async function addNewBookmark() {
  const existingBookmarks = await getCurrentBookmarks();

  const problemName = document.querySelector(
    ".coding_problem_info_heading__G9ueL.fw-bolder.rubik.fs-4.mb-0"
  ).textContent;
  const problemUrl = window.location.href;
  const uniqueProblemId = extractUniqueProblemId(problemUrl);

  if (existingBookmarks.find((bookmark) => bookmark.id === uniqueProblemId))
    return;

  const problemObj = {
    name: problemName,
    url: problemUrl,
    id: uniqueProblemId,
  };

  const updatedBookmarks = [...existingBookmarks, problemObj];

  chrome.storage.sync.set({ AZ_PROBLEMS: updatedBookmarks }, () => {
    console.log("Problem added to bookmarks", updatedBookmarks);
  });
}

function getCurrentBookmarks() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([AZ_PROBLEMS], (result) => {
      resolve(result[AZ_PROBLEMS] || []);
    });
  });
}

function extractUniqueProblemId(url) {
  const pathname = new URL(url).pathname;
  const segments = pathname.split("/");
  return segments.pop();
}
