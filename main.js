import { searchMovies } from "./api/tmdbApi.js";
import { TrendsMovieSlider } from "./components/TrendsMovieSlider.js";
import { debounce } from "./utils/Debounce.js";

// 트렌드 영화 슬라이더
TrendsMovieSlider({
    target: document.getElementById("slide-box")
});

const searchForm = document.querySelector('.search_box');
const searchInput = searchForm.querySelector('input[type="search"]');
const slidesContainer = document.getElementById('slides');

async function renderMovies(movies) {
    slidesContainer.innerHTML = movies.length === 0
        ? '<p>검색 결과가 없습니다.</p>'
        : movies.map(movie => `
            <div class="movie-card" data-id="${movie.id}">
                <img src="https://image.tmdb.org/t/p/w342${movie.poster_path}" alt="${movie.title}" />
                <div class="movie-title">${movie.title}</div>
                <button class="bookmark-btn">북마크</button>
            </div>
        `).join('');
}

// 검색 실행 함수
async function handleSearch(event) {
    event && event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;
    try {
        const data = await searchMovies(query);
        renderMovies(data.results);
    } catch (e) {
        slidesContainer.innerHTML = '<p>검색 중 오류가 발생했습니다.</p>';
    }
}

// 디바운싱 적용
const debouncedSearch = debounce(handleSearch, 400);

// 입력 이벤트 (디바운스)
searchInput.addEventListener('input', debouncedSearch);

// 엔터/버튼으로 검색
searchForm.addEventListener('submit', handleSearch);

// 이벤트 위임 (북마크 버튼)
slidesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('bookmark-btn')) {
        const card = e.target.closest('.movie-card');
        const movieId = card.dataset.id;
        // localStorage에 북마크 저장
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        if (!bookmarks.includes(movieId)) {
            bookmarks.push(movieId);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            e.target.textContent = '✔ 북마크됨';
        }
    }
});
