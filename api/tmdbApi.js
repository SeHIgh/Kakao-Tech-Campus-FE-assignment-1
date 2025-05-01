const API_KEY =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ODQxNTI4NmQ3YjQ1YTk1YWZlMWZiODZmZDE5ZjE3OSIsIm5iZiI6MS43NDYwMjI4NjI5ODU5OTk4ZSs5LCJzdWIiOiI2ODEyMzFjZTM1OWI0ZGY2OWU1NjdiMTUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.cC43S0i1d6M35_qttVnsvL5DKZp5FyDZ8291Yko2tMw";

const OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
};

const BASE_URL = "https://api.themoviedb.org/3";
const LANGUAGE = "ko-KR";

// 영화 트렌드 목록 요청 API
export async function fetchTrendsMovies() {
    try {
        const url = `${BASE_URL}/trending/movie/day?language=${LANGUAGE}`;
        const response = await fetch(url, OPTIONS);
        if (!response.ok) {
            throw new Error("영화 트렌드 목록을 가져오는 데 실패했습니다.");
        }
        const data = await response.json();
        // 실제로 필요한 영화 목록 만 반환하도록 필터링
        return data.results || [];
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
}

// 영화 세부 정보 요청 API
export async function fetchMovieDetail(movieId) {
    try {
        const url = `${BASE_URL}/movie/${movieId}?language=${LANGUAGE}`;
        const response = await fetch(url, OPTIONS);
        if (!response.ok) {
            throw new Error("영화 세부 정보를 가져오는 데 실패했습니다.");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return null;
    }
}
