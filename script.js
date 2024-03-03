// Obtener elementos del DOM
const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");

// Definir lista de canciones
const allSongs = [
  // Array de objetos con información de las canciones
  {
    id: 0,
    title: "Emotions",
    artist: "Ash",
    duration: "4:44",
    src: "/sound/Ash - Emotions (Live Session).mp3",
  },
  {
    id: 1,
    title: "Keep Me",
    artist: "Ash",
    duration: "3:05",
    src: "/sound/Ash - Keep Me (Live Session).mp3",
  },
  {
    id: 2,
    title: "Light (Live from Paris)",
    artist: "Ash",
    duration: "3:53",
    src: "/sound/Ash - Light (Live from Paris).mp3",
  },
 
  {
    id: 3,
    title: "Mosaïque (Live at The Pyramids)",
    artist: "Ash",
    duration: "4:34",
    src: "/sound/Ash - Mosaïque (Live at The Pyramids).mp3",
  },
  {
    id: 4,
    title: "Senses",
    artist: "Ash",
    duration: "3:47",
    src: "/sound/Ash - Senses.mp3",
  },
  {
    id: 5,
    title: "Worlds Apart (Little Room Session _1)",
    artist: "Ash",
    duration: "4:24",
    src: "/sound/Ash - Worlds Apart (Little Room Session _1).mp3",
  },
  {
    id: 6,
    title: "Worlds Apart (Live from Paris)",
    artist: "Ash",
    duration: "4:47",
    src: "/sound/Ash - Worlds Apart (Live from Paris).mp3",
  },
];

// Crear un objeto de audio
const audio = new Audio();

// Objeto para almacenar datos del usuario
let userData = {
  songs: [...allSongs], // Copiar todas las canciones al inicio
  currentSong: null, // Canción actual
  songCurrentTime: 0, // Tiempo de reproducción de la canción actual
};

// Función para reproducir una canción
const playSong = (id) => {
  // Buscar la canción en la lista de canciones del usuario
  const song = userData?.songs.find((song) => song.id === id);
  
  // Establecer la fuente y el título de la canción en el reproductor de audio
  audio.src = song.src;
  audio.title = song.title;

  // Si la canción actual no es la misma que la que se va a reproducir,
  // restablecer el tiempo de reproducción
  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }

  // Establecer la canción actual en el objeto userData
  userData.currentSong = song;
  // Agregar la clase "playing" al botón de reproducción
  playButton.classList.add("playing");

  // Resaltar la canción actual en la lista de reproducción
  highlightCurrentSong();
  // Actualizar la visualización del reproductor
  setPlayerDisplay();
  // Establecer el texto accesible del botón de reproducción
  setPlayButtonAccessibleText();
  // Reproducir la canción
  audio.play();
};

// Función para pausar la reproducción de una canción
const pauseSong = () => {
  // Guardar el tiempo de reproducción de la canción actual
  userData.songCurrentTime = audio.currentTime;
  
  // Eliminar la clase "playing" del botón de reproducción
  playButton.classList.remove("playing");
  // Pausar la reproducción de la canción
  audio.pause();
};

// Función para reproducir la siguiente canción
const playNextSong = () => {
  // Si no hay una canción actual, reproducir la primera canción de la lista
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    // Obtener el índice de la canción actual en la lista de canciones
    const currentSongIndex = getCurrentSongIndex();
    // Obtener la siguiente canción en la lista
    const nextSong = userData?.songs[currentSongIndex + 1];

    // Reproducir la siguiente canción
    playSong(nextSong.id);
  }
};

// Función para reproducir la canción anterior
const playPreviousSong = () => {
  // Si no hay una canción actual, salir de la función
  if (userData?.currentSong === null) return;
  else {
    // Obtener el índice de la canción actual en la lista de canciones
    const currentSongIndex = getCurrentSongIndex();
    // Obtener la canción anterior en la lista
    const previousSong = userData?.songs[currentSongIndex - 1];

    // Reproducir la canción anterior
    playSong(previousSong.id);
  }
};

// Función para aleatorizar la lista de canciones
const shuffle = () => {
  // Aleatorizar la lista de canciones
  userData?.songs.sort(() => Math.random() - 0.5);
  // Reiniciar la canción actual y el tiempo de reproducción
  userData.currentSong = null;
  userData.songCurrentTime = 0;

  // Renderizar las canciones en la lista de reproducción
  renderSongs(userData?.songs);
  // Pausar la reproducción de la canción actual
  pauseSong();
  // Actualizar la visualización del reproductor
  setPlayerDisplay();
  // Establecer el texto accesible del botón de reproducción
  setPlayButtonAccessibleText();
};

