// ======= DOM references =======
const mobileToggle = document.getElementById('mobile-toggle');
const mobileNav = document.getElementById('mobile-nav');
const mobileClose = document.getElementById('mobile-close');
const mobileLinks = document.querySelectorAll('.mobile-link');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const clearForm = document.getElementById('clearForm');

// ======= Mobile menu handlers (Slightly improved slide behavior) =======
function openMobile() {
  mobileNav.classList.add('is-open');
  mobileNav.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeMobile() {
  mobileNav.classList.remove('is-open');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (mobileToggle) mobileToggle.addEventListener('click', openMobile);
if (mobileClose) mobileClose.addEventListener('click', closeMobile);
mobileLinks.forEach(a => a.addEventListener('click', closeMobile));


// ======= Form Handlers (Simulated Submission) =======
// Since this is a raw code environment without external APIs (like Netlify/Fetch),
// this simulates a successful asynchronous submission for good front-end UX.
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Stop the default form submit behavior

    formStatus.textContent = 'Sending message...';
    formStatus.style.color = '#00E0FF'; // Accent color for status

    // Simulate network delay and success
    setTimeout(() => {
      formStatus.textContent = '✅ Success! Message sent. We will respond within 24 hours.';
      contactForm.reset();
    }, 1000);
  });
}

if (clearForm) {
  clearForm.addEventListener('click', () => {
    contactForm.reset();
    formStatus.textContent = '';
  });
}

// ======= Dynamic Canvas Background (Animated Binary Grid) =======
(function initCanvasBackground() {
  const canvas = document.getElementById('background-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  // Function to set canvas size
  function resizeCanvas() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas(); // Initial call

  // Parameters for the animation
  const tileWidth = 30; // Size of each grid cell
  const columns = Math.ceil(W / tileWidth);
  const rows = Math.ceil(H / tileWidth);
  const grid = [];
  const density = 0.5; // Probability of a tile being active
  const colorFade = 'rgba(0, 224, 255, 0.02)'; // Base/Subtle Cyan

  // Initialize grid with random binary states and a fade counter
  for (let x = 0; x < columns; x++) {
    grid[x] = [];
    for (let y = 0; y < rows; y++) {
      grid[x][y] = {
        state: Math.random() < density ? 1 : 0,
        fade: 0, // 0 = fully visible, maxFade = invisible
        maxFade: Math.floor(Math.random() * 20) + 20
      };
    }
  }

  let frameCount = 0;

  function draw() {
    // Check for resize during animation loop
    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      resizeCanvas();
      // Re-calculate rows/columns on resize, but don't re-initialize the grid completely
    }

    ctx.clearRect(0, 0, W, H);

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        const tile = grid[x][y];
        const px = x * tileWidth;
        const py = y * tileWidth;

        // 1. Draw Fading Rectangles (creating the subtle pulse effect)
        if (tile.fade > 0) {
            const alpha = 1 - (tile.fade / tile.maxFade);
            ctx.fillStyle = `rgba(0, 224, 255, ${alpha * 0.1})`; // Fading out effect
            ctx.fillRect(px, py, tileWidth, tileWidth);
            tile.fade--;
        }

        // 2. State Update (every 40 frames)
        if (frameCount % 40 === 0) {
          // Trigger a new state change randomly
          if (Math.random() < 0.1) {
            tile.state = 1; // Make it active/visible
            tile.fade = tile.maxFade; // Start fade counter
          }
        }

        // 3. Draw Active State (Static Grid Base)
        // This ensures a persistent, faint grid pattern
        ctx.fillStyle = colorFade;
        ctx.fillRect(px, py, tileWidth, tileWidth);
      }
    }

    frameCount++;
    requestAnimationFrame(draw);
  }

  // Start the animation only when the window is loaded to ensure canvas exists
  window.onload = function() {
    draw();
  };
})();