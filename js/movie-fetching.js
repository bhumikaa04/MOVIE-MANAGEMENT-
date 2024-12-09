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
    document.getElementById('movieTitle').textContent = 'Error';
    document.getElementById('movieDescription').textContent = message;
    document.getElementById('movieGenre').innerHTML = '';
    document.getElementById('movieReleaseDate').innerHTML = '';
    document.getElementById('movieRating').innerHTML = '';
    document.getElementById('moviePoster').src = 'images/default-movie.jpg';
}
const apiKey = 'a8944139f76a389d1f1cf59b26aba5df'; // Replace with your actual API key

// Function to fetch movies based on category
async function fetchMovies(category) {
    const url = `https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}&language=en-US&page=1`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
}

// Function to create a movie card element
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster">
        <h4>${movie.title}</h4>
    `;
    return card;
}



// Function to populate carousels with movie data
async function populateCarousels() {
    // const trendingMovies = await fetchTrendingMovies();
    const topRatedMovies = await fetchMovies('top_rated');
    const upcomingMovies = await fetchMovies('upcoming');
    const popularMovies = await fetchMovies('popular');

    // const trendingCarousel = document.getElementById('trendingMovies');
    const topRatedCarousel = document.getElementById('topRatedMovies');
    const upcomingCarousel = document.getElementById('upcomingMovies');
    const popularCarousel = document.getElementById('popularMovies');

    // Populate Trending Movies
    // trendingMovies.forEach(movie => {
    //     trendingCarousel.appendChild(createMovieCard(movie));
    // });

    // Populate Top Rated Movies
    topRatedMovies.forEach(movie => {
        topRatedCarousel.appendChild(createMovieCard(movie));
    });

    // Populate Upcoming Movies
    upcomingMovies.forEach(movie => {
        upcomingCarousel.appendChild(createMovieCard(movie));
    });

    // Populate Popular Movies
    popularMovies.forEach(movie => {
        popularCarousel.appendChild(createMovieCard(movie));
    });
}

// Function to scroll the carousel left or right
function scrollCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    const scrollAmount = direction * 150; // Adjust scroll amount as needed
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

// Call the function to populate the carousels when the page loads
populateCarousels();