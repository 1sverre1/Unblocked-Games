let gamesData = [];
let searchQuery = '';
let selectedGame = null;
let isFullscreen = false;
let activeCategory = 'All';
let snakeGameInterval = null;
let snakeHighScore = 0;
let activeInternalGameCleanup = null;

const categories = ['All', 'Arcade', 'Puzzle', 'Action', 'Sports', 'Strategy', 'Driving'];

async function init() {
    try {
        const response = await fetch('games.json');
        gamesData = await response.json();
        render();
    } catch (error) {
        console.error('Error loading games:', error);
    }
}

function render() {
    const app = document.getElementById('app');
    const filteredGames = gamesData.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    app.innerHTML = `
        <div class="min-h-screen flex flex-col relative z-10">
            <!-- Top Banner -->
            <div class="bg-magenta-600/20 border-b border-magenta-500/50 py-2 px-6 text-center animate-pulse">
                <a href="https://skolenmin.cdu.no/a/fra-larer-5cb5d6742d78870019a9deb6/assignments" target="_blank" class="text-[10px] font-black text-magenta-400 uppercase tracking-[0.3em] hover:text-white transition-colors">
                    [SYSTEM_LINK] ACCESS_ASSIGNMENTS_PROTOCOL_05CB5D
                </a>
            </div>
            <!-- Header -->
            <header class="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-cyan-500/30">
                <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
                    <div class="flex items-center gap-3 cursor-pointer shrink-0" onclick="setSelectedGame(null)">
                        <div class="w-10 h-10 neon-bg-cyan rounded flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-black w-6 h-6"><rect width="20" height="12" x="2" y="6" rx="2"/><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/></svg>
                        </div>
                        <h1 class="text-2xl font-black tracking-tighter text-white font-display uppercase italic">
                            LEARNING<span class="neon-text-cyan">LESSONS</span>
                        </h1>
                    </div>

                    <div class="flex-1 max-w-2xl relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <input
                            type="text"
                            placeholder="SYSTEM_SEARCH..."
                            oninput="setSearchQuery(this.value)"
                            value="${searchQuery}"
                            class="w-full bg-black border border-cyan-500/30 rounded py-3 pl-12 pr-4 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all text-cyan-400 placeholder:text-cyan-900 font-mono uppercase text-sm tracking-widest"
                        >
                    </div>

                    <div class="shrink-0 hidden md:block">
                    </div>
                </div>
            </header>

            <main class="flex-1 max-w-7xl mx-auto px-6 w-full py-12">
                <!-- Hero Section -->
                ${!selectedGame ? `
                    <section class="text-center mb-16 animate-fade-in">
                        <h2 class="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter font-display uppercase italic">
                            ACCESS <span class="neon-text-magenta">UNBLOCKED</span> PROTOCOLS.
                        </h2>
                        <p class="text-cyan-500/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-semibold tracking-wide uppercase">
                            High-fidelity web simulations. No firewall, no restrictions, pure neural override.
                        </p>
                        
                        <!-- Categories -->
                        <div class="flex flex-wrap justify-center gap-3">
                            ${categories.map(cat => `
                                <button 
                                    onclick="setActiveCategory('${cat}')"
                                    class="px-6 py-2 rounded-none text-xs font-black transition-all duration-300 uppercase tracking-[0.2em] ${activeCategory === cat ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,243,255,0.5)] scale-105' : 'bg-black border border-cyan-500/30 text-cyan-500/50 hover:border-cyan-400 hover:text-cyan-400'}"
                                >
                                    ${cat}
                                </button>
                            `).join('')}
                        </div>
                    </section>

                    <!-- Content Section -->
                    <div class="mb-8 flex items-center gap-3">
                        <div class="w-8 h-1 bg-magenta-500 neon-bg-magenta"></div>
                        <h3 class="text-2xl font-black text-white font-display uppercase italic tracking-wider">Active_Streams</h3>
                    </div>

                    <!-- Game Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        ${filteredGames.map(game => `
                            <div class="group bg-black border border-cyan-500/20 rounded-none overflow-hidden hover:border-cyan-400 transition-all duration-500 cursor-pointer flex flex-col relative" onclick="setSelectedGame('${game.id}')">
                                <div class="relative aspect-video overflow-hidden">
                                    ${game.isHot ? '<span class="absolute top-4 left-4 z-10 bg-magenta-600 text-white text-[10px] font-black px-2.5 py-1 rounded-none uppercase tracking-widest neon-bg-magenta">Critical</span>' : ''}
                                    <img
                                        src="${game.thumbnail}"
                                        alt="${game.title}"
                                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                        referrerPolicy="no-referrer"
                                    >
                                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                </div>
                                <div class="p-6 flex-1 flex flex-col border-t border-cyan-500/10">
                                    <h4 class="text-xl font-black text-white mb-2 group-hover:neon-text-cyan transition-colors font-display uppercase italic">${game.title}</h4>
                                    <p class="text-cyan-500/50 text-xs line-clamp-2 mb-4 leading-relaxed font-medium uppercase tracking-tight">${game.description || ''}</p>
                                    <div class="mt-auto flex flex-wrap gap-2">
                                        ${(game.tags || []).map(tag => `<span class="text-[9px] font-black text-cyan-400 border border-cyan-400/30 px-2 py-0.5 rounded-none uppercase tracking-widest bg-cyan-400/5">${tag}</span>`).join('')}
                                    </div>
                                </div>
                                <!-- Decorative corner -->
                                <div class="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        `).join('')}
                    </div>

                    ${filteredGames.length === 0 ? `
                        <div class="text-center py-32">
                            <div class="bg-cyan-500/10 w-20 h-20 rounded-none border border-cyan-500/30 flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-900"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            </div>
                            <p class="text-cyan-900 text-lg italic font-display uppercase">No_Data_Found_In_Sector.</p>
                        </div>
                    ` : ''}
                ` : ''}
            </main>

            <!-- Game Player Modal -->
            <div id="modal-container" class="${selectedGame ? 'flex' : 'hidden'} fixed inset-0 z-50 items-center justify-center bg-black/98 p-4 md:p-8">
                ${selectedGame ? `
                    <div class="relative bg-black rounded-none overflow-hidden border border-cyan-400 flex flex-col shadow-[0_0_50px_rgba(0,243,255,0.2)] transition-all duration-500 ${isFullscreen ? 'w-full h-full' : 'w-full max-w-6xl aspect-video'}">
                        <div class="h-16 px-6 flex items-center justify-between border-b border-cyan-400 bg-black">
                            <div class="flex items-center gap-4">
                                <div class="w-8 h-8 neon-bg-cyan rounded-none flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-black"><rect width="20" height="12" x="2" y="6" rx="2"/><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/></svg>
                                </div>
                                <h2 class="font-black text-white tracking-widest uppercase font-display italic text-sm">${selectedGame.title}</h2>
                            </div>
                            <div class="flex items-center gap-3">
                                <button onclick="toggleFullscreen()" class="p-2.5 hover:bg-cyan-500/10 rounded-none transition-all text-cyan-500 hover:text-cyan-400">
                                    ${isFullscreen ? 
                                        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>' : 
                                        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>'
                                    }
                                </button>
                                <button onclick="setSelectedGame(null)" class="p-2.5 hover:bg-magenta-500/10 rounded-none transition-all text-magenta-500 hover:text-magenta-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                </button>
                            </div>
                        </div>
                        <div class="flex-1 bg-black relative flex items-center justify-center overflow-hidden" id="game-viewport">
                            ${selectedGame.isInternal ? `
                                <div class="relative w-full h-full flex flex-col items-center justify-center bg-[#050505]">
                                    <div id="snake-ui" class="absolute top-6 left-6 z-20 font-display italic">
                                        <div class="text-cyan-400 text-xs tracking-widest uppercase mb-1">Neural_Sync: <span id="snake-score">000</span></div>
                                        <div class="text-magenta-500 text-[10px] tracking-[0.3em] uppercase">High_Score: <span id="snake-high">000</span></div>
                                    </div>
                                    <canvas id="snake-canvas" class="max-w-full max-h-full shadow-[0_0_50px_rgba(0,243,255,0.1)] border border-cyan-500/20"></canvas>
                                    <div id="snake-overlay" class="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30 hidden">
                                        <h3 class="text-4xl font-display font-black text-white italic uppercase mb-4 neon-text-magenta">Connection_Lost</h3>
                                        <button onclick="startSnakeGame()" class="px-8 py-3 bg-cyan-500 text-black font-black uppercase tracking-widest hover:bg-white transition-all">Re-Sync_Neural_Link</button>
                                    </div>
                                    <div class="absolute bottom-6 text-cyan-500/30 text-[10px] uppercase tracking-widest font-bold">Use [WASD] or [ARROWS] to navigate the stream</div>
                                </div>
                            ` : `
                                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div class="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
                                </div>
                                <iframe
                                    src="${selectedGame.url}"
                                    class="w-full h-full border-none relative z-10"
                                    title="${selectedGame.title}"
                                    allow="accelerometer *; ambient-light-sensor *; autoplay *; camera *; clipboard-read *; clipboard-write *; encrypted-media *; fullscreen *; geolocation *; gyroscope *; local-network-access *; magnetometer *; microphone *; midi *; payment *; picture-in-picture *; screen-wake-lock *; speaker *; sync-xhr *; usb *; vibrate *; vr *; web-share *"
                                    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-scripts allow-same-origin allow-popups-to-escape-sandbox allow-downloads allow-storage-access-by-user-activation"
                                    allowfullscreen
                                ></iframe>
                            `}
                        </div>
                    </div>
                ` : ''}
            </div>

            <!-- Footer -->
            <footer class="bg-black border-t border-cyan-500/30 py-16">
                <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div class="flex flex-col items-center md:items-start gap-4">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 neon-bg-cyan rounded-none flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-black"><rect width="20" height="12" x="2" y="6" rx="2"/><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/></svg>
                            </div>
                            <span class="text-xl font-black text-white tracking-tighter font-display uppercase italic">LEARNING<span class="neon-text-cyan">LESSONS</span></span>
                        </div>
                        <p class="text-cyan-900 text-xs max-w-xs text-center md:text-left font-bold uppercase tracking-widest">
                            THE ULTIMATE NEURAL OVERRIDE FOR UNBLOCKED PROTOCOLS.
                        </p>
                    </div>
                    
                    <div class="flex flex-col items-center md:items-end gap-6">
                        <div class="flex gap-8 text-[10px] font-black text-cyan-500/50 uppercase tracking-[0.2em]">
                            <a href="#" class="hover:text-cyan-400 transition-colors">Privacy_Core</a>
                            <a href="#" class="hover:text-cyan-400 transition-colors">Terms_Of_Use</a>
                            <a href="#" class="hover:text-cyan-400 transition-colors">Neural_Link</a>
                        </div>
                        <p class="text-cyan-900 text-[10px] uppercase tracking-[0.3em] font-black">
                            © 2026 LEARNING LESSONS • ALL SYSTEMS NOMINAL
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    `;
}

