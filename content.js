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

  if (existingBookmarks.find((bookmark) => bookmark.id === uniqueProblemId)) {
    showToast("Problem already bookmarked");
    return;
  }

  const problemObj = {
    name: problemName,
    url: problemUrl,
    id: uniqueProblemId,
  };

  const updatedBookmarks = [...existingBookmarks, problemObj];

  chrome.storage.sync.set({ AZ_PROBLEMS: updatedBookmarks }, () => {
    console.log("Problem added to bookmarks", updatedBookmarks);
    showToast("Problem bookmarked successfully");
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

function showToast(message) {
  const existingToast = document.getElementById("az-toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.id = "az-toast";
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.top = "40px";
  toast.style.right = "50%";
  toast.style.transform = "translateX(50%)";
  toast.style.background = "#00254d";
  toast.style.color = "#fff";
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "8px";
  toast.style.fontSize = "16px";
  toast.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
  toast.style.zIndex = 9999;
  toast.style.opacity = 1;
  toast.style.transition = "opacity 0.3s";
  toast.style.overflow = "hidden";

  const progress = document.createElement("div");
  progress.style.position = "absolute";
  progress.style.left = 0;
  progress.style.bottom = 0;
  progress.style.height = "4px";
  progress.style.width = "100%";
  progress.style.background = "#ffb300";
  progress.style.transition = "none";
  toast.appendChild(progress);

  document.body.appendChild(toast);

  void progress.offsetWidth;
  progress.style.transition = "width 3s linear";
  progress.style.width = "0%";

  setTimeout(() => {
    toast.style.opacity = 0;
    toast.remove();
  }, 3000);
}
