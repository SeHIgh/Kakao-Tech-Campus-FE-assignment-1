export const getBookmarks = () => {
    const bookmarks = localStorage.getItem("bookmarks");
    return bookmarks ? JSON.parse(bookmarks) : [];
};

export const isBookmarked = (movieId) => {
    const bookmarks = getBookmarks();
    return bookmarks.includes(movieId.toString());
};

export const toggleBookmark = (movieId) => {
    const bookmarks = getBookmarks();
    const index = bookmarks.indexOf(movieId);

    if (index === -1) {
        bookmarks.push(movieId);
    } else {
        bookmarks.splice(index, 1);
    }

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    document.dispatchEvent(new CustomEvent("bookmarkChanged"));

    return bookmarks;
};

export const initBookmarks = () => {
    document.addEventListener("click", (e) => {
        if (!e.target.classList.contains("bookmark-btn")) return;
        const movieId = e.target.dataset.id;
        toggleBookmark(movieId);
        e.target.textContent = isBookmarked(movieId)
            ? "북마크 해제"
            : "북마크 추가";
        e.target.classList.toggle("bookmarked", isBookmarked(movieId));
    });

    document.addEventListener("bookmarkChanged", () => {
        import("./components/BookmarkSlider.js").then((module) => {
            module.BookmarkList();
        });
    });
};