window.setSearchQuery = (query) => {
    searchQuery = query;
    render();
};

window.setActiveCategory = (cat) => {
    activeCategory = cat;
    render();
};

window.setSelectedGame = (id) => {
    if (id === null) {
        selectedGame = null;
        isFullscreen = false;
        document.body.classList.remove('modal-open');
        if (snakeGameInterval) clearInterval(snakeGameInterval);
        if (activeInternalGameCleanup) activeInternalGameCleanup();
    } else {
        selectedGame = gamesData.find(g => g.id === id);
        document.body.classList.add('modal-open');
        if (selectedGame.isInternal) {
            if (activeInternalGameCleanup) activeInternalGameCleanup();
            if (selectedGame.id === 'snake-internal') {
                setTimeout(startSnakeGame, 100);
            }
        }
    }
    render();
};

window.toggleFullscreen = () => {
    isFullscreen = !isFullscreen;
    render();
};

// Snake Game Logic

function startSnakeGame() {
    const canvas = document.getElementById('snake-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('snake-score');
    const highEl = document.getElementById('snake-high');
    const overlay = document.getElementById('snake-overlay');
    
    overlay.classList.add('hidden');
    highEl.innerText = snakeHighScore.toString().padStart(3, '0');
    
    const gridSize = 20;
    const tileCount = 20;
    canvas.width = gridSize * tileCount;
    canvas.height = gridSize * tileCount;
    
    let score = 0;
    let dx = 0;
    let dy = 0;
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
    let nextDx = 0;
    let nextDy = 0;
    let gameStarted = false;
    
    function handleKey(e) {
        const key = e.key.toLowerCase();
        if ((key === 'w' || key === 'arrowup') && dy === 0) { nextDx = 0; nextDy = -1; gameStarted = true; }
        if ((key === 's' || key === 'arrowdown') && dy === 0) { nextDx = 0; nextDy = 1; gameStarted = true; }
        if ((key === 'a' || key === 'arrowleft') && dx === 0) { nextDx = -1; nextDy = 0; gameStarted = true; }
        if ((key === 'd' || key === 'arrowright') && dx === 0) { nextDx = 1; nextDy = 0; gameStarted = true; }
    }
    
    window.addEventListener('keydown', handleKey);
    activeInternalGameCleanup = () => {
        window.removeEventListener('keydown', handleKey);
    };
    
    if (snakeGameInterval) clearInterval(snakeGameInterval);
    
    snakeGameInterval = setInterval(() => {
        if (!gameStarted) {
            // Initial draw while waiting for input
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Grid lines
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
            for(let i=0; i<canvas.width; i+=gridSize) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
            }
            
            // Food
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff00ff';
            ctx.fillStyle = '#ff00ff';
            ctx.beginPath();
            ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/3, 0, Math.PI * 2);
            ctx.fill();
            
            // Snake
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00f3ff';
            ctx.fillStyle = 'rgba(0, 243, 255, 1)';
            ctx.fillRect(snake[0].x * gridSize + 2, snake[0].y * gridSize + 2, gridSize - 4, gridSize - 4);
            ctx.fillStyle = 'white';
            ctx.fillRect(snake[0].x * gridSize + 5, snake[0].y * gridSize + 5, 3, 3);
            ctx.fillRect(snake[0].x * gridSize + gridSize - 8, snake[0].y * gridSize + 5, 3, 3);
            ctx.shadowBlur = 0;
            return;
        }

        dx = nextDx;
        dy = nextDy;
        
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        
        // Collision check
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || 
            snake.some(s => s.x === head.x && s.y === head.y)) {
            clearInterval(snakeGameInterval);
            overlay.classList.remove('hidden');
            window.removeEventListener('keydown', handleKey);
            if (score > snakeHighScore) snakeHighScore = score;
            return;
        }
        
        snake.unshift(head);
        
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreEl.innerText = score.toString().padStart(3, '0');
            food = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } else {
            snake.pop();
        }
        
        // Draw
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Grid lines (subtle)
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
        for(let i=0; i<canvas.width; i+=gridSize) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }
        
        // Food (Anime style: Glowing Orb)
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff00ff';
        ctx.fillStyle = '#ff00ff';
        ctx.beginPath();
        ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/3, 0, Math.PI * 2);
        ctx.fill();
        
        // Snake (Anime style: Neon trail)
        snake.forEach((part, index) => {
            const alpha = 1 - (index / snake.length) * 0.5;
            ctx.shadowBlur = index === 0 ? 20 : 10;
            ctx.shadowColor = '#00f3ff';
            ctx.fillStyle = `rgba(0, 243, 255, ${alpha})`;
            
            if (index === 0) {
                // Head: Stylized square with "eyes"
                ctx.fillRect(part.x * gridSize + 2, part.y * gridSize + 2, gridSize - 4, gridSize - 4);
                ctx.fillStyle = 'white';
                ctx.fillRect(part.x * gridSize + 5, part.y * gridSize + 5, 3, 3);
                ctx.fillRect(part.x * gridSize + gridSize - 8, part.y * gridSize + 5, 3, 3);
            } else {
                ctx.fillRect(part.x * gridSize + 4, part.y * gridSize + 4, gridSize - 8, gridSize - 8);
            }
        });
        ctx.shadowBlur = 0;
        
    }, 100);
}

// Initial render
init();
