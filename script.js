let movies = [];

fetch('movies.json')
  .then(res => res.json())
  .then(data => {
    movies = data;
    initializeApp();
  });

function initializeApp() {
  const list = document.getElementById('movieList');
  const genreFilter = document.getElementById('genreFilter');
  const searchInput = document.getElementById('searchInput');

  // Populate genre dropdown
  const allGenres = new Set();
  movies.forEach(movie => {
    if (movie.Genre) {
      movie.Genre.split(',').forEach(g => allGenres.add(g.trim()));
    }
  });
  [...allGenres].sort().forEach(genre => {
    const opt = document.createElement('option');
    opt.value = genre;
    opt.textContent = genre;
    genreFilter.appendChild(opt);
  });

  // Render movie list
  function render(filteredMovies) {
    list.innerHTML = '';
    filteredMovies.forEach(movie => {
      const li = document.createElement('li');
      li.className = 'movie';
      li.innerHTML = `
        <strong>${movie.Name}</strong>
        <span>🎭 Genre: ${movie.Genre}</span>
        <span>⏱ Runtime: ${movie.Runtime}</span>
        <span>🔞 Rating: ${movie.Rating}</span>
      `;
      list.appendChild(li);
    });
  }

  // Combined filter logic
  function filterMovies() {
    const selectedGenre = genreFilter.value;
    const searchTerm = searchInput.value.toLowerCase();

    const filtered = movies.filter(movie => {
      const matchesGenre =
        selectedGenre === 'All' || (movie.Genre && movie.Genre.includes(selectedGenre));
      const matchesSearch =
        movie.Name && movie.Name.toLowerCase().includes(searchTerm);
      return matchesGenre && matchesSearch;
    });

    render(filtered);
  }

  genreFilter.addEventListener('change', filterMovies);
  searchInput.addEventListener('input', filterMovies);

  // Initial render
  render(movies);

  // Add movie
  document.getElementById('addMovieForm').addEventListener('submit', e => {
    e.preventDefault();

    const newMovie = {
      Name: document.getElementById('name').value,
      Genre: document.getElementById('genre').value,
      Runtime: document.getElementById('runtime').value,
      Rating: document.getElementById('rating').value
    };

    movies.push(newMovie);
    filterMovies();
    e.target.reset();
  });
}
