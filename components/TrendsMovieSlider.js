import { fetchTrendsMovies } from "../api/tmdbApi.js";
import { formattedDate } from "../utils/Format.js";
import { showMovieModal } from "./MovieDetailModal.js";

function renderSlider({ target, movies, cardsPerSlide, slideWidth }) {
    target.innerHTML = `
        <div class="slide-container" id="slides"></div>
        <div class="slide-btns">
            <button id="prevBtn">이전</button>
            <div class="slide-indicators">
                ${Array.from({
                    length: Math.ceil(movies.length / cardsPerSlide),
                })
                    .map(
                        (_, index) =>
                            `<button class="indicator" data-index="${index}"></button>`
                    )
                    .join("")}
            </div>
            <button id="nextBtn">다음</button>
        </div>
    `;
    const slides = target.querySelector("#slides");
    slides.innerHTML = movies
        .map((movie) => {
            const imgUrl = movie.poster_path
                ? "https://image.tmdb.org/t/p/w400" + movie.poster_path
                : "";
            return `
                <div class="card" data-movie-id="${
                    movie.id
                }" style="min-width:${slideWidth}px;">
                    <a href="#" class="card-link">
                        <figure class="card-figure">
                            <img src="${imgUrl}" alt="${
                movie.title
            }" class="card-img">
                        </figure>
                        <div class="card-body">
                            <div class="card-header">
                                <h5 class="card-title">${movie.title}</h5>
                                <h5 class="card-rating">⭐ ${parseFloat(
                                    movie.vote_average
                                ).toFixed(1)}</h5>
                            </div>
                            <div class="card-footer">
                                <p class="card-date"><span class="card-span">개봉일</span> ${formattedDate(
                                    movie.release_date
                                )}</p>
                                <p class="card-desc"><span class="card-span">요약</span> ${
                                    movie.overview
                                        ? movie.overview
                                        : "줄거리가 없습니다."
                                }</p>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        })
        .join("");
}

// 슬라이드 이동 함수
function moveSlide({ target, index, cardsPerSlide, slideWidth }) {
    const slides = target.querySelector("#slides");
    slides.style.display = "flex";
    slides.style.transition = "transform 0.5s";
    slides.style.width = `${slideWidth * 10}px`;
    slides.style.transform = `translateX(-${
        (slideWidth + 20) * index * cardsPerSlide
    }px)`;
    updateIndicators(target, index);
}

// 인디케이터 업데이트 함수
function updateIndicators(target, currentIndex) {
    const indicators = target.querySelectorAll(".indicator");
    indicators.forEach((indicator, idx) => {
        if (idx === currentIndex) {
            indicator.style.backgroundColor = "#6a89cc";
            indicator.style.transform = "scale(1.3)";
        } else {
            indicator.style.backgroundColor = "lightgray";
            indicator.style.transform = "scale(1)";
        }
    });
}

// 이벤트 위임 함수
function attachEvents({
    target,
    movies,
    cardsPerSlide,
    // slideWidth,
    getCurrentIndex,
    setCurrentIndex,
    moveSlideFn,
}) {
    target.addEventListener("click", (e) => {
        const card = e.target.closest(".card");
        if (card) {
            e.preventDefault();
            const movieId = card.getAttribute("data-movie-id");
            showMovieModal(movieId);
            return;
        }
        // 이전 버튼
        if (e.target.id === "prevBtn") {
            let currentIndex = getCurrentIndex();
            currentIndex =
                currentIndex > 0
                    ? currentIndex - 1
                    : Math.ceil(movies.length / cardsPerSlide) - 1;
            setCurrentIndex(currentIndex);
            moveSlideFn(currentIndex);
            return;
        }
        // 다음 버튼
        if (e.target.id === "nextBtn") {
            let currentIndex = getCurrentIndex();
            currentIndex =
                currentIndex < Math.ceil(movies.length / cardsPerSlide) - 1
                    ? currentIndex + 1
                    : 0;
            setCurrentIndex(currentIndex);
            moveSlideFn(currentIndex);
            return;
        }
        // 인디케이터 클릭
        if (e.target.classList.contains("indicator")) {
            const index = Number(e.target.dataset.index);
            setCurrentIndex(index);
            moveSlideFn(index);
            return;
        }
    });
}

// 메인 슬라이더 함수
export async function TrendsMovieSlider({ target }) {
    let movies = [];
    let currentIndex = 0;
    const cardsPerSlide = 5;
    const slideWidth = 240;

    // 데이터 요청 (async/await)
    movies = await fetchTrendsMovies();

    // 렌더링
    renderSlider({ target, movies, cardsPerSlide, slideWidth });

    // 이벤트 위임
    attachEvents({
        target,
        movies,
        cardsPerSlide,
        slideWidth,
        getCurrentIndex: () => currentIndex,
        setCurrentIndex: (idx) => {
            currentIndex = idx;
        },
        moveSlideFn: (idx) =>
            moveSlide({ target, index: idx, cardsPerSlide, slideWidth }),
    });

    // 초기 슬라이드 위치
    moveSlide({ target, index: 0, cardsPerSlide, slideWidth });
}
