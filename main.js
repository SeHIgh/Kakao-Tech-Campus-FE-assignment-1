import { BookmarkList } from "./components/BookmarkList.js";
import { TrendsMovieSlider } from "./components/TrendsMovieSlider.js";
import { initBookmarks } from "./utils/Bookmark.js";
import { initSearch } from "./utils/MovieSearch.js";

// 초기화
window.addEventListener("DOMContentLoaded", () => {
    TrendsMovieSlider({ target: document.getElementById("slide-box") });
    initSearch();
    initBookmarks();
    BookmarkList();
});

document.addEventListener("bookmarkChanged", () => {
    BookmarkList();
});
