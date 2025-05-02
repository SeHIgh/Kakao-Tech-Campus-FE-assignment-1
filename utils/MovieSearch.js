import { searchMovies } from "../api/tmdbApi.js";
import { showMovieModal } from "../components/MovieDetailModal.js";
import { debounce } from "./Debounce.js";

export const initSearch = () => {
 
    const searchForm = document.querySelector(".search_box");
    const searchInput = searchForm?.querySelector("input");
    const searchResult = document.querySelector(".search-result");

    // 요소가 없으면 종료
    if (!searchForm || !searchInput || !searchResult) return;

    // 검색 결과 렌더링 함수
    function renderSearchResults(movies) {
        if (movies.length > 0) {
            searchResult.style.display = "block";
            searchResult.innerHTML = movies
                .map(
                    (movie) => `
                    <div class="search-item" data-id="${movie.id}">
                        <img src="https://image.tmdb.org/t/p/w92${
                            movie.poster_path || ""
                        }" alt="${movie.title}" onerror="this.src=''">
                        <span>${movie.title} (${
                        movie.release_date
                            ? movie.release_date.slice(0, 4)
                            : "미상"
                    })</span>
                    </div>
                `
                )
                .join("");
        } else {
            searchResult.style.display = "none";
            searchResult.innerHTML = "";
        }
    }

    const handleSearch = debounce(async (query) => {
        const trimmed = query.trim();
        if (!trimmed) {
            searchResult.style.display = "none";
            return;
        }
        const { results } = await searchMovies(trimmed);
        renderSearchResults(results || []);
    }, 400);

    // 입력할 때마다 디바운스된 검색 실행
    searchInput.addEventListener("input", (e) => {
        handleSearch(e.target.value);
    });

    // 엔터(Submit) 시에도 결과는 동일하게 유지
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleSearch(searchInput.value);
    });

    // 검색 결과 클릭 시 모달 표시 (이벤트 위임)
    searchResult.addEventListener("click", async (e) => {
        const item = e.target.closest(".search-item");
        if (item && !e.target.classList.contains("bookmark-btn")) {

            showMovieModal(item.dataset.id);

            // 선택 후 결과 숨김
            searchResult.style.display = "none";
        }
    });

    // 포커스 아웃 시 결과 숨김
    document.addEventListener("click", (e) => {
        if (
            !searchResult.contains(e.target) &&
            !searchForm.contains(e.target)
        ) {
            searchResult.style.display = "none";
        }
    });
};
