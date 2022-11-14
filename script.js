function getSelectedOption() {
  return document.getElementById("Movies").value
}
button.addEventListener('click', async () => {
  let response = axios.get("https://api.themoviedb.org/3/search/movie", {
    params: {
      api_key: "e5a15bfef5377c118448ec56598ced79",
      include_adult: "false",
      query: getSelectedOption(),
    }
  });
  response = response.then(moviesData => {
    for (let movie of moviesData.data.results) {
      axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
        params: {
          api_key: "e5a15bfef5377c118448ec56598ced79",
          append_to_response: "videos",
        }
      }).then(movieData => {
        let selectedMovie = movieData.data;
        const movieInfo = document.getElementById('movieInfo');
        const poster = document.getElementById('poster');
        const movieTrailer = document.getElementById('movieTrailer');
        const synopsisHeading = document.getElementById('synopsisHeading');
        const synopsisDescription = document.getElementById('synopsisDescription');
        document.getElementById('display').removeAttribute('hidden');
        const trailers = selectedMovie.videos.results.filter(trailer => trailer.type === "Trailer");
        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        movieTrailer.src = `https://www.youtube.com/embed/${trailers.at(0).key}`;
        let map = {
          "Title": selectedMovie.title,
          "Original title": selectedMovie.original_title,
          "Release Date": selectedMovie.release_date,
          "Genre": [...selectedMovie.genres].map(v => '-' + v.name + '-').join(' '),
          "Revenue": selectedMovie.revenue,
          "Popularity": selectedMovie.popularity,
          "Vote Count": selectedMovie.vote_count,
          "Vote Average": selectedMovie.vote_average,
          "Runtime": selectedMovie.runtime + 'mins'
        };
        movieInfo.innerHTML = '';
        for (let property in map) {
          movieInfo.innerHTML += `<br> ${property}: ${map[property]}`;
        }
        synopsisHeading.innerHTML = "Synopsis";
        synopsisDescription.innerHTML = `${selectedMovie.overview}`;
      });
    }
  });
});