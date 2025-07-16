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

    // FIX: Calcolo corretto della rotazione basato sullo stato attuale
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

    // FIX: Logica migliorata per gestire entrambe le direzioni
    if (Math.abs(deltaX) > threshold) {
        // Determina la direzione dello swipe
        if (deltaX > 0) {
            // Swipe verso destra
            if (!isFlipped) {
                // Se non è girata, girala
                isFlipped = true;
                card.classList.add('flipped');
            } else {
                // Se è già girata, riportala normale
                isFlipped = false;
                card.classList.remove('flipped');
            }
        } else {
            // Swipe verso sinistra
            if (!isFlipped) {
                // Se non è girata, girala
                isFlipped = true;
                card.classList.add('flipped');
            } else {
                // Se è già girata, riportala normale
                isFlipped = false;
                card.classList.remove('flipped');
            }
        }
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
function hideIndicator() {
    if (firstInteraction) {
        document.querySelector('.swipe-indicator').style.opacity = '0';
        firstInteraction = false;
    }
}

cardContainer.addEventListener('touchstart', hideIndicator);
cardContainer.addEventListener('mousedown', hideIndicator);