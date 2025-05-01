import { fetchMovieDetail } from "../api/tmdbApi.js";
import { formattedDate } from "../utils/Format.js";

function renderModal({ movie, onClose }) {
    const existing = document.getElementById("movie-modal");
    if (existing) existing.remove();

    const {
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

    const genreStr = genres.map((g) => g.name).join(", ");
    const companyStr = production_companies.map((c) => c.name).join(", ");

    const modal = document.createElement("div");
    modal.id = "movie-modal";

    // 배경 이미지(backdrop_path)와 어두운 오버레이
    // (페이지 전체를 수정하여 페이지를 이동한 효과)
    modal.innerHTML = `
        <div class="modal-backdrop">
            ${
                backdrop_path
                    ? `<img src="https://image.tmdb.org/t/p/original${backdrop_path}" alt="">`
                    : ""
            }
            <button id="modal-close-btn" aria-label="닫기">&times;</button>
        </div>
        <div class="modal-poster">
            <img src="https://image.tmdb.org/t/p/w400${
                poster_path || ""
            }" alt="${title}">
            <a href="${homepage}" target="_blank" class="modal-link"><span>절찬 스트리밍 중</span></br>보러가기</a>        
        </div>
        <div class="modal-content">
            <h2 class="modal-title">${title}</h2>
            <p class="modal-release-date">개봉일: ${formattedDate(
                release_date
            )}</p>
            <p class="modal-rating">⭐ ${parseFloat(vote_average).toFixed(
                2
            )}</p>
            <p class="modal-runtime">상영시간: ${runtime}분</p>
            <p class="modal-genres">장르: ${genreStr}</p>
            <p class="modal-production">제작사: ${companyStr}</p>
            <p class="modal-overview">${overview || "없어요 ㅠㅠ"}</p>
        </div>
    `;

    // 닫기 버튼 및 배경 클릭 시 모달 닫기
    modal.addEventListener("click", (e) => {
        if (
            e.target.id === "modal-close-btn" ||
            // e.target === modal ||
            e.target.classList.contains("modal-backdrop")
        ) {
            modal.remove();
            if (onClose) onClose();
        }
    });

    document.body.appendChild(modal);
}

export async function showModal(movieId) {
    const movie = await fetchMovieDetail(movieId);
    renderModal({ movie });
}
