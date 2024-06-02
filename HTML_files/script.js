document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('ad-video');

    // Ensure the user cannot leave the page
    window.addEventListener('beforeunload', (e) => {
        if (!video.ended) {
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });

    // Check if the video is playing
    video.addEventListener('play', () => {
        let visibilityChange;
        if (typeof document.hidden !== 'undefined') {
            visibilityChange = 'visibilitychange';
        } else if (typeof document.msHidden !== 'undefined') {
            visibilityChange = 'msvisibilitychange';
        } else if (typeof document.webkitHidden !== 'undefined') {
            visibilityChange = 'webkitvisibilitychange';
        }

        document.addEventListener(visibilityChange, handleVisibilityChange, false);
    });

    // Handle visibility change
    function handleVisibilityChange() {
        if (document.hidden) {
            video.pause();
        } else {
            video.play();
        }
    }

    // Listen for the video end event
    video.addEventListener('ended', () => {
        alert('Thank you for watching the video!');
        window.removeEventListener('beforeunload', () => {});
        // Redirect or show the main content
        document.getElementById('ad-container').style.display = 'none';
    });
});