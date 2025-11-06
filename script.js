document.addEventListener('DOMContentLoaded', function() {
    const audioBtn = document.getElementById('audioBtn');
    const audioPlayer = document.getElementById('audioPlayer');
    const mountainAudio = document.getElementById('mountainAudio');
    const btnText = document.getElementById('btnText');
    const themeToggle = document.getElementById('themeToggle');
    const darkStylesheet = document.getElementById('theme-stylesheet');
    const mountainStylesheet = document.getElementById('mountain-stylesheet');
    
    let isPlaying = false;
    let isDarkMode = true;
    let currentAudio = audioPlayer;

    // Initialize audio
    function handleAudioEnded() {
        isPlaying = false;
        audioBtn.classList.remove('playing');
        btnText.textContent = 'Play Audio';
    }

    audioPlayer.addEventListener('ended', handleAudioEnded);
    mountainAudio.addEventListener('ended', handleAudioEnded);

    // Toggle play/pause on button click
    audioBtn.addEventListener('click', function() {
        if (isPlaying) {
            // Pause audio
            currentAudio.pause();
            isPlaying = false;
            audioBtn.classList.remove('playing');
            btnText.textContent = 'Play Audio';
        } else {
            // Play audio
            currentAudio.play().catch(function(error) {
                console.log('Audio play failed:', error);
                // If audio file doesn't exist, show a message
                if (error.name === 'NotAllowedError') {
                    alert('Please allow audio playback in your browser settings.');
                } else if (error.name === 'NotSupportedError') {
                    const audioFile = isDarkMode ? 'audio/ambient.mp3' : 'audio/mountain.mp3';
                    alert('Audio file not found. Please add an audio file at ' + audioFile);
                }
            });
            isPlaying = true;
            audioBtn.classList.add('playing');
            btnText.textContent = 'Pause Audio';
        }
    });

    // Handle audio loading errors
    audioPlayer.addEventListener('error', function() {
        console.log('Dark mode audio file not found');
        if (isDarkMode) {
            btnText.textContent = 'Audio File Missing';
            audioBtn.disabled = true;
            audioBtn.style.opacity = '0.5';
        }
    });

    mountainAudio.addEventListener('error', function() {
        console.log('Mountain mode audio file not found');
        if (!isDarkMode) {
            btnText.textContent = 'Audio File Missing';
            audioBtn.disabled = true;
            audioBtn.style.opacity = '0.5';
        }
    });

    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        const wasPlaying = isPlaying;
        if (wasPlaying) {
            currentAudio.pause();
            isPlaying = false;
            audioBtn.classList.remove('playing');
        }

        isDarkMode = !isDarkMode;
        
        if (isDarkMode) {
            darkStylesheet.disabled = false;
            mountainStylesheet.disabled = true;
            themeToggle.textContent = 'Mountain Mode';
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            currentAudio = audioPlayer;
        } else {
            darkStylesheet.disabled = true;
            mountainStylesheet.disabled = false;
            themeToggle.textContent = 'Dark Mode';
            document.body.setAttribute('data-theme', 'mountain');
            localStorage.setItem('theme', 'mountain');
            currentAudio = mountainAudio;
        }

        if (wasPlaying) {
            currentAudio.play().catch(function(error) {
                console.log('Audio play failed after theme switch:', error);
            });
            isPlaying = true;
            audioBtn.classList.add('playing');
            btnText.textContent = 'Pause Audio';
        }
    });

    // Load saved theme - default to dark mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'mountain') {
        isDarkMode = false;
        darkStylesheet.disabled = true;
        mountainStylesheet.disabled = false;
        themeToggle.textContent = 'Dark Mode';
        document.body.setAttribute('data-theme', 'mountain');
        currentAudio = mountainAudio;
    } else {
        // Default to dark mode
        isDarkMode = true;
        darkStylesheet.disabled = false;
        mountainStylesheet.disabled = true;
        themeToggle.textContent = 'Mountain Mode';
        document.body.setAttribute('data-theme', 'dark');
        currentAudio = audioPlayer;
        localStorage.setItem('theme', 'dark');
    }
});

