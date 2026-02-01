// Timer state
let minutes = 25;
let seconds = 0;
let isActive = false;
let mode = 'work'; // 'work' or 'break'
let sessions = 0;
let totalMinutes = 0;
let interval = null;

// Elements
const timerCard = document.getElementById('timerCard');
const modeBadge = document.getElementById('modeBadge');
const modeText = document.getElementById('modeText');
const timerTime = document.getElementById('timerTime');
const timerStatus = document.getElementById('timerStatus');
const progressCircle = document.getElementById('progressCircle');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const switchBtn = document.getElementById('switchBtn');
const sessionCount = document.getElementById('sessionCount');
const totalMinutesEl = document.getElementById('totalMinutes');
const motivation = document.getElementById('motivation');
const celebration = document.getElementById('celebration');

// Circle properties
const radius = 160;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = circumference;

// Update timer display
function updateDisplay() {
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerTime.textContent = formattedTime;
    
    const totalSeconds = mode === 'work' ? 25 * 60 : 5 * 60;
    const elapsed = totalSeconds - (minutes * 60 + seconds);
    const progress = (elapsed / totalSeconds) * circumference;
    progressCircle.style.strokeDashoffset = circumference - progress;
}

// Start/Pause timer
function toggleTimer() {
    isActive = !isActive;
    
    if (isActive) {
        startBtn.innerHTML = '<span>⏸ PAUSE</span>';
        timerStatus.textContent = mode === 'work' ? 'Focus time activated!' : 'Break time activated!';
        
        interval = setInterval(() => {
            if (seconds === 0) {
                if (minutes === 0) {
                    completeTimer();
                } else {
                    minutes--;
                    seconds = 59;
                }
            } else {
                seconds--;
            }
            updateDisplay();
        }, 1000);
    } else {
        startBtn.innerHTML = '<span>▶ START</span>';
        timerStatus.textContent = 'Paused';
        clearInterval(interval);
    }
}

// Complete timer
function completeTimer() {
    isActive = false;
    clearInterval(interval);
    startBtn.innerHTML = '<span>▶ START</span>';
    
    // Shake effect
    timerCard.classList.add('shake');
    setTimeout(() => timerCard.classList.remove('shake'), 500);
    
    // Create celebration
    createCelebration();
    
    // Update stats
    if (mode === 'work') {
        sessions++;
        totalMinutes += 25;
        sessionCount.textContent = sessions;
        totalMinutesEl.textContent = totalMinutes;
        
        // Switch to break
        mode = 'break';
        minutes = 5;
        seconds = 0;
        updateMode();
    } else {
        // Switch to work
        mode = 'work';
        minutes = 25;
        seconds = 0;
        updateMode();
    }
    
    updateDisplay();
}

// Reset timer
function resetTimer() {
    isActive = false;
    clearInterval(interval);
    startBtn.innerHTML = '<span>▶ START</span>';
    
    if (mode === 'work') {
        minutes = 25;
    } else {
        minutes = 5;
    }
    seconds = 0;
    
    timerStatus.textContent = 'Reset!';
    updateDisplay();
}

// Switch mode
function switchMode() {
    isActive = false;
    clearInterval(interval);
    startBtn.innerHTML = '<span>▶ START</span>';
    
    mode = mode === 'work' ? 'break' : 'work';
    minutes = mode === 'work' ? 25 : 5;
    seconds = 0;
    
    updateMode();
    updateDisplay();
}

// Update mode UI
function updateMode() {
    if (mode === 'work') {
        modeBadge.className = 'mode-badge work';
        modeText.textContent = 'FOCUS MODE';
        timerTime.className = 'timer-time work';
        progressCircle.className = 'timer-circle-progress work';
        motivation.className = 'motivation work';
        motivation.textContent = '⚡ Lock in and dominate! ⚡';
        timerStatus.textContent = 'Ready to focus?';
    } else {
        modeBadge.className = 'mode-badge break';
        modeText.textContent = 'BREAK MODE';
        timerTime.className = 'timer-time break';
        progressCircle.className = 'timer-circle-progress break';
        motivation.className = 'motivation break';
        motivation.textContent = '✨ Recharge your energy! ✨';
        timerStatus.textContent = 'Time to relax!';
    }
}

// Create celebration effect
function createCelebration() {
    const colors = ['#00f0ff', '#0066ff', '#9d00ff', '#00ff88', '#ffff00', '#ff6600'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            celebration.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 20);
    }
}

// Particle animation
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 50;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animateParticles);
}

animateParticles();

// Event listeners
startBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
switchBtn.addEventListener('click', switchMode);

// Window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Initialize
        updateDisplay();