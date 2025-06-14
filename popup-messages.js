// Popup message toggle functionality (exactly mirrors the sound toggle functionality)
function setupPopupMessageControls() {
    const popupToggle = document.getElementById('popup-toggle');
    if (popupToggle) {
        popupToggle.addEventListener('click', togglePopupMessages);
    }
}

function togglePopupMessages() {
    const popupEnabled = localStorage.getItem('popupMessagesEnabled') !== 'false';
    localStorage.setItem('popupMessagesEnabled', !popupEnabled);
    
    const popupToggle = document.getElementById('popup-toggle');
    if (popupToggle) {
        popupToggle.textContent = popupEnabled ? '🚫' : '💬';
        popupToggle.title = popupEnabled ? 'Messages Off' : 'Messages On';
        
        // Add visual feedback
        popupToggle.classList.add('pressed');
        setTimeout(() => {
            popupToggle.classList.remove('pressed');
        }, 200);
    }
}

// Initialize popup message settings
function initPopupMessageSettings() {
    if (localStorage.getItem('popupMessagesEnabled') === null) {
        localStorage.setItem('popupMessagesEnabled', 'true');
    }
    
    const popupToggle = document.getElementById('popup-toggle');
    if (popupToggle) {
        const popupEnabled = localStorage.getItem('popupMessagesEnabled') !== 'false';
        popupToggle.textContent = popupEnabled ? '💬' : '🚫';
        popupToggle.title = popupEnabled ? 'Messages On' : 'Messages Off';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPopupMessageSettings();
    setupPopupMessageControls();
});
