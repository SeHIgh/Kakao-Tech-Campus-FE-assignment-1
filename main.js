import TopMovieSlider from "./module/TopMovieSlider.js";

const API_KEY =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ODQxNTI4NmQ3YjQ1YTk1YWZlMWZiODZmZDE5ZjE3OSIsIm5iZiI6MS43NDYwMjI4NjI5ODU5OTk4ZSs5LCJzdWIiOiI2ODEyMzFjZTM1OWI0ZGY2OWU1NjdiMTUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.cC43S0i1d6M35_qttVnsvL5DKZp5FyDZ8291Yko2tMw";

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
};

// Top10 영화 슬라이더
const slider = new TopMovieSlider({
    target: document.getElementById("slide-box"),
    slideWidth: 400,
    options: options,
});
slider.init();
