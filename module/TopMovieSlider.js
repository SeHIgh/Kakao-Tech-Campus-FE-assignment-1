// PopularMovieSlider.js
export default class TopMovieSlider {
    constructor({ target, language = "ko-KR", slideWidth = 400, options }) {
        this.target = target;
        this.language = language;
        this.slideWidth = slideWidth;
        this.currentIndex = 0;
        this.movies = [];
        this.options = options;
    }

    async init() {
        await this.fetchMovies();
        this.render();
        this.attachEvents();
        this.moveSlide(0);
    }

    async fetchMovies() {
        const data = await fetch(
            `https://api.themoviedb.org//3/trending/movie/day?language=${this.language}`,
            this.options
        )
            .then((res) => res.json())
            .catch((err) => console.error(err));
        if (data) {
            this.movies = data.results.slice(0, 10); // 상위 10개 영화만 가져오기
        }
    }

    render() {
        // 슬라이드 컨테이너와 버튼 생성
        this.target.innerHTML = `
        <button id="prevBtn">이전</button>
        <div class="slide-container" id="slides" style="display:flex;transition:transform 0.5s;width:${
            this.slideWidth * 10
        }px"></div>
        <button id="nextBtn">다음</button>
      `;
        // 카드 렌더링
        const slides = this.target.querySelector("#slides");
        slides.innerHTML = this.movies
            .map((movie) => {
                const imgUrl = movie.backdrop_path
                    ? "https://image.tmdb.org/t/p/w500" + movie.backdrop_path
                    : "https://via.placeholder.com/400x225?text=No+Image";
                return `
          <div class="card" style="min-width:${this.slideWidth}px;box-sizing:border-box;padding:10px;">
            <img src="${imgUrl}" alt="${movie.title}" style="width:100%">
            <div class="card-body">
              <h5 class="card-title">${movie.title}</h5>
            </div>
          </div>
        `;
            })
            .join("");
    }

    attachEvents() {
        this.target.querySelector("#prevBtn").addEventListener("click", () => {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.moveSlide(this.currentIndex);
            } else {
                this.currentIndex = this.movies.length - 1; // 마지막 슬라이드로 이동
                this.moveSlide(this.currentIndex);
            }
        });
        this.target.querySelector("#nextBtn").addEventListener("click", () => {
            if (this.currentIndex < this.movies.length - 1) {
                this.currentIndex++;
                this.moveSlide(this.currentIndex);
            } else {
                this.currentIndex = 0; // 첫 번째 슬라이드로 이동
                this.moveSlide(this.currentIndex);
            }
        });
    }

    moveSlide(index) {
        const slides = this.target.querySelector("#slides");
        slides.style.transform = `translateX(-${this.slideWidth * index}px)`;
    }
}
