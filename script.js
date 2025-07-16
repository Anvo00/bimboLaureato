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

// Click event per alternativa semplice
cardContainer.addEventListener('click', function(e) {
    if (!isDragging) {
        toggleCard();
    }
});

function handleStart(e) {
    e.preventDefault();
    isDragging = true;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    currentX = startX;
    card.style.transition = 'none';
}

function handleMove(e) {
    if (!isDragging) return;

    e.preventDefault();
    currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = currentX - startX;

    // FIX: Correzione dell'errore di sintassi nella template string
    let rotationY;
    if (isFlipped) {
        // Se la card è già girata, partiamo da 180 gradi
        rotationY = 180 + (deltaX * 0.3);
    } else {
        // Se la card è nella posizione normale, partiamo da 0 gradi
        rotationY = deltaX * 0.3;
    }

    card.style.transform = `rotateY(${rotationY}deg)`;
}

function handleEnd(e) {
    if (!isDragging) return;

    isDragging = false;
    const deltaX = currentX - startX;
    const threshold = 50;

    // Ripristina la transizione
    card.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    // FIX: Logica semplificata per lo swipe
    if (Math.abs(deltaX) > threshold) {
        // Qualsiasi swipe superiore alla soglia fa girare la card
        toggleCard();
    } else {
        // Ritorna alla posizione originale
        card.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
    }

    // Reset della trasformazione dopo la transizione
    setTimeout(() => {
        card.style.transform = '';
    }, 600);
}

function toggleCard() {
    isFlipped = !isFlipped;
    if (isFlipped) {
        card.classList.add('flipped');
    } else {
        card.classList.remove('flipped');
    }
    hideIndicator();
}

// Previeni il comportamento di default del browser solo durante il drag
let touchStartY = 0;
cardContainer.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
});

cardContainer.addEventListener('touchmove', function(e) {
    if (isDragging) {
        const touchCurrentY = e.touches[0].clientY;
        const deltaY = Math.abs(touchCurrentY - touchStartY);
        const deltaX = Math.abs(currentX - startX);

        // Previeni scroll solo se il movimento è più orizzontale che verticale
        if (deltaX > deltaY) {
            e.preventDefault();
        }
    }
}, { passive: false });

// Nascondi l'indicatore dopo il primo utilizzo
let firstInteraction = true;
function hideIndicator() {
    if (firstInteraction) {
        const indicator = document.querySelector('.swipe-indicator');
        if (indicator) {
            indicator.style.opacity = '0';
            indicator.style.transition = 'opacity 0.5s ease';
        }
        firstInteraction = false;
    }
}

// Inizializza gli event listeners per nascondere l'indicatore
cardContainer.addEventListener('touchstart', hideIndicator);
cardContainer.addEventListener('mousedown', hideIndicator);