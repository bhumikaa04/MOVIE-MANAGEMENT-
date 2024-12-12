document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const searchTerm = document.getElementById('search-input').value;

    if (!searchTerm) {
        alert("Please enter a search term.");
        return;
    }

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '<p>Loading...</p>'; // Show loading text while fetching data

    // Fetch data from the API
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=a8944139f76a389d1f1cf59b26aba5df&query=${encodeURIComponent(searchTerm)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            resultsContainer.innerHTML = ''; // Clear previous results
            if (data.results.length === 0) {
                resultsContainer.innerHTML = '<p>No results found</p>';
            } else {
                // Save search term and results to localStorage
                localStorage.setItem('searchTerm', searchTerm);
                localStorage.setItem('searchResults', JSON.stringify(data.results));

                data.results.forEach(movie => {
                    const movieElement = document.createElement('div');
                    movieElement.classList.add('movie-card');
                    movieElement.innerHTML = `
                        <h3>${movie.title}</h3>
                        <p>${movie.overview}</p>
                        <p><strong>Release Date:</strong> ${movie.release_date}</p>
                        <p><strong>Rating:</strong> ${movie.vote_average}</p>
                    `;

                    // Adding hover effect to each movie element
                    movieElement.addEventListener('mouseenter', () => {
                        movieElement.classList.add('hovered');
                    });

                    movieElement.addEventListener('mouseleave', () => {
                        movieElement.classList.remove('hovered');
                    });

                    // Redirect to movie details page on click
                    movieElement.addEventListener('click', () => {
                        window.location.href = `movie-detail.html?id=${movie.id}`;
                    });

                    resultsContainer.appendChild(movieElement);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultsContainer.innerHTML = '<p>Error fetching data. Please try again later.</p>';
        });
});

// Function to load saved search results
document.addEventListener('DOMContentLoaded', function() {
    const searchTerm = localStorage.getItem('searchTerm');
    const savedResults = localStorage.getItem('searchResults');

    if (savedResults && searchTerm) {
        const resultsContainer = document.getElementById('results');
        const results = JSON.parse(savedResults);
        document.getElementById('search-input').value = searchTerm; // Restore the previous search term
        resultsContainer.innerHTML = ''; // Clear previous results

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No results found</p>';
        } else {
            results.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.classList.add('movie-card');
                movieElement.innerHTML = `
                    <h3>${movie.title}</h3>
                    <p>${movie.overview}</p>
                    <p><strong>Release Date:</strong> ${movie.release_date}</p>
                    <p><strong>Rating:</strong> ${movie.vote_average}</p>
                `;

                // Adding hover effect to each movie element
                movieElement.addEventListener('mouseenter', () => {
                    movieElement.classList.add('hovered');
                });

                movieElement.addEventListener('mouseleave', () => {
                    movieElement.classList.remove('hovered');
                });

                // Redirect to movie details page on click
                movieElement.addEventListener('click', () => {
                    window.location.href = `movie-detail.html?id=${movie.id}`;
                });

                resultsContainer.appendChild(movieElement);
            });
        }
    }
});
