/**
 * Cloudflare Worker Navigation Site v10.3 (Auto Zen Focus Edition)
 * Features: Auto-Enter Zen Mode on Search Focus (3s), Click-to-Exit, Header Polish
 */

const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Nexus</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.13.3/dist/cdn.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    
    <style>
        [x-cloak] { display: none !important; }
        
        :root {
            /* --- 🌑 Deep Space Theme --- */
            --bg-grad-start: #0f172a;
            --bg-grad-end: #020617;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --text-accent: #818cf8;
            
            /* Glass System */
            --glass-bg: rgba(15, 23, 42, 0.75);
            --glass-border: rgba(255, 255, 255, 0.08);
            --glass-highlight: rgba(255, 255, 255, 0.05);
            
            /* Dynamic Vars */
            --card-rgb: 15, 23, 42;
            --hover-rgb: 51, 65, 85;
            --card-bg: rgba(30, 41, 59, var(--card-opacity, 0.5));
            --card-hover: rgba(51, 65, 85, var(--hover-opacity, 0.7));
            
            --modal-bg: rgba(15, 23, 42, 0.95);
            --shadow-glow: 0 0 30px rgba(99, 102, 241, 0.2);
            --icon-size: 32px;
        }

        .light-theme {
            /* --- ☀️ Ceramic Air Theme --- */
            --bg-grad-start: #f8fafc;
            --bg-grad-end: #e2e8f0;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
            --text-accent: #4f46e5;
            
            --glass-bg: rgba(255, 255, 255, 0.85);
            --glass-border: rgba(255, 255, 255, 0.6);
            --glass-highlight: rgba(255, 255, 255, 0.9);
            
            --card-rgb: 255, 255, 255;
            --hover-rgb: 255, 255, 255;
            --card-bg: rgba(255, 255, 255, var(--card-opacity, 0.7));
            --card-hover: rgba(255, 255, 255, var(--hover-opacity, 0.95));
            
            --modal-bg: rgba(255, 255, 255, 0.98);
            --shadow-glow: 0 0 20px rgba(79, 70, 229, 0.15);
        }

        body { 
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            color: var(--text-primary);
            background: linear-gradient(135deg, var(--bg-grad-start), var(--bg-grad-end));
            background-attachment: fixed;
            overflow-y: scroll;
            -webkit-tap-highlight-color: transparent;
        }

        /* --- UI Components --- */
        .header-glass {
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--glass-border);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
        }
        
        .logo-box {
            background: linear-gradient(135deg, #6366f1, #a855f7);
            box-shadow: inset 0 1px 1px rgba(255,255,255,0.4), 0 4px 10px rgba(99, 102, 241, 0.3);
            position: relative; overflow: hidden;
        }
        .logo-box::after {
            content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
            transform: rotate(45deg);
        }

        .glass-panel {
            background: var(--glass-bg);
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .nav-card {
            background: var(--card-bg); border: 1px solid var(--glass-border);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative; overflow: hidden;
        }
        .nav-card::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
            background: linear-gradient(90deg, transparent, var(--glass-highlight), transparent);
            opacity: 0.6;
        }
        .nav-card:hover {
            transform: translateY(-4px); background: var(--card-hover);
            box-shadow: var(--shadow-glow), 0 10px 20px -5px rgba(0,0,0,0.1);
            border-color: var(--text-accent); z-index: 10;
        }
        .nav-card:active { transform: scale(0.97); }

        .search-input {
            background: rgba(var(--card-rgb), 0.3); border: 1px solid var(--glass-border);
            color: var(--text-primary); transition: all 0.3s;
        }
        .search-input:focus {
            background: var(--card-bg); border-color: var(--text-accent);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
        }

        .pill-tag {
            font-size: 11px; font-weight: 600; padding: 4px 14px;
            background: var(--glass-highlight); border: 1px solid var(--glass-border);
            border-radius: 99px; transition: all 0.2s; cursor: pointer; color: var(--text-secondary);
        }
        .pill-tag.active {
            background: var(--text-accent); color: white; border-color: transparent;
            box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
        }

        .context-menu {
            background: var(--modal-bg); border: 1px solid var(--glass-border);
            border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            padding: 6px; position: fixed; z-index: 100; min-width: 160px;
            backdrop-filter: blur(20px);
            animation: menuPop 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes menuPop { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        
        .menu-item {
            padding: 8px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px;
            font-size: 13px; font-weight: 500; color: var(--text-primary); transition: background 0.1s;
        }
        .menu-item:hover { background: var(--text-accent); color: white; }
        .menu-item.danger:hover { background: #ef4444; color: white; }

        .bg-layer { position: fixed; inset: 0; z-index: -10; background-size: cover; background-position: center; transition: opacity 0.5s ease; }
        video.bg-video { position: fixed; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -10; transition: opacity 0.5s ease; }
        
        .zen-hidden { opacity: 0; pointer-events: none; transform: translateY(20px); transition: all 0.5s ease; }
        .link-icon { width: var(--icon-size); height: var(--icon-size); transition: transform 0.3s; opacity: var(--icon-opacity, 1); object-fit: contain; }
        .nav-card:hover .link-icon { transform: scale(1.15) rotate(3deg); }
        .group-content { transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out; overflow: hidden; }
        .memo-area { resize: none; outline: none; border: none; background: transparent; font-family: 'Plus Jakarta Sans', monospace; line-height: 1.6; }
        
        ::-webkit-scrollbar { width: 0px; }
    </style>
</head>
<body x-data="app()" :class="{ 'light-theme': theme === 'light' }" @click="closeMenu()" @keydown.window="handleKeydown($event)" @contextmenu.prevent>

    <template x-if="isVideoBg">
        <video autoplay loop muted playsinline class="bg-video" :src="settings.customBg" 
               :style="\`filter: blur(\${settings.blur}px) brightness(\${theme === 'light' ? 1.05 : 0.6}); opacity: \${theme === 'light' && !settings.showBgInLight ? 0 : 1}\`"></video>
    </template>
    <template x-if="!isVideoBg">
        <div class="bg-layer" :style="\`background-image: url('\${bgUrl}'); filter: blur(\${settings.blur}px) brightness(\${theme === 'light' ? 1.05 : 0.6}); opacity: \${theme === 'light' && !settings.showBgInLight ? 0 : 1}\`"></div>
    </template>

    <div x-show="zenMode" @click="zenMode = false" class="fixed inset-0 z-[5] cursor-zoom-out" title="点击空白处返回主页"></div>

    <nav class="sticky top-0 z-50 header-glass px-4 py-3 mb-8 transition-all duration-500" 
         :style="\`background-color: rgba(var(--card-rgb), \${(settings.headerOpacity ?? 75) / 100})\`"
         :class="{ 'opacity-0 -translate-y-full': zenMode }">
        <div class="mx-auto flex justify-between items-center" :class="settings.layoutWidth === 'wide' ? 'max-w-[98%]' : 'max-w-7xl'">
            <div class="flex items-center gap-4">
                <div class="logo-box w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ring-1 ring-white/10">
                    <i class="fa-solid fa-atom text-xl"></i>
                </div>
                <div class="hidden sm:block">
                    <div class="font-bold text-lg tracking-tight leading-none mb-1 text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)]">
                        NEXUS
                    </div>
                    <div class="text-[11px] font-medium tracking-wide flex items-center gap-3 opacity-80" style="color: var(--text-secondary)">
                        <span x-text="timeStr"></span>
                        <span x-show="weather.temp" class="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded ml-1 border border-white/5">
                            <i class="fa-solid fa-temperature-half text-[10px]"></i> <span x-text="weather.temp + '°'"></span>
                        </span>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <template x-if="status.saving"><div class="animate-spin w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div></template>
                <div x-show="status.unsaved" class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                
                <button @click="toggleTheme()" class="btn-icon w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" title="切换主题">
                    <i class="fa-solid transition-transform duration-500" :class="theme === 'dark' ? 'fa-moon rotate-0' : 'fa-sun -rotate-90'"></i>
                </button>
                
                <button @click="toggleZen()" class="btn-icon w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" title="禅模式 (Shift+Z)">
                    <i class="fa-solid fa-leaf"></i>
                </button>

                <template x-if="!isLoggedIn">
                    <button @click="modals.login = true" class="btn-icon w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                        <i class="fa-solid fa-user-astronaut"></i>
                    </button>
                </template>

                <template x-if="isLoggedIn">
                    <div class="relative" x-data="{ open: false }">
                        <button @click.stop="open = !open" class="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:scale-105 transition active:scale-95 ring-1 ring-white/20">
                            <i class="fa-solid fa-bars"></i>
                        </button>
                        <div x-show="open" @click.outside="open = false" x-transition.origin.top.right class="context-menu" style="top: 50px; right: 0; position: absolute; min-width: 180px;">
                            <div @click="modals.memo = true" class="menu-item"><i class="fa-solid fa-note-sticky w-5 opacity-70"></i> 快速便签 <span class="text-[9px] opacity-40 ml-auto border px-1 rounded">Shift+N</span></div>
                            <div @click="openGroupModal()" class="menu-item"><i class="fa-solid fa-folder-plus w-5 opacity-70"></i> 新建分组</div>
                            <div @click="modals.settings = true" class="menu-item"><i class="fa-solid fa-sliders w-5 opacity-70"></i> 系统设置</div>
                            <div class="h-px bg-white/10 my-1"></div>
                            <div @click="logout()" class="menu-item danger text-red-400"><i class="fa-solid fa-power-off w-5"></i> 安全退出</div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </nav>

    <main class="mx-auto px-4 sm:px-6 pb-24 transition-all duration-500" :class="[settings.layoutWidth === 'wide' ? 'max-w-[98%]' : 'max-w-7xl', zenMode ? 'mt-[30vh]' : '']">
        
        <div class="max-w-2xl mx-auto mb-12 relative z-10 animate-fade-in-up">
            <div class="flex justify-center flex-wrap gap-2 mb-4 transition-opacity duration-300" :class="{ 'opacity-0': zenMode }">
                <template x-for="eng in engines">
                    <button @click="setEngine(eng.val)" 
                        class="pill-tag" :class="{ 'active': settings.engine === eng.val }">
                        <i :class="eng.icon" class="mr-1"></i> <span x-text="eng.name"></span>
                    </button>
                </template>
                <button @click="modals.settings = true" class="pill-tag" :class="{ 'active': settings.engine === 'custom' }">
                    <i class="fa-solid fa-bolt mr-1"></i> 自定义
                </button>
            </div>
            
            <div class="relative group transform transition-all duration-300 focus-within:scale-105">
                <input x-ref="searchInput" type="text" x-model="search" @keydown.enter="doSearch()" 
                    @focus="startZenTimer()" @blur="clearZenTimer()"
                    :placeholder="getSearchPlaceholder()" 
                    class="search-input w-full h-14 pl-14 pr-14 rounded-2xl text-lg outline-none shadow-xl backdrop-blur-md">
                <div class="absolute left-0 top-0 h-14 w-14 flex items-center justify-center opacity-40 pointer-events-none">
                    <i class="fa-solid fa-magnifying-glass text-lg"></i>
                </div>
                <div x-show="search" @click="search = ''" class="absolute right-0 top-0 h-14 w-14 flex items-center justify-center opacity-40 cursor-pointer hover:opacity-100 transition">
                    <i class="fa-solid fa-times"></i>
                </div>
            </div>
        </div>

        <div id="groups-container" class="space-y-8 transition-all duration-500" :class="{ 'zen-hidden': zenMode }">
            <template x-for="group in filteredGroups" :key="group.id">
                <div class="group-container transition-all duration-300" :data-id="group.id" x-data="{ collapsed: false }">
                    <div class="flex items-center justify-between mb-3 px-1 group/header select-none">
                        <div class="flex items-center gap-3 cursor-pointer" @click="collapsed = !collapsed">
                            <i class="fa-solid fa-chevron-down text-xs transition-transform duration-300" :class="collapsed ? '-rotate-90' : ''" style="color: var(--text-secondary)"></i>
                            <h2 class="text-lg font-bold tracking-tight flex items-center gap-2" style="color: var(--text-primary)">
                                <span x-text="group.name"></span>
                                <i x-show="group.isPrivate" class="fa-solid fa-lock text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full"></i>
                                <span x-show="search" class="text-xs font-normal opacity-50 px-2 border border-white/10 rounded-full" x-text="group.items.length + ' results'"></span>
                            </h2>
                            <template x-if="isLoggedIn && !search">
                                <div class="cursor-move handle-group opacity-0 group-hover/header:opacity-100 p-1.5 hover:bg-white/5 rounded text-xs transition" style="color: var(--text-secondary)" @click.stop>
                                    <i class="fa-solid fa-grip-vertical"></i>
                                </div>
                            </template>
                        </div>
                        <template x-if="isLoggedIn">
                            <button @click="editGroup(group)" class="w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover/header:opacity-100 hover:bg-white/10 transition" style="color: var(--text-secondary)">
                                <i class="fa-solid fa-pen text-xs"></i>
                            </button>
                        </template>
                    </div>

                    <div class="group-content" :style="collapsed ? 'max-height: 0px; opacity: 0' : 'max-height: 2000px; opacity: 1'">
                        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sortable-items min-h-[10px]" 
                             :data-group-id="group.id"
                             x-init="initSortable($el)">
                            
                            <template x-for="link in group.items" :key="link.id">
                                <div class="nav-card rounded-xl p-3.5 flex items-center gap-3 cursor-pointer select-none h-full group relative"
                                     :data-id="link.id"
                                     @click="openLink(link.url)"
                                     @contextmenu.prevent.stop="showContextMenu($event, link, group.id)">
                                    
                                    <img :src="link.iconUrl || getFavicon(link.url)" class="link-icon rounded-lg bg-gray-500/5 p-0.5" loading="lazy" 
                                         onerror="this.src='https://ui-avatars.com/api/?name=Lk&background=random&color=fff&rounded=true&size=32'">
                                    
                                    <div class="min-w-0 flex-1 relative">
                                        <div class="font-semibold text-[13px] truncate leading-tight mb-0.5 flex items-center gap-1.5" style="color: var(--text-primary)">
                                            <span x-text="link.title"></span>
                                            <i x-show="link.isPrivate" class="fa-solid fa-lock text-[8px] text-amber-500"></i>
                                        </div>
                                        <div class="text-[10px] truncate opacity-60 font-medium" style="color: var(--text-secondary)" x-text="link.desc || getDomain(link.url)"></div>
                                    </div>
                                </div>
                            </template>
                            
                            <template x-if="isLoggedIn && !search">
                                <div @click="openLinkModal(group.id)" class="rounded-xl border border-dashed border-gray-500/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 cursor-pointer flex flex-col items-center justify-center gap-1 opacity-50 hover:opacity-100 transition duration-300 min-h-[70px] group" style="color: var(--text-secondary)">
                                    <i class="fa-solid fa-plus text-xs group-hover:text-indigo-400"></i>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        
        <div x-show="filteredGroups.length === 0 && !zenMode" class="text-center py-20 opacity-40">
            <template x-if="!search">
                <div>
                    <i class="fa-brands fa-space-awesome text-6xl mb-6 animate-pulse"></i>
                    <p class="text-sm tracking-wide">你的数字宇宙空空如也</p>
                    <button x-show="isLoggedIn" @click="openGroupModal()" class="mt-6 px-6 py-2 rounded-full bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition text-sm font-bold">开始构建</button>
                </div>
            </template>
            <template x-if="search">
                <div>
                    <i class="fa-solid fa-filter-circle-xmark text-5xl mb-4"></i>
                    <p class="text-sm">本地未找到 "<span x-text="search"></span>"</p>
                    <div class="mt-4 text-xs">按 <kbd class="px-2 py-1 rounded bg-white/10 font-mono">Enter</kbd> 搜索全网</div>
                </div>
            </template>
        </div>
    </main>
    
    <footer class="text-center pb-8 relative z-0 transition-opacity duration-500" :class="{ 'opacity-0 pointer-events-none': zenMode }">
        <a href="https://github.com/jinhuaitao/NAV" target="_blank" class="text-xs font-mono opacity-30 hover:opacity-100 transition-opacity" style="color: var(--text-secondary)">Nexus v10.3</a>
    </footer>

    <div x-show="menu.show" :style="\`top: \${menu.y}px; left: \${menu.x}px\`" class="context-menu" @click.outside="closeMenu()" x-cloak>
        <div class="menu-item" @click="menuEdit()"><i class="fa-solid fa-pen w-4 opacity-60"></i> 编辑</div>
        <div class="menu-item" @click="menuCopy()"><i class="fa-solid fa-link w-4 opacity-60"></i> 复制链接</div>
        <div class="h-px bg-white/10 my-1"></div>
        <div class="menu-item danger" @click="deleteLink(menu.targetLink?.id, menu.targetGroupId)"><i class="fa-solid fa-trash w-4 opacity-60"></i> 移除</div>
    </div>

    <div x-show="modals.memo" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" x-cloak x-transition.opacity>
        <div class="glass-panel p-6 rounded-2xl w-full max-w-lg h-[60vh] flex flex-col" style="background: var(--modal-bg)" @click.away="modals.memo = false">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold flex items-center gap-2" style="color: var(--text-primary)"><i class="fa-solid fa-note-sticky text-yellow-400"></i> 快速便签</h3>
                <div class="text-xs opacity-50" x-text="status.saving ? '保存中...' : '自动保存'"></div>
            </div>
            <textarea x-model="settings.memo" @input.debounce.1000ms="saveSettings()" class="memo-area w-full flex-1 text-base p-4 rounded-xl bg-gray-500/5 text-white/90" placeholder="写下你的想法..."></textarea>
            <div class="mt-4 flex justify-end"><button @click="modals.memo = false" class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold">关闭</button></div>
        </div>
    </div>

    <div x-show="modals.login" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" x-cloak x-transition.opacity>
        <div class="glass-panel p-8 rounded-2xl w-full max-w-sm relative overflow-hidden" style="background: var(--modal-bg)" @click.away="!needsSetup && (modals.login = false)">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <h2 class="text-xl font-bold mb-6 text-center" style="color: var(--text-primary)" x-text="needsSetup ? '初始化管理员' : '身份验证'"></h2>
            <form @submit.prevent="handleAuth">
                <input type="text" x-model="authForm.username" placeholder="Username" class="search-input w-full mb-3 p-3.5 rounded-xl text-center" required>
                <input type="password" x-model="authForm.password" placeholder="Password" class="search-input w-full mb-8 p-3.5 rounded-xl text-center" required>
                <button type="submit" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition transform active:scale-95 disabled:opacity-50" :disabled="status.submitting">
                    <span x-show="!status.submitting" x-text="needsSetup ? '系统初始化' : '解锁控制台'"></span>
                    <span x-show="status.submitting"><i class="fa-solid fa-circle-notch fa-spin"></i></span>
                </button>
            </form>
        </div>
    </div>

    <div x-show="modals.link" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" x-cloak x-transition.opacity>
        <div class="glass-panel p-6 rounded-2xl w-full max-w-md relative" style="background: var(--modal-bg)" @click.away="modals.link = false">
            <h3 class="text-lg font-bold mb-6" style="color: var(--text-primary)" x-text="linkForm.id ? '编辑信标' : '新建信标'"></h3>
            <div class="space-y-4">
                <div class="relative">
                    <input type="text" x-model="linkForm.url" @blur="fetchMetadata()" placeholder="https://" class="search-input w-full p-3 pl-10 rounded-xl" :class="{'border-indigo-500': status.fetchingMeta}">
                    <i class="fa-solid fa-globe absolute left-3.5 top-3.5 opacity-40"></i>
                    <div x-show="status.fetchingMeta" class="absolute right-3 top-3.5 text-indigo-400 animate-spin"><i class="fa-solid fa-circle-notch"></i></div>
                </div>
                <input type="text" x-model="linkForm.title" placeholder="标题 (自动获取)" class="search-input w-full p-3 rounded-xl">
                <input type="text" x-model="linkForm.desc" placeholder="描述 (可选)" class="search-input w-full p-3 rounded-xl">
                <div class="flex gap-3">
                    <div class="flex-1 relative"><input type="text" x-model="linkForm.iconUrl" placeholder="图标 URL" class="search-input w-full p-3 pl-9 rounded-xl text-sm"><img :src="linkForm.iconUrl || 'about:blank'" class="absolute left-2.5 top-2.5 w-5 h-5 rounded object-contain opacity-50" onerror="this.style.display='none'" onload="this.style.display='block'"></div>
                    <div class="flex items-center justify-center px-4 rounded-xl cursor-pointer border transition select-none" :class="linkForm.isPrivate ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-gray-500/20 bg-gray-500/5 text-gray-400'" @click="linkForm.isPrivate = !linkForm.isPrivate"><i class="fa-solid" :class="linkForm.isPrivate ? 'fa-lock' : 'fa-lock-open'"></i></div>
                </div>
            </div>
            <div class="mt-8 flex gap-3"><button @click="modals.link = false" class="flex-1 py-3 rounded-xl bg-gray-500/10 hover:bg-gray-500/20 transition font-medium" style="color: var(--text-secondary)">取消</button><button @click="saveLink()" class="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20">保存</button></div>
        </div>
    </div>

    <div x-show="modals.group" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" x-cloak x-transition.opacity>
        <div class="glass-panel p-6 rounded-2xl w-full max-w-sm" style="background: var(--modal-bg)" @click.away="modals.group = false">
            <h3 class="text-lg font-bold mb-6" style="color: var(--text-primary)" x-text="groupForm.id ? '重构区域' : '开拓新区域'"></h3>
            <div class="space-y-4 mb-6">
                <input type="text" x-model="groupForm.name" placeholder="区域名称" class="search-input w-full p-3.5 rounded-xl font-bold text-center" @keydown.enter="saveGroup()">
                <div @click="groupForm.isPrivate = !groupForm.isPrivate" class="p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition select-none" :class="groupForm.isPrivate ? 'border-amber-500/50 bg-amber-500/10' : 'border-gray-500/20 bg-gray-500/5'"><div class="w-5 h-5 rounded-full border flex items-center justify-center" :class="groupForm.isPrivate ? 'bg-amber-500 border-amber-500 text-black' : 'border-gray-500 text-transparent'"><i class="fa-solid fa-check text-[10px]"></i></div><span class="text-sm font-medium" :class="groupForm.isPrivate ? 'text-amber-500' : 'text-gray-500'">设为私有 (隐形模式)</span></div>
            </div>
            <div class="flex gap-3"><button @click="deleteGroup()" x-show="groupForm.id" class="px-4 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition"><i class="fa-solid fa-trash"></i></button><div class="flex-1"></div><button @click="modals.group = false" class="px-5 py-3 rounded-xl bg-gray-500/10 hover:bg-gray-500/20 transition" style="color: var(--text-secondary)">取消</button><button @click="saveGroup()" class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg">确认</button></div>
        </div>
    </div>

    <div x-show="modals.settings" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" x-cloak x-transition.opacity>
        <div class="glass-panel p-6 rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" style="background: var(--modal-bg)" @click.away="modals.settings = false">
            <h3 class="text-lg font-bold mb-6" style="color: var(--text-primary)">系统设置</h3>
            <div class="space-y-6">
                <div class="p-4 rounded-xl bg-gray-500/5 border border-gray-500/10">
                    <label class="text-xs font-bold uppercase tracking-wider mb-3 block opacity-50" style="color: var(--text-secondary)">背景源</label>
                    <div class="flex gap-2 mb-3">
                        <button @click="settings.bgType = 'bing'" class="flex-1 py-2 rounded-lg text-xs font-medium transition border" :class="settings.bgType === 'bing' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-500/20 hover:bg-gray-500/10'" style="color: var(--text-secondary)">Bing Image</button>
                        <button @click="settings.bgType = 'custom'" class="flex-1 py-2 rounded-lg text-xs font-medium transition border" :class="settings.bgType === 'custom' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-500/20 hover:bg-gray-500/10'" style="color: var(--text-secondary)">Custom URL</button>
                    </div>
                    <input x-show="settings.bgType === 'custom'" type="text" x-model="settings.customBg" placeholder="Image or Video (.mp4) URL" class="search-input w-full p-2.5 rounded-lg text-xs">
                </div>
                <div class="p-4 rounded-xl bg-gray-500/5 border border-gray-500/10">
                    <label class="text-xs font-bold uppercase tracking-wider mb-3 block opacity-50" style="color: var(--text-secondary)">自定义搜索</label>
                    <input type="text" x-model="settings.customSearchUrl" placeholder="例如: https://github.com/search?q=" class="search-input w-full p-2.5 rounded-lg text-xs">
                </div>
                <div class="p-4 rounded-xl bg-gray-500/5 border border-gray-500/10">
                    <label class="text-xs font-bold uppercase tracking-wider mb-3 block opacity-50" style="color: var(--text-secondary)">视觉 & 布局</label>
                    <div class="flex gap-2 mb-4">
                        <button @click="settings.layoutWidth = 'center'" class="flex-1 py-2 rounded-lg text-xs font-medium transition border" :class="settings.layoutWidth !== 'wide' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-500/20 hover:bg-gray-500/10'" style="color: var(--text-secondary)">标准居中</button>
                        <button @click="settings.layoutWidth = 'wide'" class="flex-1 py-2 rounded-lg text-xs font-medium transition border" :class="settings.layoutWidth === 'wide' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-500/20 hover:bg-gray-500/10'" style="color: var(--text-secondary)">宽屏模式</button>
                    </div>
                    
                    <div class="space-y-5">
                        <div><div class="flex justify-between text-xs mb-1.5" style="color: var(--text-secondary)"><span>顶部栏透明度</span> <span x-text="(settings.headerOpacity ?? 75) + '%'"></span></div><input type="range" x-model="settings.headerOpacity" min="0" max="100" step="5" class="w-full h-1.5 bg-gray-500/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"></div>
                        <div class="grid grid-cols-2 gap-4">
                            <div><div class="flex justify-between text-xs mb-1.5" style="color: var(--text-secondary)"><span>图标大小</span> <span x-text="settings.iconSize + 'px'"></span></div><input type="range" x-model="settings.iconSize" min="20" max="64" class="w-full h-1.5 bg-gray-500/20 rounded-lg appearance-none cursor-pointer accent-indigo-500" @input="updateCSSVars()"></div>
                            <div><div class="flex justify-between text-xs mb-1.5" style="color: var(--text-secondary)"><span>背景模糊</span> <span x-text="settings.blur + 'px'"></span></div><input type="range" x-model="settings.blur" max="20" class="w-full h-1.5 bg-gray-500/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"></div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div><div class="flex justify-between text-xs mb-1.5" style="color: var(--text-secondary)"><span>图标透明度</span> <span x-text="settings.iconOpacity + '%'"></span></div><input type="range" x-model="settings.iconOpacity" min="10" max="100" step="5" class="w-full h-1.5 bg-gray-500/20 rounded-lg appearance-none cursor-pointer accent-indigo-500" @input="updateCSSVars()"></div>
                            <div><div class="flex justify-between text-xs mb-1.5" style="color: var(--text-secondary)"><span>卡片浓度</span> <span x-text="settings.cardOpacity + '%'"></span></div><input type="range" x-model="settings.cardOpacity" min="0" max="100" step="5" class="w-full h-1.5 bg-gray-500/20 rounded-lg appearance-none cursor-pointer accent-indigo-500" @input="updateCSSVars()"></div>
                        </div>
                        <div class="flex items-center justify-between"><span class="text-xs" style="color: var(--text-secondary)">浅色模式保留壁纸</span><div class="relative inline-block w-9 h-5 align-middle select-none transition duration-200 ease-in"><input type="checkbox" id="bg-toggle" x-model="settings.showBgInLight" class="absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300" :class="settings.showBgInLight ? 'right-0 border-indigo-500' : 'right-4 border-gray-300'"/><label for="bg-toggle" class="block overflow-hidden h-5 rounded-full cursor-pointer transition-colors" :class="settings.showBgInLight ? 'bg-indigo-500' : 'bg-gray-300'"></label></div></div>
                    </div>
                </div>
                <div class="flex flex-col gap-3">
                     <label class="w-full py-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 text-xs font-bold text-center cursor-pointer transition border border-orange-500/20"><i class="fa-brands fa-chrome mr-1"></i> 导入 Chrome/Edge 书签<input type="file" class="hidden" accept=".html" @change="importBookmarks($event)"></label>
                    <div class="flex gap-3"><button @click="exportData()" class="flex-1 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 text-xs font-bold transition border border-blue-500/20"><i class="fa-solid fa-download mr-1"></i> 备份</button><label class="flex-1 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-bold text-center cursor-pointer transition border border-emerald-500/20"><i class="fa-solid fa-upload mr-1"></i> 恢复<input type="file" class="hidden" accept=".json" @change="importData($event)"></label></div>
                </div>
            </div>
            <button @click="saveSettings(); modals.settings=false" class="w-full mt-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition">保存更改</button>
        </div>
    </div>

    <div x-show="toast.show" x-transition.move.bottom class="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full glass-panel z-[100] flex items-center gap-3 shadow-2xl border border-indigo-500/30" x-cloak>
        <i :class="toast.type === 'error' ? 'fa-solid fa-circle-exclamation text-red-500' : 'fa-solid fa-circle-check text-green-500'"></i>
        <span x-text="toast.msg" class="text-sm font-semibold" style="color: var(--text-primary)"></span>
    </div>

    <script>
        function app() {
            return {
                groups: [], search: '', timeStr: '', weather: { temp: null },
                theme: localStorage.getItem('theme') || 'dark', isLoggedIn: false, needsSetup: false, zenMode: false, token: localStorage.getItem('nexus_token'),
                status: { loading: true, saving: false, submitting: false, unsaved: false, fetchingMeta: false },
                modals: { login: false, link: false, group: false, settings: false, memo: false },
                menu: { show: false, x: 0, y: 0, targetLink: null, targetGroupId: null },
                toast: { show: false, msg: '', type: 'success' },
                settings: { bgType: 'bing', customBg: '', blur: 0, engine: 'google', customSearchUrl: '', showBgInLight: false, iconSize: 32, layoutWidth: 'center', iconOpacity: 100, cardOpacity: 40, headerOpacity: 75, memo: '' },
                engines: [
                    { name: 'Google', val: 'google', icon: 'fa-brands fa-google', url: 'https://www.google.com/search?q=' },
                    { name: 'Bing', val: 'bing', icon: 'fa-brands fa-microsoft', url: 'https://www.bing.com/search?q=' },
                    { name: 'Baidu', val: 'baidu', icon: 'fa-solid fa-paw', url: 'https://www.baidu.com/s?wd=' },
                    { name: 'Duck', val: 'duck', icon: 'fa-solid fa-duck', url: 'https://duckduckgo.com/?q=' }
                ],
                authForm: { username: '', password: '' }, linkForm: { id: null, groupId: null, title: '', url: '', desc: '', iconUrl: '', isPrivate: false }, groupForm: { id: null, name: '', isPrivate: false },
                
                zenTimer: null,

                async init() {
                    setInterval(() => { const now = new Date(); this.timeStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }, 1000);
                    this.fetchWeather(); await Promise.all([this.checkStatus(), this.syncData('GET')]);
                    if(this.token) await this.verifyToken();
                    this.initGroupSortable(); this.updateCSSVars(); this.status.loading = false;
                },

                handleKeydown(e) {
                    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') { if (e.key === 'Escape') { document.activeElement.blur(); this.closeAllModals(); } return; }
                    if (e.key === '/') { e.preventDefault(); this.$refs.searchInput.focus(); }
                    if (e.key === 'Escape') { this.closeAllModals(); this.zenMode = false; }
                    if (e.key === 'Z' && e.shiftKey) { this.toggleZen(); }
                    if (e.key === 'N' && e.shiftKey && this.isLoggedIn) { this.modals.memo = true; }
                },
                closeAllModals() { this.modals.login = false; this.modals.link = false; this.modals.group = false; this.modals.settings = false; this.modals.memo = false; this.closeMenu(); },
                toggleZen() { this.zenMode = !this.zenMode; },
                
                startZenTimer() { if (this.zenMode) return; this.clearZenTimer(); this.zenTimer = setTimeout(() => { if (!this.zenMode && document.activeElement === this.$refs.searchInput) { this.zenMode = true; } }, 3000); },
                clearZenTimer() { if (this.zenTimer) { clearTimeout(this.zenTimer); this.zenTimer = null; } },

                setEngine(val) { this.settings.engine = val; this.saveSettings(); },

                async fetchWeather() { if (!navigator.geolocation) return; navigator.geolocation.getCurrentPosition(async (pos) => { try { const res = await fetch(\`https://api.open-meteo.com/v1/forecast?latitude=\${pos.coords.latitude}&longitude=\${pos.coords.longitude}&current_weather=true\`); const data = await res.json(); if(data.current_weather) this.weather.temp = Math.round(data.current_weather.temperature); } catch(e) {} }); },
                
                updateCSSVars() { 
                    document.documentElement.style.setProperty('--icon-size', this.settings.iconSize + 'px'); 
                    document.documentElement.style.setProperty('--icon-opacity', (this.settings.iconOpacity ?? 100) / 100);
                    const cardOp = (this.settings.cardOpacity ?? 40) / 100;
                    document.documentElement.style.setProperty('--card-opacity', cardOp);
                    document.documentElement.style.setProperty('--hover-opacity', Math.min(cardOp + 0.3, 1));
                },
                toggleTheme() { this.theme = this.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('theme', this.theme); },

                get filteredGroups() { if(!this.search) return this.groups; const q = this.search.toLowerCase(); return this.groups.map(g => ({ ...g, items: g.items.filter(i => i.title.toLowerCase().includes(q) || i.url.includes(q) || (i.desc && i.desc.toLowerCase().includes(q))) })).filter(g => g.items.length > 0); },
                get bgUrl() { if (this.settings.bgType === 'custom' && this.settings.customBg && !this.isVideoBg) return this.settings.customBg; return 'https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN'; },
                get isVideoBg() { return this.settings.bgType === 'custom' && this.settings.customBg && this.settings.customBg.endsWith('.mp4'); },
                getSearchPlaceholder() { if (this.settings.engine === 'custom') return 'Search with Custom Engine...'; return 'Search with ' + (this.engines.find(e => e.val === this.settings.engine)?.name || 'Google') + '...'; },

                initGroupSortable() { const el = document.getElementById('groups-container'); if(!el) return; new Sortable(el, { animation: 200, handle: '.handle-group', disabled: !this.isLoggedIn, ghostClass: 'opacity-50', onEnd: (evt) => { const item = this.groups.splice(evt.oldIndex, 1)[0]; this.groups.splice(evt.newIndex, 0, item); this.saveAll(); } }); },
                initSortable(el) { new Sortable(el, { group: 'shared-links', animation: 200, delay: 100, delayOnTouchOnly: true, disabled: !this.isLoggedIn || !!this.search, ghostClass: 'opacity-40', dragClass: 'opacity-100', onEnd: (evt) => { if (!evt.to || !evt.from) return; const fromG = this.groups.find(g => String(g.id) === evt.from.dataset.groupId); const toG = this.groups.find(g => String(g.id) === evt.to.dataset.groupId); if (fromG && toG) { const item = fromG.items.splice(evt.oldIndex, 1)[0]; toG.items.splice(evt.newIndex, 0, item); this.saveAll(); } } }); },

                showContextMenu(e, link, groupId) { if(!this.isLoggedIn) return; this.menu.targetLink = link; this.menu.targetGroupId = groupId; let x = e.clientX, y = e.clientY; if (window.innerWidth - x < 180) x -= 170; this.menu.x = x; this.menu.y = y; this.menu.show = true; },
                closeMenu() { this.menu.show = false; },
                menuEdit() { this.linkForm = { ...this.menu.targetLink, groupId: this.menu.targetGroupId }; this.modals.link = true; this.closeMenu(); },
                menuCopy() { navigator.clipboard.writeText(this.menu.targetLink.url); this.showToast('链接已复制'); this.closeMenu(); },
                async deleteLink(linkId, groupId) { if(!confirm('确定删除?')) return; const group = this.groups.find(g => String(g.id) === String(groupId)); if(group) { group.items = group.items.filter(i => String(i.id) !== String(linkId)); await this.saveAll(); this.modals.link = false; this.closeMenu(); this.showToast('已删除'); } },

                openLinkModal(groupId = null) { const defaultGroup = groupId || (this.groups.length > 0 ? this.groups[0].id : null); if(!defaultGroup && !groupId) return this.showToast('请先创建分组', 'error'); this.linkForm = { id: null, groupId: defaultGroup, title: '', url: '', desc: '', iconUrl: '', isPrivate: false }; this.modals.link = true; },
                async fetchMetadata() { if(!this.linkForm.url || this.linkForm.title || this.status.fetchingMeta) return; if (!this.linkForm.url.startsWith('http')) this.linkForm.url = 'https://' + this.linkForm.url; this.status.fetchingMeta = true; try { const res = await fetch('/api/meta?url=' + encodeURIComponent(this.linkForm.url)); if(res.ok) { const data = await res.json(); if(data.title) this.linkForm.title = data.title; if(data.description && !this.linkForm.desc) this.linkForm.desc = data.description.substring(0, 50); if(!this.linkForm.iconUrl) this.linkForm.iconUrl = data.icon || \`https://icons.duckduckgo.com/ip3/\${new URL(this.linkForm.url).hostname}.ico\`; } } catch(e) {} this.status.fetchingMeta = false; },
                saveLink() { if(!this.linkForm.url) return; if(!this.linkForm.url.startsWith('http')) this.linkForm.url = 'https://' + this.linkForm.url; const oldIdStr = this.linkForm.id ? String(this.linkForm.id) : null; if(oldIdStr) this.groups.forEach(g => g.items = g.items.filter(i => String(i.id) !== oldIdStr)); const g = this.groups.find(x => String(x.id) === String(this.linkForm.groupId)); if(g) { g.items.push({ id: oldIdStr || Date.now().toString(), title: this.linkForm.title || new URL(this.linkForm.url).hostname, url: this.linkForm.url, desc: this.linkForm.desc, iconUrl: this.linkForm.iconUrl, isPrivate: this.linkForm.isPrivate }); this.saveAll(); this.modals.link = false; } },
                openGroupModal() { this.groupForm = { id: null, name: '', isPrivate: false }; this.modals.group = true; }, editGroup(g) { this.groupForm = { ...g }; this.modals.group = true; },
                saveGroup() { if(!this.groupForm.name) return; if(this.groupForm.id) { const g = this.groups.find(x => String(x.id) === String(this.groupForm.id)); if(g) { g.name = this.groupForm.name; g.isPrivate = this.groupForm.isPrivate; } } else { this.groups.push({ id: Date.now().toString(), name: this.groupForm.name, isPrivate: this.groupForm.isPrivate, items: [] }); this.$nextTick(() => this.initGroupSortable()); } this.saveAll(); this.modals.group = false; },
                deleteGroup() { if(!confirm('删除此分组及所有内容?')) return; this.groups = this.groups.filter(x => String(x.id) !== String(this.groupForm.id)); this.saveAll(); this.modals.group = false; },

                async syncData(method, payload = null) { const headers = { 'Content-Type': 'application/json' }; if(this.token) headers['Authorization'] = this.token; if(method === 'POST') this.status.saving = true; try { const res = await fetch('/api/data', { method, headers, body: payload ? JSON.stringify(payload) : null }); if(res.status === 401) { this.logout(); return; } if(method === 'GET') { const data = await res.json(); this.groups = (Array.isArray(data.data) && data.data.length > 0 && !data.data[0].items) ? [{ id: 'default', name: 'Home', items: data.data }] : (data.data || []); if(data.settings) { this.settings = { ...this.settings, ...data.settings }; this.updateCSSVars(); } } else { this.status.unsaved = false; } } catch(e) { if(method === 'POST') this.status.unsaved = true; } finally { this.status.saving = false; } },
                async saveAll() { if(this.isLoggedIn) await this.syncData('POST', { groups: this.groups, settings: this.settings }); }, async saveSettings() { await this.saveAll(); },
                async checkStatus() { try { const res = await fetch('/api/status'); this.needsSetup = !(await res.json()).setup; if(this.needsSetup) this.modals.login = true; } catch(e) {} },
                async handleAuth() { this.status.submitting = true; const endpoint = this.needsSetup ? '/api/setup' : '/api/login'; try { const res = await fetch(endpoint, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(this.authForm) }); if(res.ok) { const data = await res.json(); this.token = data.token; localStorage.setItem('nexus_token', this.token); this.isLoggedIn = true; this.modals.login = false; this.needsSetup = false; this.syncData('GET'); this.showToast('欢迎回来'); setTimeout(() => { this.initGroupSortable(); }, 500); } else { this.showToast('验证失败', 'error'); } } catch(e) {} this.status.submitting = false; },
                async verifyToken() { const res = await fetch('/api/check', { headers: { 'Authorization': this.token } }); if(!res.ok) this.logout(); else this.isLoggedIn = true; },
                logout() { this.token = null; localStorage.removeItem('nexus_token'); this.isLoggedIn = false; this.groups = []; this.syncData('GET'); this.showToast('已登出'); },

                doSearch() { if(!this.search) return; if(this.search.includes('.') && !this.search.includes(' ')) { window.open(this.search.startsWith('http') ? this.search : 'https://' + this.search, '_blank'); } else { let url = ''; if(this.settings.engine === 'custom' && this.settings.customSearchUrl) { url = this.settings.customSearchUrl; } else { const engine = this.engines.find(e => e.val === this.settings.engine) || this.engines[0]; url = engine.url; } window.open(url + encodeURIComponent(this.search), '_blank'); } },
                getFavicon(url) { try { return \`https://icons.duckduckgo.com/ip3/\${new URL(url).hostname}.ico\`; } catch { return ''; } }, getDomain(url) { try { return new URL(url).hostname; } catch { return ''; } }, openLink(url) { window.open(url, '_blank'); }, showToast(msg, type='success') { this.toast.msg = msg; this.toast.type = type; this.toast.show = true; setTimeout(() => this.toast.show = false, 2500); },
                exportData() { const blob = new Blob([JSON.stringify({ data: this.groups, settings: this.settings })], {type: "application/json"}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = "nexus_backup.json"; a.click(); },
                importData(e) { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = async (ev) => { try { const json = JSON.parse(ev.target.result); if(json.data) this.groups = json.data; if(json.settings) this.settings = json.settings; await this.saveAll(); this.showToast('恢复成功'); setTimeout(() => location.reload(), 1000); } catch { this.showToast('文件损坏', 'error'); } }; reader.readAsText(file); },
                importBookmarks(e) { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = async (ev) => { const html = ev.target.result; const parser = new DOMParser(); const doc = parser.parseFromString(html, "text/html"); const links = Array.from(doc.querySelectorAll('a')); if(links.length === 0) return this.showToast('未找到书签', 'error'); const newGroup = { id: Date.now().toString(), name: 'Imported', isPrivate: false, items: links.map(a => ({ id: Math.random().toString(36).substr(2, 9), title: a.textContent, url: a.href, iconUrl: a.getAttribute('icon'), isPrivate: false })) }; this.groups.push(newGroup); await this.saveAll(); this.showToast(\`导入 \${links.length} 个书签\`); }; reader.readAsText(file); }
            }
        }
    </script>
</body>
</html>
`;

async function hashText(text) {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

class MetaHandler {
    constructor(state) { this.state = state; }
    element(element) { if (element.tagName === "title" && !this.state.title) { this.state.inTitle = true; } if (element.tagName === "meta") { const name = element.getAttribute("name"); const prop = element.getAttribute("property"); const content = element.getAttribute("content"); if (name === "description" && content) this.state.description = content; if (prop === "og:image" && content) this.state.image = content; } }
    text(text) { if (this.state.inTitle && text.text.trim()) { this.state.title = (this.state.title || "") + text.text; } }
    end(element) { if (element.tagName === "title") this.state.inTitle = false; }
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url); const path = url.pathname;
        const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" };
        if (request.method === "OPTIONS") return new Response(null, { headers: cors });

        try {
            if (path === "/" || path === "/index.html") return new Response(HTML_TEMPLATE, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
            if (path === "/api/status") { const admin = await env.NAV_DB.get("admin_hash"); return new Response(JSON.stringify({ setup: !!admin }), { headers: cors }); }

            if (path === "/api/meta") {
                const targetUrl = url.searchParams.get("url"); if (!targetUrl) return new Response("Missing URL", { status: 400 });
                try {
                    const response = await fetch(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NexusBot/10.3)' }, redirect: 'follow' });
                    const state = { title: null, description: null, image: null, inTitle: false };
                    await new HTMLRewriter().on("title", new MetaHandler(state)).on("meta", new MetaHandler(state)).transform(response).text();
                    return new Response(JSON.stringify({ title: state.title ? state.title.trim() : "", description: state.description ? state.description.trim() : "", icon: "" }), { headers: cors });
                } catch (e) { return new Response(JSON.stringify({ error: e.message }), { headers: cors }); }
            }
            
            if (path === "/api/data") {
                if (request.method === "GET") {
                    let data = await env.NAV_DB.get("nav_data", { type: "json" }) || [];
                    const settings = await env.NAV_DB.get("nav_settings", { type: "json" }) || {};
                    const isAuth = await checkAuth(request, env);
                    if (!isAuth && Array.isArray(data)) { data = data.filter(g => !g.isPrivate).map(g => ({ ...g, items: g.items.filter(i => !i.isPrivate) })); }
                    return new Response(JSON.stringify({ data, settings }), { headers: cors });
                }
                if (request.method === "POST") {
                    if (!(await checkAuth(request, env))) return new Response("Unauthorized", { status: 401, headers: cors });
                    const body = await request.json();
                    if (body.groups) await env.NAV_DB.put("nav_data", JSON.stringify(body.groups));
                    if (body.settings) await env.NAV_DB.put("nav_settings", JSON.stringify(body.settings));
                    return new Response("Saved", { headers: cors });
                }
            }
            
            if (path === "/api/setup" && request.method === "POST") {
                if (await env.NAV_DB.get("admin_hash")) return new Response("Forbidden", { status: 403, headers: cors });
                const body = await request.json(); const hash = await hashText(body.password); const creds = { username: body.username, password: hash };
                await env.NAV_DB.put("admin_hash", JSON.stringify(creds));
                return new Response(JSON.stringify({ token: "Bearer " + btoa(JSON.stringify(creds)) }), { headers: cors });
            }

            if (path === "/api/login" && request.method === "POST") {
                const body = await request.json(); const stored = JSON.parse(await env.NAV_DB.get("admin_hash") || "{}");
                if (body.username === stored.username && (await hashText(body.password)) === stored.password) { return new Response(JSON.stringify({ token: "Bearer " + btoa(JSON.stringify(stored)) }), { headers: cors }); }
                return new Response("Unauthorized", { status: 401, headers: cors });
            }

            if (path === "/api/check") { return (await checkAuth(request, env)) ? new Response("OK", { headers: cors }) : new Response("Unauthorized", { status: 401, headers: cors }); }

        } catch (e) { return new Response("Error: " + e.message, { status: 500, headers: cors }); }
        return new Response("Not Found", { status: 404 });
    }
};

async function checkAuth(req, env) { const h = req.headers.get("Authorization"); if (!h) return false; const stored = await env.NAV_DB.get("admin_hash"); return stored && h === "Bearer " + btoa(stored); }
