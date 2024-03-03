// Obtener referencia a los elementos del reproductor que se modificarán en el modo nocturno
const playerContainer = document.getElementById('player-container');
const playerControls = document.getElementById('player-controls');
const songList = document.getElementById('song-list');

// Obtener referencia al botón de alternar modo nocturno
const toggleNightModeButton = document.getElementById('toggle-night-mode');

// Manejar el evento de clic en el botón de alternar modo nocturno
toggleNightModeButton.addEventListener('click', function() {
    // Alternar clases CSS para activar/desactivar modo nocturno
    playerContainer.classList.toggle('night-mode');
    playerControls.classList.toggle('night-mode');
    songList.classList.toggle('night-mode');
});

// Puedes agregar más lógica para guardar el estado del modo nocturno en localStorage
// y cargarlo cuando el usuario regrese a la página
