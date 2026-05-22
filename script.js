const searchBtn = document.querySelector('#searchBtn')
const searchInput = document.querySelector('#searchInput')
const movieContainer = document.querySelector('#movieContainer')
const myapi = "2271869b";

searchBtn.addEventListener('click', async () => {
  const movieName = searchInput.value.trim();
  if (!movieName) {
    movieContainer.innerHTML = `<p>Please Enter a movie name...</p>`
    return;
  }

  try {
    movieContainer.innerHTML = `
      <div class="flex justify-center items-center w-screen min-h-[60vh]" >
        <div class="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-red-500"></div>
  </div >
      `;

    const response = await fetch(`https://www.omdbapi.com/?apikey=${myapi}&s=${movieName}`)

    const data = await response.json()

    console.log(data);

    if (data.Response == "False") {
      movieContainer.innerHTML = `<p>Movie not Found....</p>`
      return;
    };
    displayMovie(data.Search);
  } catch (error) {
    movieContainer.innerHTML = `<p>Something went Wrong..</p>`
  }
});

function displayMovie(movies) {
  movieContainer.innerHTML = "";
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = "bg-gray-900 shadow-md hover:shadow-white rounded-lg overflow-hidden hover:scale-105 transition duration-300";
    card.innerHTML = `
  <div class="h-80 w-full bg-gray-800">
    <img 
      src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300"}"
      class="w-full h-full object-cover"
    />
  </div> 
  <div class="p-3">
    <h1 class="font-bold text-xl text-white">${movie.Title}</h1>
    <p class="text-gray-400">${movie.Year}</p>
    <p class="text-gray-400">${movie.Type}</p>
  </div>
`;

    card.addEventListener('click', () => {
      getMovies(movie.imdbID);
    })
    movieContainer.appendChild(card)
  });
}

async function getMovies(imdbID) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${myapi}&i=${imdbID}`);

    const data = await response.json();

    showMovieModal(data);
  }
  catch (error) {
    console.log(error);
  }
}

async function showMovieModal(movie) {
  const modal = document.createElement("div");

  modal.className =
    "fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center p-6";

  modal.innerHTML = `
<div class="bg-gray-900 text-white rounded-xl max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">

<button class="absolute top-4 right-4 text-red-500 text-2xl font-bold hover:scale-110 transition">
✕
</button>

<div class="flex flex-col md:flex-row gap-6">
  
  <img class="w-72 rounded-lg shadow-lg" src="${movie.Poster}" />

  <div>
    <h1 class="text-3xl font-bold mb-2">${movie.Title}</h1>

    <p><strong>Year:</strong> ${movie.Year}</p>
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Director:</strong> ${movie.Director}</p>
    <p><strong>Actors:</strong> ${movie.Actors}</p>
    <p><strong>IMDb:</strong> ⭐ ${movie.imdbRating}</p>

    <p class="mt-4 text-gray-300">${movie.Plot}</p>
  </div>

</div>
</div>
`;

  document.body.appendChild(modal);
  modal.querySelector('button').addEventListener('click', () => {
    modal.remove();
  })
}


searchInput.addEventListener('keypress', (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
})



