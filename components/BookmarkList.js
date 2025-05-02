import { fetchMovieDetail } from "../api/tmdbApi.js";
import { toggleBookmark, getBookmarks } from "../utils/Bookmark.js";
import { showMovieModal } from "./MovieDetailModal.js";

export const BookmarkList = async () => {
    const container = document.querySelector(".my-movie-container");
    if (!container) return;

    // 북마크 영화 목록 가져오기
    const bookmarkedIds = getBookmarks();

    // 북마크 추가된 모든 영화 상세 정보 요청
    const moviePromises = bookmarkedIds.map((id) => fetchMovieDetail(id));
    const movies = await Promise.all(moviePromises);

    if (movies.length === 0) {
        container.innerHTML = `<p class="no-bookmark">북마크한 영화가 없습니다.</p>`;
        return;
    }

    // 영화 카드 생성
    container.innerHTML = movies
        .map(
            (movie) => `
            <div class="bookmark-card" data-id="${movie.id}">
                <figure class="card-figure">
                    <img src="https://image.tmdb.org/t/p/w300${
                        movie.poster_path
                    }" 
                        alt="${movie.title}"
                        onerror="this.src='assets/default-poster.jpg'">
                </figure>
                <div class="card-info">
                    <h3>${movie.title}</h3>
                    <div class="card-meta">
                        <span class="card-rating">⭐ ${movie.vote_average.toFixed(
                            1
                        )}</span>
                        <button class="remove-bookmark" data-id="${
                            movie.id
                        }">북마크 해제</button>
                    </div>
                </div>
            </div>
        `
        )
        .join("");

    container.addEventListener("click", handleBookmarkCardClick);
};

// 이벤트 위임 처리
function handleBookmarkCardClick(e) {
    const card = e.target.closest(".bookmark-card");
    const removeBtn = e.target.closest(".remove-bookmark");

    // 삭제 버튼 클릭
    if (removeBtn) {
        e.stopPropagation();
        const movieId = removeBtn.dataset.id;
        toggleBookmark(movieId);
    }

    // 카드 클릭 시 모달 표시
    else if (card) {
        e.preventDefault();
        const movieId = card.dataset.id;
        showMovieModal(movieId);
    }
}
