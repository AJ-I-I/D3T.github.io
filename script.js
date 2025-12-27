document.addEventListener('DOMContentLoaded', function() {
    const audioBtn = document.getElementById('audioBtn');
    const audioPlayer = document.getElementById('audioPlayer');
    const mountainAudio = document.getElementById('mountainAudio');
    const btnText = document.getElementById('btnText');
    const themeToggle = document.getElementById('themeToggle');
    const darkStylesheet = document.getElementById('theme-stylesheet');
    const mountainStylesheet = document.getElementById('mountain-stylesheet');
    const vhsLoader = document.getElementById('vhs-loader');
    const typingText = document.getElementById('typing-text');
    const contactForm = document.getElementById('contactForm');
    
    let isPlaying = false;
    let currentTheme = 'dark';
    let currentAudio = audioPlayer;

    const vhsAudio = document.getElementById('vhsAudio');
    
    // Always show VHS loader on page load/refresh
    vhsLoader.classList.remove('hidden');
    
    // Reset audio to beginning
    vhsAudio.currentTime = 0;
    
    // Attempt to play VHS audio on page load
    let vhsAudioPlayed = false;
    function tryPlayVHSAudio() {
        if (!vhsAudioPlayed && vhsAudio) {
            vhsAudio.play().then(function() {
                vhsAudioPlayed = true;
            }).catch(function(error) {
                // Silently fail
                // Browser blocks auto-play without user interaction
                console.log('[!] ERROR: VHS audio play failed ', error.message, '[!]');
            });
        }
    }
    
    // Try to play immediately (may work if user has interacted with site before)
    tryPlayVHSAudio();
    
    // Also try to play on any user interaction as fallback
    document.addEventListener('click', tryPlayVHSAudio, { once: true });
    document.addEventListener('keydown', tryPlayVHSAudio, { once: true });
    document.addEventListener('touchstart', tryPlayVHSAudio, { once: true });
    
    // Always run the VHS startup sequence
    // Hide loader and start typing animation after a bit over a second
    setTimeout(function() {
        if (vhsAudioPlayed && vhsAudio) {
            vhsAudio.pause();
            vhsAudio.currentTime = 0;
        }
        vhsLoader.classList.add('hidden');
        startTypingAnimation();
    }, 1650);

    // Typing animation
    function startTypingAnimation() {
        const text = 'HARRY JONES';
        let index = 0;
        typingText.textContent = '';
        
        function typeChar() {
            if (index < text.length) {
                typingText.textContent += text[index];
                index++;
                setTimeout(typeChar, 150);
            } else {
                startScrollAnimations();
            }
        }
        typeChar();
    }

    // Scroll animations for sections
    function startScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        const sections = document.querySelectorAll('.about-section, .projects-section, .contact-section');
        sections.forEach(section => {
            observer.observe(section);
        });
    }

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
                    const audioFile = currentTheme === 'dark' ? 'audio/dark.mp3' : 'audio/mountain.mp3';
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

    // Theme toggle function - cycles through dark -> mountain -> dark with smooth transitions
    themeToggle.addEventListener('click', function() {
        const wasPlaying = isPlaying;
        if (wasPlaying) {
            currentAudio.pause();
            isPlaying = false;
            audioBtn.classList.remove('playing');
        }

        // Add fade transition
        document.body.style.opacity = '0.7';
        document.querySelector('.container').style.opacity = '0.7';

        setTimeout(function() {
            // Cycle through themes: dark -> mountain -> dark
            if (currentTheme === 'dark') {
                currentTheme = 'mountain';
                darkStylesheet.disabled = true;
                mountainStylesheet.disabled = false;
                themeToggle.textContent = 'Dark Mode';
                document.body.setAttribute('data-theme', 'mountain');
                localStorage.setItem('theme', 'mountain');
                currentAudio = mountainAudio;
            } else {
                currentTheme = 'dark';
                darkStylesheet.disabled = false;
                mountainStylesheet.disabled = true;
                themeToggle.textContent = 'Mountain Mode';
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                currentAudio = audioPlayer;
            }

            // Fade back in
            setTimeout(function() {
                document.body.style.opacity = '1';
                document.querySelector('.container').style.opacity = '1';
            }, 100);

            if (wasPlaying) {
                currentAudio.play().catch(function(error) {
                    console.log('Audio failed to play', error);
                });
                isPlaying = true;
                audioBtn.classList.add('playing');
                btnText.textContent = 'Pause Audio';
            }
        }, 200);
    });

    // Load saved theme
    // default to dark mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'mountain') {
        currentTheme = 'mountain';
        darkStylesheet.disabled = true;
        mountainStylesheet.disabled = false;
        themeToggle.textContent = 'Dark Mode';
        document.body.setAttribute('data-theme', 'mountain');
        currentAudio = mountainAudio;
    } else {
        // Default to dark mode
        currentTheme = 'dark';
        darkStylesheet.disabled = false;
        mountainStylesheet.disabled = true;
        themeToggle.textContent = 'Mountain Mode';
        document.body.setAttribute('data-theme', 'dark');
        currentAudio = audioPlayer;
        localStorage.setItem('theme', 'dark');
    }

    // Initialize scroll animations after VHS sequence completes
    // Sections will become visible when scrolled into view

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
            description: 'D4T is an open-source intelligence and digital forensic tool. Its backend components, image and data forensics modules are written in RUST, with web scraping scripts for social media written in GO and Python. The front end utilizes JS, HTML, CSS, the AngularJS framework, and WebAssembly. Additional Modules: OpenLayers map that plots relevant areas based on search, timeline constructor, RUST data search (searches and webscrapes csv, json files full of links to local, state, federal courts, with jail/prison rosters, missing persons data). *This is a private project repo. Source code is not publicly available.*'
        },
        4: {
            title: 'RAD-W',
            description: 'Live-coding tool/DAW project that works directly in the terminal. Built in RUST, makes audio programatically and allows for samples to be uploaded and used in sessions.*This is a private project repo. Source code is not publicly available.*'
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

    // Contact form
    // WIP
    // NOT FUNCTIONAL
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                message: document.getElementById('contactMessage').value
            };

            // Here you would typically send the form data to a server
            alert('Message sent! (This is a demo - form submission would be handled by a backend service)');
            
            // Reset form
            contactForm.reset();
        });
    }
});

