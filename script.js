let gamesData = [];
let searchQuery = '';
let selectedGame = null;
let isFullscreen = false;

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
    const filteredGames = gamesData.filter(game => 
        game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    app.innerHTML = `
        <div class="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
            <!-- Header -->
            <header class="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
                <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    <div class="flex items-center gap-2 cursor-pointer" onclick="setSelectedGame(null)">
                        <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black w-6 h-6"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
                        </div>
                        <h1 class="text-xl font-bold tracking-tight hidden sm:block">
                            UNBLOCKED<span class="text-emerald-500">ARCADE</span>
                        </h1>
                    </div>

                    <div class="flex-1 max-w-md relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <input
                            type="text"
                            placeholder="Search games..."
                            oninput="setSearchQuery(this.value)"
                            value="${searchQuery}"
                            class="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
                        >
                    </div>

                    <div class="flex items-center gap-4">
                        <span class="text-xs font-mono text-white/40 uppercase tracking-widest hidden md:block">
                            ${filteredGames.length} Games Available
                        </span>
                    </div>
                </div>
            </header>

            <main class="max-w-7xl mx-auto px-4 py-8">
                <!-- Hero Section -->
                ${!selectedGame ? `
                    <section class="mb-12 transition-all duration-700">
                        <div class="relative h-64 rounded-3xl overflow-hidden group">
                            <img 
                                src="https://picsum.photos/seed/arcade/1200/400" 
                                alt="Featured" 
                                class="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                            >
                            <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                            <div class="absolute bottom-8 left-8">
                                <h2 class="text-4xl font-bold mb-2">Featured: Retro Classics</h2>
                                <p class="text-white/60 max-w-md">Dive into our curated collection of the best unblocked games on the web. No downloads, just play.</p>
                            </div>
                        </div>
                    </section>
                ` : ''}

                <!-- Game Grid -->
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    ${filteredGames.map(game => `
                        <div class="group cursor-pointer" onclick="setSelectedGame('${game.id}')">
                            <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-3">
                                <img
                                    src="${game.thumbnail}"
                                    alt="${game.title}"
                                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    referrerPolicy="no-referrer"
                                >
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div class="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black w-6 h-6"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
                                    </div>
                                </div>
                            </div>
                            <h3 class="font-medium text-sm text-white/80 group-hover:text-emerald-400 transition-colors">
                                ${game.title}
                            </h3>
                        </div>
                    `).join('')}
                </div>

                ${filteredGames.length === 0 ? `
                    <div class="text-center py-20">
                        <p class="text-white/40 italic">No games found matching your search.</p>
                    </div>
                ` : ''}
            </main>

            <!-- Modal -->
            <div id="modal-container" class="${selectedGame ? 'flex' : 'hidden'} fixed inset-0 z-50 items-center justify-center bg-black/95 p-4 md:p-8">
                ${selectedGame ? `
                    <div class="relative bg-[#111] rounded-3xl overflow-hidden border border-white/10 flex flex-col transition-all duration-300 ${isFullscreen ? 'w-full h-full' : 'w-full max-w-5xl aspect-video'}">
                        <div class="h-14 px-6 flex items-center justify-between border-b border-white/5 bg-[#111]">
                            <div class="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500 w-5 h-5"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
                                <h2 class="font-bold text-sm tracking-wide uppercase">${selectedGame.title}</h2>
                            </div>
                            <div class="flex items-center gap-2">
                                <button onclick="toggleFullscreen()" class="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white">
                                    ${isFullscreen ? 
                                        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>' : 
                                        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>'
                                    }
                                </button>
                                <button onclick="setSelectedGame(null)" class="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                </button>
                            </div>
                        </div>
                        <div class="flex-1 bg-black relative">
                            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div class="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                            </div>
                            <iframe
                                src="${selectedGame.url}"
                                class="w-full h-full border-none relative z-10"
                                title="${selectedGame.title}"
                                allow="accelerometer *; ambient-light-sensor *; autoplay *; camera *; clipboard-read *; clipboard-write *; encrypted-media *; fullscreen *; geolocation *; gyroscope *; local-network-access *; magnetometer *; microphone *; midi *; payment *; picture-in-picture *; screen-wake-lock *; speaker *; sync-xhr *; usb *; vibrate *; vr *; web-share *"
                                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-scripts allow-same-origin"
                                allowfullscreen
                            ></iframe>
                        </div>
                    </div>
                ` : ''}
            </div>

            <!-- Footer -->
            <footer class="max-w-7xl mx-auto px-4 py-12 border-t border-white/5 mt-20">
                <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div class="flex items-center gap-2 opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
                        <span class="text-sm font-bold tracking-tight">UNBLOCKED ARCADE</span>
                    </div>
                    <p class="text-white/30 text-xs">
                        © 2026 Unblocked Arcade. All games are property of their respective owners.
                    </p>
                    <div class="flex gap-6 text-xs text-white/40">
                        <a href="#" class="hover:text-emerald-400 transition-colors">Privacy</a>
                        <a href="#" class="hover:text-emerald-400 transition-colors">Terms</a>
                        <a href="#" class="hover:text-emerald-400 transition-colors">Contact</a>
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

window.setSelectedGame = (id) => {
    if (id === null) {
        selectedGame = null;
        isFullscreen = false;
        document.body.classList.remove('modal-open');
    } else {
        selectedGame = gamesData.find(g => g.id === id);
        document.body.classList.add('modal-open');
    }
    render();
};

window.toggleFullscreen = () => {
    isFullscreen = !isFullscreen;
    render();
};

// Initial render
init();