// Función para eliminar una canción de la lista
const deleteSong = (id) => {
  // Si la canción que se va a eliminar es la canción actual
  if (userData?.currentSong?.id === id) {
    // Reiniciar la canción actual y el tiempo de reproducción
    userData.currentSong = null;
    userData.songCurrentTime = 0;

    // Pausar la reproducción de la canción actual
    pauseSong();
    // Actualizar la visualización del reproductor
    setPlayerDisplay();
  }

  // Filtrar las canciones y eliminar la canción con el ID dado
  userData.songs = userData?.songs.filter((song) => song.id !== id);
  // Renderizar las canciones en la lista de reproducción
  renderSongs(userData?.songs); 
  // Resaltar la canción actual en la lista de reproducción
  highlightCurrentSong(); 
  // Establecer el texto accesible del botón de reproducción
  setPlayButtonAccessibleText(); 

  // Si no quedan canciones en la lista, agregar un botón para restablecer la lista
  if (userData?.songs.length === 0) {
    const resetButton = document.createElement("button");
    const resetText = document.createTextNode("Reset Playlist");

    resetButton.id = "reset";
    resetButton.ariaLabel = "Reset playlist";
    resetButton.appendChild(resetText);
    playlistSongs.appendChild(resetButton);

    resetButton.addEventListener("click", () => {
      // Restablecer la lista de canciones
      userData.songs = [...allSongs];

      // Renderizar las canciones ordenadas
      renderSongs(sortSongs()); 
      // Establecer el texto accesible del botón de reproducción
      setPlayButtonAccessibleText();
      // Eliminar el botón de restablecer
      resetButton.remove();
    });
  }
};

// Función para actualizar la visualización del reproductor
const setPlayerDisplay = () => {
  // Obtener elementos del DOM para mostrar la canción actual y el artista
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  // Obtener el título y el artista de la canción actual
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;

  // Mostrar el título de la canción actual (o vacío si no hay una canción)
  playingSong.textContent = currentTitle ? currentTitle : "";
  // Mostrar el artista de la canción actual (o vacío si no hay una canción)
  songArtist.textContent = currentArtist ? currentArtist : "";
};

// Función para resaltar la canción actual en la lista de reproducción
const highlightCurrentSong = () => {
  // Obtener todos los elementos de canción en la lista de reproducción
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  // Obtener el elemento de la canción actual
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );

  // Eliminar el atributo "aria-current" de todas las canciones
  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });

  // Si hay una canción actual, agregar el atributo "aria-current" a la canción
  if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

// Función para renderizar las canciones en la lista de reproducción
const renderSongs = (array) => {
  // Crear HTML para cada canción en la lista
  const songsHTML = array
    .map((song)=> {
      return `
      <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
      </button>
      <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
        </button>
      </li>
      `;
    })
    .join(""); // Unir todas las cadenas HTML en una sola

  // Establecer el HTML de la lista de reproducción
  playlistSongs.innerHTML = songsHTML;
};

// Función para establecer el texto accesible del botón de reproducción
const setPlayButtonAccessibleText = () => {
  // Obtener la canción actual o la primera canción de la lista si no hay una actual
  const song = userData?.currentSong || userData?.songs[0];

  // Establecer el atributo "aria-label" del botón de reproducción
  playButton.setAttribute(
    "aria-label",
    song?.title ? `Play ${song.title}` : "Play"
  );
};

// Función para obtener el índice de la canción actual en la lista de canciones
const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);

// Agregar event listeners a los botones de reproducción
playButton.addEventListener("click", () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    playSong(userData?.currentSong.id);
  }
});

pauseButton.addEventListener("click",  pauseSong);
nextButton.addEventListener("click", playNextSong);
previousButton.addEventListener("click", playPreviousSong);
shuffleButton.addEventListener("click", shuffle);

// Event listener para manejar el final de la reproducción de una canción
audio.addEventListener("ended", () => {
  const currentSongIndex = getCurrentSongIndex();
  // Verificar si hay una siguiente canción en la lista
  const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;

  // Si hay una siguiente canción, reproducirla; de lo contrario, detener la reproducción
  if (nextSongExists) {
    playNextSong();
  } else {
    userData.currentSong = null;
    userData.songCurrentTime = 0;  
    pauseSong();
    setPlayerDisplay();
    highlightCurrentSong();
    setPlayButtonAccessibleText();
  }
});

// Función para ordenar las canciones alfabéticamente por título
const sortSongs = () => {
  userData?.songs.sort((a,b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });

  return userData?.songs;
};

// Renderizar las canciones ordenadas alfabéticamente
renderSongs(sortSongs());
// Establecer el texto accesible del botón de reproducción
setPlayButtonAccessibleText();
