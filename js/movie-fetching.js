document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id'); // Get the movie ID from the URL

    if (!movieId) {
        console.error("Error: No movie ID provided in the URL.");
        displayError("No movie ID provided in the URL.");
        return;
    }

    const apiKey = 'a8944139f76a389d1f1cf59b26aba5df'; // API key
    const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`; // API endpoint

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch movie data');
        }

        const movieData = await response.json();
        console.log(movieData); // Log the movie data for debugging

        if (movieData) {
            // Extract genres as a comma-separated string
            const genres = Array.isArray(movieData.genres) ? movieData.genres.map(genre => genre.name).join(', ') : 'N/A';

            // Construct the image URL
            const imageUrl = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;

            // Update the DOM elements with the fetched data
            document.getElementById('moviePoster').src = imageUrl || 'images/default-movie.jpg';
            document.getElementById('moviePoster').alt = `${movieData.title} Poster`;

            document.getElementById('movieTitle').textContent = movieData.title || 'N/A';
            document.getElementById('movieGenre').innerHTML = `<strong>Genre:</strong> ${genres}`;
            document.getElementById('movieReleaseDate').innerHTML = `<strong>Release Date:</strong> ${movieData.release_date || 'N/A'}`;
            document.getElementById('movieRating').innerHTML = `<strong>Rating:</strong> ${movieData.vote_average ? movieData.vote_average + '/10' : 'N/A'}`;
            document.getElementById('movieDescription').innerHTML = `<strong>Description:</strong> ${movieData.overview || 'No description available.'}`;
        } else {
            displayError("No movie details found for the provided ID.");
        }
    } catch (error) {
        console.error('Error fetching movie data:', error);
        displayError("Error fetching movie details. Please try again later.");
    }
});

// Error handling function
function displayError(message) {
    const titleElement = document.getElementById('movieTitle');
    const descriptionElement = document.getElementById('movieDescription');
    const genreElement = document.getElementById('movieGenre');
    const releaseDateElement = document.getElementById('movieReleaseDate');
    const ratingElement = document.getElementById('movieRating');
    const posterElement = document.getElementById('moviePoster');

    if (titleElement) titleElement.textContent = 'Error';
    if (descriptionElement) descriptionElement.textContent = message;
    if (genreElement) genreElement.innerHTML = '';
    if (releaseDateElement) releaseDateElement.innerHTML = '';
    if (ratingElement) ratingElement.innerHTML = '';
    if (posterElement) posterElement.src = 'images/default-movie.jpg';
}
const apiKey = 'a8944139f76a389d1f1cf59b26aba5df';

// Function to fetch movies based on category
async function fetchMovies(category) {
    try {
        const url = `https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}&language=en-US&page=1`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${category} movies: ${response.statusText}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error(error);
        return []; // Return empty array to avoid crashes
    }
}

// Function to create a movie card element
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.setAttribute('data-movie-id', movie.id); // Set movie ID in a data attribute
    const posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
        : 'path/to/placeholder/image.jpg';
    card.innerHTML = `
        <img src="${posterUrl}" alt="${movie.title} Poster">
        <h4>${movie.title}</h4>
    `;
    return card;
}

// Function to populate carousels with movie data
async function populateCarousels() {
    const topRatedMovies = await fetchMovies('top_rated');
    const upcomingMovies = await fetchMovies('upcoming');
    const popularMovies = await fetchMovies('popular');

    const topRatedCarousel = document.getElementById('topRatedMovies');
    const upcomingCarousel = document.getElementById('upcomingMovies');
    const popularCarousel = document.getElementById('popularMovies');

    // Populate Top Rated Movies
    topRatedMovies.forEach(movie => topRatedCarousel.appendChild(createMovieCard(movie)));

    // Populate Upcoming Movies
    upcomingMovies.forEach(movie => upcomingCarousel.appendChild(createMovieCard(movie)));

    // Populate Popular Movies
    popularMovies.forEach(movie => popularCarousel.appendChild(createMovieCard(movie)));
}

// Event delegation to attach click handlers to all movie cards
document.addEventListener('click', (event) => {
    const movieElement = event.target.closest('.movie-card');
    if (movieElement) {
        const movieId = movieElement.getAttribute('data-movie-id');
        if (movieId) {
            window.location.href = `movie-detail.html?id=${movieId}`;
        } else {
            console.error('Movie ID is missing for this movie.');
        }
    }
});

// Ensure everything is loaded
document.addEventListener('DOMContentLoaded', async () => { 
    await populateCarousels(); 
});


// Function to scroll the carousel left or right
function setupScrollHandlers() {
    const scrollButtons = document.querySelectorAll('.scroll-left, .scroll-right');

    scrollButtons.forEach(button => {
        const direction = button.classList.contains('scroll-left') ? -1 : 1;
        const carouselId = button.getAttribute('data-carousel-id');
        
        button.addEventListener('click', () => {
            scrollCarousel(carouselId, direction);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupScrollHandlers();
});
