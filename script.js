document.addEventListener('DOMContentLoaded', function() {
    const audioBtn = document.getElementById('audioBtn');
    const audioPlayer = document.getElementById('audioPlayer');
    const mountainAudio = document.getElementById('mountainAudio');
    const cyberAudio = document.getElementById('cyberAudio');
    const btnText = document.getElementById('btnText');
    const themeToggle = document.getElementById('themeToggle');
    const darkStylesheet = document.getElementById('theme-stylesheet');
    const mountainStylesheet = document.getElementById('mountain-stylesheet');
    const cyberStylesheet = document.getElementById('cyber-stylesheet');
    
    let isPlaying = false;
    let currentTheme = 'dark';
    let currentAudio = audioPlayer;

    // Initialize audio
    function handleAudioEnded() {
        isPlaying = false;
        audioBtn.classList.remove('playing');
        btnText.textContent = 'Play Audio';
    }

    audioPlayer.addEventListener('ended', handleAudioEnded);
    mountainAudio.addEventListener('ended', handleAudioEnded);
    cyberAudio.addEventListener('ended', handleAudioEnded);

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
                    const audioFile = currentTheme === 'dark' ? 'audio/dark.mp3' : currentTheme === 'mountain' ? 'audio/mountain.mp3' : 'audio/cyber.mp3';
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
        if (currentTheme === 'dark') {
            btnText.textContent = 'Audio File Missing';
            audioBtn.disabled = true;
            audioBtn.style.opacity = '0.5';
        }
    });

    mountainAudio.addEventListener('error', function() {
        console.log('Mountain mode audio file not found');
        if (currentTheme === 'mountain') {
            btnText.textContent = 'Audio File Missing';
            audioBtn.disabled = true;
            audioBtn.style.opacity = '0.5';
        }
    });

    cyberAudio.addEventListener('error', function() {
        console.log('Cyber mode audio file not found');
        if (currentTheme === 'cyber') {
            btnText.textContent = 'Audio File Missing';
            audioBtn.disabled = true;
            audioBtn.style.opacity = '0.5';
        }
    });

    // Theme toggle function - cycles through dark -> mountain -> cyber -> dark
    themeToggle.addEventListener('click', function() {
        const wasPlaying = isPlaying;
        if (wasPlaying) {
            currentAudio.pause();
            isPlaying = false;
            audioBtn.classList.remove('playing');
        }

        // Cycle through themes: dark -> mountain -> cyber -> dark
        if (currentTheme === 'dark') {
            currentTheme = 'mountain';
            darkStylesheet.disabled = true;
            mountainStylesheet.disabled = false;
            cyberStylesheet.disabled = true;
            themeToggle.textContent = 'Cyber Mode';
            document.body.setAttribute('data-theme', 'mountain');
            localStorage.setItem('theme', 'mountain');
            currentAudio = mountainAudio;
        } else if (currentTheme === 'mountain') {
            currentTheme = 'cyber';
            darkStylesheet.disabled = true;
            mountainStylesheet.disabled = true;
            cyberStylesheet.disabled = false;
            themeToggle.textContent = 'Dark Mode';
            document.body.setAttribute('data-theme', 'cyber');
            localStorage.setItem('theme', 'cyber');
            currentAudio = cyberAudio;
        } else {
            currentTheme = 'dark';
            darkStylesheet.disabled = false;
            mountainStylesheet.disabled = true;
            cyberStylesheet.disabled = true;
            themeToggle.textContent = 'Mountain Mode';
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            currentAudio = audioPlayer;
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

    // Load saved theme
    // default to dark mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'mountain') {
        currentTheme = 'mountain';
        darkStylesheet.disabled = true;
        mountainStylesheet.disabled = false;
        cyberStylesheet.disabled = true;
        themeToggle.textContent = 'Cyber Mode';
        document.body.setAttribute('data-theme', 'mountain');
        currentAudio = mountainAudio;
    } else if (savedTheme === 'cyber') {
        currentTheme = 'cyber';
        darkStylesheet.disabled = true;
        mountainStylesheet.disabled = true;
        cyberStylesheet.disabled = false;
        themeToggle.textContent = 'Dark Mode';
        document.body.setAttribute('data-theme', 'cyber');
        currentAudio = cyberAudio;
    } else {
        // Default to dark mode
        currentTheme = 'dark';
        darkStylesheet.disabled = false;
        mountainStylesheet.disabled = true;
        cyberStylesheet.disabled = true;
        themeToggle.textContent = 'Mountain Mode';
        document.body.setAttribute('data-theme', 'dark');
        currentAudio = audioPlayer;
        localStorage.setItem('theme', 'dark');
    }

    // Modal function 
    // Projects two and four as they are private repos
    const modal = document.getElementById('projectModal');
    const modalHeader = document.getElementById('modalHeader');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.querySelector('.modal-close');
    const modalTriggers = document.querySelectorAll('.modal-trigger');

    const projectDetails = {
        2: {
            title: 'D4T',
            description: 'D4T is an open-source intelligence and digital forensic tool. Its backend components, image and data forensics modules are written in RUST, with web scraping scripts for social media written in GO and Python. The front end utilizes JS, HTML, CSS, the AngularJS framework, and WebAssembly. Additional Modules: OpenLayers map that plots relevant areas based on search, timeline constructor, RUST data search (searches and webscrapes csv, json files full of links to local, state, federal courts, with jail/prison rosters, missing persons data)'
        },
        4: {
            title: 'Project #004',
            description: 'This is a private project repo. Source code is not publicly available..'
        }
    };

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const projectNum = this.getAttribute('data-project');
            const details = projectDetails[projectNum];
            if (details) {
                modalHeader.textContent = details.title;
                modalBody.textContent = details.description;
                modal.style.display = 'block';
            }
        });
    });

    modalClose.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

