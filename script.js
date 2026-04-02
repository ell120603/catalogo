// Image paths - following the user's naming convention
const images = [
    'img/1capa.png',
    // Numbers 2 to 41 (based on the files found earlier)
    ...Array.from({ length: 40 }, (_, i) => `img/${i + 2}.jpeg`)
];

let currentIndex = 0;
let isTransitioning = false;
const totalPages = images.length;


const currentImg = document.getElementById('current-img');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const indexBtn = document.getElementById('index-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const currentPageSpan = document.getElementById('current-page');
const totalPagesSpan = document.getElementById('total-pages');
const catalogContainer = document.getElementById('catalog');
const prevArea = document.getElementById('prev-area');
const nextArea = document.getElementById('next-area');


const indexSidebar = document.getElementById('index-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const indexItems = document.querySelectorAll('#index-list li');


totalPagesSpan.textContent = totalPages;


function updatePage(index) {
    if (index < 0 || index >= totalPages || index === currentIndex || isTransitioning) return;

    isTransitioning = true;
    
    
    prevBtn.style.opacity = index === 0 ? '0.3' : '1';
    prevBtn.style.pointerEvents = index === 0 ? 'none' : 'auto';
    prevArea.style.pointerEvents = index === 0 ? 'none' : 'auto';
    
    nextBtn.style.opacity = index === totalPages - 1 ? '0.3' : '1';
    nextBtn.style.pointerEvents = index === totalPages - 1 ? 'none' : 'auto';
    nextArea.style.pointerEvents = index === totalPages - 1 ? 'none' : 'auto';


    currentImg.classList.add('fade-out');
    
    
    const handleTransitionEnd = (e) => {
        if (e.propertyName !== 'opacity') return;
        currentImg.removeEventListener('transitionend', handleTransitionEnd);
        
        currentIndex = index;
        currentImg.src = images[currentIndex];
        currentPageSpan.textContent = currentIndex + 1;
        
        // Temporarily add fade-in class
        currentImg.classList.remove('fade-out');
        currentImg.classList.add('fade-in');
        
        // Force reflow
        void currentImg.offsetWidth;
        
        // Remove fade-in class to trigger transition back
        currentImg.classList.remove('fade-in');
        
        // Wait for the fade-in to complete before allowing another transition
        setTimeout(() => {
            isTransitioning = false;
        }, 300);
    };
    
    currentImg.addEventListener('transitionend', handleTransitionEnd);
}

// Initial state for buttons and areas
if (currentIndex === 0) {
    prevBtn.style.opacity = '0.3';
    prevBtn.style.pointerEvents = 'none';
    prevArea.style.pointerEvents = 'none';
}
if (currentIndex === totalPages - 1) {
    nextBtn.style.opacity = '0.3';
    nextBtn.style.pointerEvents = 'none';
    nextArea.style.pointerEvents = 'none';
}

function next() {
    if (currentIndex < totalPages - 1) {
        updatePage(currentIndex + 1);
    }
}

function prev() {
    if (currentIndex > 0) {
        updatePage(currentIndex - 1);
    }
}

// Event Listeners
nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);
nextArea.addEventListener('click', next);
prevArea.addEventListener('click', prev);

// Sidebar Events
indexBtn.addEventListener('click', () => {
    indexSidebar.classList.add('open');
});

closeSidebarBtn.addEventListener('click', () => {
    indexSidebar.classList.remove('open');
});

indexItems.forEach(item => {
    item.addEventListener('click', () => {
        const pageNum = parseInt(item.getAttribute('data-page'));
        updatePage(pageNum - 1);
        indexSidebar.classList.remove('open');
    });
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'f' || e.key === 'F') toggleFullscreen();
});

// Fullscreen Logic
function toggleFullscreen() {
    const container = document.getElementById('catalog-container');

    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

fullscreenBtn.addEventListener('click', toggleFullscreen);

// Update icon when exiting fullscreen via ESC
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    } else {
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    }
});

// Swipe/Touch Logic
let touchStartX = 0;
let touchEndX = 0;

catalogContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

catalogContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        next();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        prev();
    }
}

// Preload Images for smoother experience
function preloadImages() {
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

preloadImages();
