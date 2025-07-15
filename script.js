const card = document.getElementById('card');
const cardContainer = document.getElementById('cardContainer');

let isFlipped = false;
let startX = 0;
let currentX = 0;
let isDragging = false;

// Touch events
cardContainer.addEventListener('touchstart', handleStart, { passive: false });
cardContainer.addEventListener('touchmove', handleMove, { passive: false });
cardContainer.addEventListener('touchend', handleEnd, { passive: false });

// Mouse events per desktop
cardContainer.addEventListener('mousedown', handleStart);
cardContainer.addEventListener('mousemove', handleMove);
cardContainer.addEventListener('mouseup', handleEnd);
cardContainer.addEventListener('mouseleave', handleEnd);

function handleStart(e) {
    e.preventDefault();
    isDragging = true;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    card.style.transition = 'none';
}

function handleMove(e) {
    if (!isDragging) return;

    e.preventDefault();
    currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = currentX - startX;

    // Effetto di rotazione durante il drag
    const rotationY = isFlipped ? 180 + (deltaX * 0.3) : deltaX * 0.3;
    card.style.transform = `rotateY(${rotationY}deg)`;
}

function handleEnd(e) {
    if (!isDragging) return;

    isDragging = false;
    const deltaX = currentX - startX;
    const threshold = 50;

    // Ripristina la transizione
    card.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    if (Math.abs(deltaX) > threshold) {
        // Flip della card
        isFlipped = !isFlipped;
        card.classList.toggle('flipped', isFlipped);
    } else {
        // Ritorna alla posizione originale
        card.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
    }

    // Reset della trasformazione dopo la transizione
    setTimeout(() => {
        card.style.transform = '';
    }, 600);
}

// Previeni il comportamento di default del browser
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

// Nascondi l'indicatore dopo il primo utilizzo
let firstInteraction = true;
cardContainer.addEventListener('touchstart', function() {
    if (firstInteraction) {
        document.querySelector('.swipe-indicator').style.opacity = '0';
        firstInteraction = false;
    }
});

cardContainer.addEventListener('mousedown', function() {
    if (firstInteraction) {
        document.querySelector('.swipe-indicator').style.opacity = '0';
        firstInteraction = false;
    }
});