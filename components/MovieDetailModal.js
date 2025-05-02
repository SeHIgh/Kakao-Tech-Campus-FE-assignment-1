import { fetchMovieDetail } from "../api/tmdbApi.js";
import { isBookmarked, toggleBookmark } from "../utils/Bookmark.js";
import { formattedDate } from "../utils/Format.js";

function renderModal({ movie, onClose }) {
    const existingModal = document.getElementById("movie-modal");
    if (existingModal) existingModal.remove();

    const {
        id,
        title,
        poster_path,
        backdrop_path,
        release_date,
        vote_average,
        overview,
        genres = [],
        runtime,
        production_companies = [],
        homepage,
    } = movie;

    const genreStr = genres.map((g) => g.name).join(", ") || "정보 없음";
    const companyStr =
        production_companies.map((c) => c.name).join(", ") || "정보 없음";
    const bookmarked = isBookmarked(id);

    const modal = document.createElement("div");
    modal.id = "movie-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-labelledby", "modal-title");
    modal.setAttribute("aria-modal", "true");

    // 이미지 URL 처리
    const posterUrl = poster_path
        ? `https://image.tmdb.org/t/p/w400${poster_path}`
        : "";
    const backdropUrl = backdrop_path
        ? `https://image.tmdb.org/t/p/original${backdrop_path}`
        : "";

    modal.innerHTML = `
        <div class="modal-backdrop" role="presentation">
            ${
                backdropUrl
                    ? `<img src="${backdropUrl}" alt="${title} 배경" loading="lazy">`
                    : ""
            }
            <button id="modal-close-btn" aria-label="모달 닫기">&times;</button>
        </div>
        <div class="modal-poster">
            <img src="${posterUrl}" alt="${title} 포스터" loading="lazy">
            ${
                homepage
                    ? `<a href="${homepage}" target="_blank" rel="noopener" class="modal-link">
                        <span>절찬 스트리밍 중</span><br>보러가기
                       </a>`
                    : ""
            }        
        </div>
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title" class="modal-title">${title}</h2>
                <button class="bookmark-btn ${bookmarked ? "bookmarked" : ""}" 
                        data-id="${id}"
                        aria-label="${
                            bookmarked ? "북마크 해제" : "북마크 추가"
                        }">
                    ${bookmarked ? "북마크 해제" : "북마크 추가"}
                </button>
            </div>
            <p class="modal-release-date">개봉일: ${formattedDate(
                release_date
            )}</p>
            <p class="modal-rating">⭐ ${parseFloat(vote_average).toFixed(
                2
            )}</p>
            <p class="modal-runtime">상영시간: ${runtime || "정보 없음"}분</p>
            <p class="modal-genres">장르: ${genreStr}</p>
            <p class="modal-production">제작사: ${companyStr}</p>
            <p class="modal-overview">${
                overview || "줄거리 정보가 없습니다."
            }</p>
        </div>
    `;

    // ESC 키 핸들러
    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            modal.remove();
            document.removeEventListener("keydown", handleKeyDown);
            if (onClose) onClose();
        }
    };

    // 이벤트 바인딩
    modal.addEventListener("click", (e) => {
        if (
            e.target.id === "modal-close-btn" ||
            e.target.classList.contains("modal-backdrop")
        ) {
            modal.remove();
            document.removeEventListener("keydown", handleKeyDown);
            if (onClose) onClose();
        }
    });

    document.addEventListener("keydown", handleKeyDown);
    document.body.appendChild(modal);
}

export function showModal({ movie }) {
    if (!movie) return;
    renderModal({ movie });
}

export async function showMovieModal(movieId) {
    try {
        const movie = await fetchMovieDetail(movieId);
        if (movie) renderModal({ movie });
    } catch (error) {
        console.error("영화 정보 조회 실패:", error);
        alert("영화 정보를 불러오는 데 실패했습니다.");
    }
}
