//This is the backup of the code

import "./App.css";
import { useState, useEffect } from "react";

const apiKey = "778ea5a6"; //api key for fetching
const url = ` https://www.omdbapi.com/?apikey=${apiKey}&s={Joker}`;
// const url = ` https://www.omdbapi.com/?apikey=778ea5a6&t={Joker}&plot`; //get plot of particular movie
let clickedMovieData;

const initialMovies = [
  {
    Title: "Joker",
    Year: "2019",
    imdbID: "tt7286456",
    Type: "movie",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
  },

  {
    Title: "Mera Naam Joker",
    Year: "1970",
    imdbID: "tt0066070",
    Type: "movie",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BODUxNjU0NDItY2FmZi00YWQzLWI4YjAtZjYyNWZhODc3ZTZhXkEyXkFqcGdeQXVyNjQ2MjQ5NzM@._V1_SX300.jpg",
  },
  {
    Title: "Joker Game",
    Year: "2016–",
    imdbID: "tt5614180",
    Type: "series",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMTgyNjczOGItOTczNi00MDk4LWIzMjktYTM3NWU4YmQ4MWVkL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNjc2NjA5MTU@._V1_SX300.jpg",
  },
];

//State variables here:

export default function App() {
  //this state will store the clicked movie data
  const [clickMovie, setClickMovie] = useState("");

  //this will containe search movie response data
  const [movieData, setMovieData] = useState([]);

  //tracks the status of data fetching
  const [isLoading, setIsLoading] = useState(false);

  //stores watchlist and favourites

  const [watchlist, setWatchList] = useState([]);
  const [favourites, setFavourites] = useState([]);

  //tracks the modal window for watchlist
  const [isModalOpen, setIsModalOpen] = useState(false);
  //tracks the modal window for favourites
  const [isFavModal, setIsFavModal] = useState(false);

  //open and close modal for watchlist movies
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  //open and close modal for favourites movies
  const openFavModal = () => setIsFavModal(true);
  const closeFavModal = () => setIsFavModal(false);

  //maintains the document title on initial render
  useEffect(() => {
    document.title = "Cinema-Hunt";
  }, []);

  return (
    <div>
      <p className="title">Cinema-Hunt</p>
      <SearchMovies
        movieData={movieData}
        setMovieData={setMovieData}
        openModal={openModal}
        closeModal={closeModal}
        openFavModal={openFavModal}
        closeFavModal={closeFavModal}
      ></SearchMovies>
      <div className="flex-container">
        <ShowMovieList
          movies={initialMovies}
          clickMovie={clickMovie}
          setClickMovie={setClickMovie}
          movieData={movieData}
          setMovieData={setMovieData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        ></ShowMovieList>
        <ShowMovieDetails
          clickMovie={clickMovie}
          setClickMovie={setClickMovie}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          watchlist={watchlist}
          setWatchList={setWatchList}
          favourites={favourites}
          setFavourites={setFavourites}
          closeModal={closeModal}
        ></ShowMovieDetails>
      </div>
      {isModalOpen && (
        <WatchlistModal
          watchlist={watchlist}
          closeModal={closeModal}
        ></WatchlistModal>
      )}

      {isFavModal && (
        <FavouritesModal
          favourites={favourites}
          closeFavModal={closeFavModal}
        ></FavouritesModal>
      )}
    </div>
  );
}
// ` https://www.omdbapi.com/?apikey=778ea5a6&s=Joker`

function SearchMovies({
  movieData,
  setMovieData,
  openModal,
  closeModal,
  openFavModal,
  closeFavModal,
}) {
  const [searchTitle, setSearchTitle] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();
      async function inputSearchTitle() {
        if (searchTitle) {
          const res = await fetch(
            ` https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTitle}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          console.log(data);
          //copy the response to movieData state
          if (data.Response === "True") {
            setMovieData(data.Search || []);
            console.log(movieData);
          } else {
            console.error(data.Error);
            setMovieData([]);
          }
        }
      }

      inputSearchTitle();
      //clean-up function
      return function () {
        controller.abort();
      };
    },
    [searchTitle]
  );

  return (
    <div className="navbar">
      <input
        className="input"
        type="text"
        placeholder="Enter Movies to search"
        onChange={(e) => {
          setSearchTitle(e.target.value);
        }}
      ></input>
      <button id="input-watchlist" onClick={openModal}>
        Watchlist
      </button>
      <button id="input-favourites" onClick={openFavModal}>
        Favourites
      </button>
    </div>
  );
}

// function ShowMovieList({ movies }) {
//   return (
//     <div>
//       {movies.map((movie) => (
//         <DisplaySearchMovies props={movie} key={100 + i++} />
//       ))}
//     </div>
//   );
// }

function ShowMovieList({
  movies,
  clickMovie,
  setClickMovie,
  movieData,
  setMovieData,
  isLoading,
  setIsLoading,
}) {
  // Destructure the movies prop

  return (
    <div className="DisplaySearchMovies">
      {movieData.map((movie) => (
        <DisplaySearchMovies
          movie={movie}
          key={movie.imdbID}
          clickMovie={clickMovie}
          setClickMovie={setClickMovie}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      ))}
    </div>
  );
}

//Display the searched movies
function DisplaySearchMovies({
  movie,
  clickMovie,
  setClickMovie,
  isLoading,
  setIsLoading,
}) {
  const { Title, Year, imdbID, Poster } = movie;

  const [selectedMovie, setSelectedMovie] = useState(null);

  //get the clicked movie
  async function clickedMovie() {
    setSelectedMovie(Title);
    // console.log(Title);
    const res = await fetch(
      `http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`
    );
    setIsLoading(true);
    clickedMovieData = await res.json();
    setClickMovie(clickedMovieData);
    console.log(clickedMovieData); // Log fetched data
    setIsLoading(false);
  }

  return (
    <div>
      <div onClick={clickedMovie} className="singleMovie">
        <img className="poster" src={Poster} alt={`${Title} poster`}></img>{" "}
        <div className="movieDetails"></div>
        <p>{Title}</p>
        <p className="year">{Year}</p>
      </div>
    </div>
  );
}

//display the selected  movie details
function ShowMovieDetails({
  clickMovie,
  setClickMovie,
  isLoading,
  setIsLoading,
  title,
  setTitle,
  watchlist,
  setWatchList,
  favourites,
  setFavourites,
}) {
  //Destructure the clicked movie

  const {
    Title: clickMovTitle,
    Year,
    Actors,
    Country,
    Genre,
    Plot,
    Poster: clickedMovPoster,
    Language,
    Ratings,
  } = clickMovie;

  // console.log(clickMovie);
  if (clickMovie)
    console.log(
      clickMovTitle,
      Year,
      Actors,
      Country,
      Genre,
      Plot,
      Ratings[0].Value
    );

  //set the title according to the movie
  useEffect(
    function () {
      if (!clickMovTitle) return;
      document.title = `Cinema-Hunt | ${clickMovTitle}`;
    },
    [clickMovTitle]
  );

  //rating out of 5
  const ratingValue = Ratings
    ? parseFloat(Ratings[0].Value.split("/")[0] / 2)
    : 0;

  // console.log(ratingValue);

  //function to generate stars for rating
  function generateStars(rating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? "filled" : ""}`}>
          ★
        </span>
      );
    }
    return stars;
  }

  if (isLoading) return <div id="wait">Loading Data .....🔃🔃🔃🔃</div>;

  //add new Movie to watchlist
  function addToWatchlist(newMovie) {
    setWatchList((prevMovie) => {
      const exsists = prevMovie.includes(newMovie);

      if (exsists) {
        //if movie already exsists,return prevArray
        console.log("movie already exsists");
        return prevMovie;
      } else {
        //if movie not exsists,return updatedWatchlist= prevArray+newMovie
        const updatedWatchlist = [...prevMovie, newMovie];
        console.log(updatedWatchlist);
        return updatedWatchlist;
      }
    });
    // console.log(watchlist)
  }

  //add Movies to favourites

  function addToFavourites(newFavMovie) {
    setFavourites((prevFav) => {
      const exsists = prevFav.includes(newFavMovie);

      if (exsists) {
        console.log("Movie already exsists in Favourites");
        return prevFav;
      } else {
        const updatedFavourites = [...prevFav, newFavMovie];
        console.log("Favourites:", updatedFavourites);
        return updatedFavourites;
      }
    });
  }

  return clickMovie ? (
    <div>
      <div className="showMovieDetails">
        <img
          className="clickedMovie"
          src={clickedMovPoster}
          alt={`${clickMovTitle} poster`}
        ></img>
        <div className="clickedMovDetails">
          <p id="movName">
            Movie Nmae: {clickMovTitle}, {Year}
          </p>
          <p id="movRating">Movie Rating: {generateStars(ratingValue)}</p>
          <p id="movActors">Actors: {Actors}</p>
          <p id="movGenre">Genre: {Genre}</p>
          <p id="movPlot">Plot: {Plot}</p>
          <p id="movCountry">Country: {Country}</p>{" "}
          <p id="movLanguages">Languages: {Language}</p>
          <button id="watchlist" onClick={() => addToWatchlist(clickMovTitle)}>
            Add To Watchlist
          </button>
          <button
            id="favourites"
            onClick={() => addToFavourites(clickMovTitle)}
          >
            Add To Favourites
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="showMovieDetails">
      <p id="request">Please select a movie first! 🙄</p>
    </div>
  );
}

function WatchlistModal({ watchlist, closeModal }) {
  let index = 2;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="watchTitle">Your Watchlist</h2>
        {watchlist.length === 0 ? (
          <p className="watchTitle">
            Your watchlist is empty. Add movies to it 😉.
          </p>
        ) : (
          <ul>
            {watchlist.map((movie, index) => (
              <li key={index}>
                <span>
                  {`${index} - `}
                  {movie}
                </span>
              </li>
            ))}
          </ul>
        )}
        <button onClick={closeModal}>❌</button>
      </div>
    </div>
  );
}

function FavouritesModal({ favourites, closeFavModal }) {
  let indexi = 2;
  console.log(favourites);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="favTitle">Your Favourite Movies</h2>
        {favourites.length === 0 ? (
          <p className="favTitle">
            Your Favourite list is empty. Add movies to it 😉.
          </p>
        ) : (
          <ul>
            {favourites.map((favourite, indexi) => (
              <li key={indexi}>
                <span>
                  {`${indexi} - `}
                  {favourite}
                </span>
              </li>
            ))}
          </ul>
        )}
        <button onClick={closeFavModal}>❌</button>
      </div>
    </div>
  );
}
//next step- use abort contoller. Cleanup function
