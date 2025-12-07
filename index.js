/**
 * Cloudflare Worker Navigation Site v7.2 (Design Edition + Full Opacity Control)
 * Features: High-End UI, Ceramic/Deep-Space Themes, Icon & Card Background Opacity Control
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
            /* --- 🌑 深色主题 (Deep Space) --- */
            --bg-grad-start: #0f172a;
            --bg-grad-end: #020617;
            
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --text-accent: #818cf8; /* Indigo-400 */
            
            /* 卡片颜色定义 (RGB) - 用于动态透明度 */
            --card-rgb: 30, 41, 59;      /* Slate-800 */
            --hover-rgb: 51, 65, 85;     /* Slate-700 */
            
            /* 玻璃卡片 - 透明度由 JS 动态控制 */
            --glass-bg: rgba(15, 23, 42, 0.6);
            --glass-border: rgba(255, 255, 255, 0.08);
            --glass-highlight: rgba(255, 255, 255, 0.03);
            
            --card-bg: rgba(var(--card-rgb), var(--card-opacity, 0.4));
            --card-hover: rgba(var(--hover-rgb), var(--hover-opacity, 0.6));
            
            /* 交互 */
            --input-bg: rgba(0, 0, 0, 0.4);
            --modal-bg: rgba(15, 23, 42, 0.95);
            --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
            --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.15);
            
            --icon-size: 32px;
        }

        .light-theme {
            /* --- ☀️ 素色主题 (Ceramic Air) --- */
            --bg-grad-start: #f8fafc;
            --bg-grad-end: #e2e8f0;
            
            --text-primary: #1e293b;
            --text-secondary: #64748b;
            --text-accent: #4f46e5; /* Indigo-600 */
            
            /* 卡片颜色定义 (RGB) */
            --card-rgb: 255, 255, 255;
            --hover-rgb: 255, 255, 255;
            
            /* 陶瓷卡片 */
            --glass-bg: rgba(255, 255, 255, 0.65);
            --glass-border: rgba(255, 255, 255, 0.4);
            --glass-highlight: rgba(255, 255, 255, 0.8);
            
            --card-bg: rgba(var(--card-rgb), var(--card-opacity, 0.6));
            --card-hover: rgba(var(--hover-rgb), var(--hover-opacity, 0.9));
            
            /* 交互 */
            --input-bg: rgba(255, 255, 255, 0.7);
            --modal-bg: rgba(255, 255, 255, 0.98);
            --shadow-sm: 0 4px 15px -3px rgba(148, 163, 184, 0.2);
            --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.1);
        }

        body { 
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            color: var(--text-primary);
            background: linear-gradient(135deg, var(--bg-grad-start), var(--bg-grad-end));
            background-attachment: fixed;
            transition: color 0.3s;
            -webkit-font-smoothing: antialiased;
        }

        /* --- 组件样式 --- */
        
        .glass-panel {
            background: var(--glass-bg);
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            box-shadow: var(--shadow-sm);
        }

        /* 卡片特效 */
        .nav-card {
            background: var(--card-bg);
            border: 1px solid var(--glass-border);
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        .nav-card::before { /* 顶部高光 */
            content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
            background: linear-gradient(90deg, transparent, var(--glass-highlight), transparent);
            opacity: 0.5;
        }
        .nav-card:hover {
            transform: translateY(-4px);
            background: var(--card-hover);
            box-shadow: var(--shadow-glow), 0 10px 15px -3px rgba(0,0,0,0.1);
            border-color: var(--text-accent);
        }
        .nav-card:active { transform: scale(0.98); }

        /* 输入框 */
        .search-input {
            background: var(--input-bg);
            border: 1px solid var(--glass-border);
            color: var(--text-primary);
            transition: all 0.3s;
        }
        .search-input:focus {
            background: var(--card-bg);
            border-color: var(--text-accent);
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
        }

        /* 按钮 */
        .btn-icon {
            background: var(--card-bg); border: 1px solid var(--glass-border);
            color: var(--text-secondary); transition: all 0.2s;
        }
        .btn-icon:hover {
            background: var(--text-accent); color: white; border-color: transparent;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }
        
        /* 标签 */
        .pill-tag {
            font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
            color: var(--text-secondary); padding: 4px 12px;
            background: var(--glass-highlight); border: 1px solid var(--glass-border);
            border-radius: 99px; transition: all 0.2s;
        }
        .pill-tag.active {
            background: var(--text-accent); color: white; border-color: transparent;
            box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
        }
        .pill-tag:hover:not(.active) { background: var(--glass-border); color: var(--text-primary); }

        /* 右键菜单 */
        .context-menu {
            background: var(--modal-bg); border: 1px solid var(--glass-border);
            border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            padding: 6px; position: fixed; z-index: 100; min-width: 160px;
            animation: menuPop 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes menuPop { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .menu-item {
            padding: 8px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px;
            font-size: 13px; font-weight: 500; color: var(--text-primary); transition: background 0.1s;
        }
        .menu-item:hover { background: var(--text-accent); color: white; }
        .menu-item.danger:hover { background: #ef4444; color: white; }

        /* 壁纸层 */
        .bg-layer { position: fixed; inset: 0; z-index: -10; background-size: cover; background-position: center; transition: opacity 0.5s ease; }
        
        /* 图标样式: 透明度受控 */
        .link-icon { 
            width: var(--icon-size); 
            height: var(--icon-size); 
            transition: transform 0.3s; 
            opacity: var(--icon-opacity, 1);
        }
        .nav-card:hover .link-icon { transform: scale(1.1); }
        
        /* 拖拽 */
        .sortable-ghost { opacity: 0.4; background: var(--text-accent); border-radius: 12px; }
        .sortable-drag { cursor: grabbing; transform: scale(1.05) rotate(2deg); opacity: 0.9; }
        
        /* 滚动条隐藏 */
        ::-webkit-scrollbar { width: 0px; }
    </style>
</head>
<body x-data="app()" :class="{ 'light-theme': theme === 'light' }" @click="closeMenu()" @keydown.window="handleKeydown($event)" @contextmenu.prevent>

    <div class="bg-layer" :style="\`background-image: url('\${bgUrl}'); filter: blur(\${settings.blur}px) brightness(\${theme === 'light' ? 1.05 : 0.6}); opacity: \${theme === 'light' && !settings.showBgInLight ? 0 : 1}\`"></div>

    <nav class="sticky top-0 z-40 glass-panel border-x-0 border-t-0 px-4 py-3 mb-8 transition-all duration-300">
        <div class="mx-auto flex justify-between items-center" :class="settings.layoutWidth === 'wide' ? 'max-w-[96%]' : 'max-w-7xl'">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
                    <i class="fa-solid fa-rocket"></i>
                </div>
                <div class="hidden sm:block">
                    <div class="font-bold text-lg tracking-tight leading-none mb-1" style="color: var(--text-primary)">Nexus</div>
                    <div class="text-[11px] font-medium tracking-wide flex items-center gap-3" style="color: var(--text-secondary)">
                        <span x-text="timeStr"></span>
                        <span x-show="weather.temp" class="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded">
                            <i class="fa-solid fa-cloud"></i> <span x-text="weather.temp + '°'"></span>
                        </span>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <template x-if="status.saving"><div class="animate-spin w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div></template>
                <div x-show="status.unsaved" class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                
                <button @click="toggleTheme()" class="btn-icon w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                    <i class="fa-solid transition-transform duration-500" :class="theme === 'dark' ? 'fa-moon rotate-0' : 'fa-sun -rotate-90'"></i>
                </button>

                <template x-if="!isLoggedIn">
                    <button @click="modals.login = true" class="btn-icon w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                        <i class="fa-solid fa-user-shield"></i>
                    </button>
                </template>

                <template x-if="isLoggedIn">
                    <div class="relative" x-data="{ open: false }">
                        <button @click.stop="open = !open" class="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:scale-105 transition active:scale-95">
                            <i class="fa-solid fa-bars"></i>
                        </button>
                        <div x-show="open" @click.outside="open = false" x-transition.origin.top.right class="context-menu" style="top: 50px; right: 0; position: absolute; min-width: 180px;">
                            <div @click="openGroupModal()" class="menu-item"><i class="fa-solid fa-folder-plus w-5 opacity-70"></i> 新建分组</div>
                            <div @click="modals.settings = true" class="menu-item"><i class="fa-solid fa-sliders w-5 opacity-70"></i> 仪表盘设置</div>
                            <div class="h-px bg-white/10 my-1"></div>
                            <div @click="logout()" class="menu-item danger text-red-400"><i class="fa-solid fa-power-off w-5"></i> 安全退出</div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </nav>

    <main class="mx-auto px-4 sm:px-6 pb-24" :class="settings.layoutWidth === 'wide' ? 'max-w-[96%]' : 'max-w-7xl'">
        
        <div class="max-w-2xl mx-auto mb-14 relative z-10 animate-fade-in-up">
            <div class="flex justify-center gap-3 mb-5">
                <template x-for="eng in engines">
                    <button @click="settings.engine = eng.val; saveSettings()" 
                        class="pill-tag" :class="{ 'active': settings.engine === eng.val }">
                        <span x-text="eng.name"></span>
                    </button>
                </template>
            </div>
            <div class="relative group transform transition-all duration-300 focus-within:scale-105">
                <input x-ref="searchInput" type="text" x-model="search" @keydown.enter="doSearch()" placeholder="Search..." 
                    class="search-input w-full h-14 pl-14 pr-6 rounded-2xl text-lg outline-none shadow-xl">
                <div class="absolute left-0 top-0 h-14 w-14 flex items-center justify-center opacity-40 pointer-events-none">
                    <i class="fa-solid fa-magnifying-glass text-lg"></i>
                </div>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-30 text-xs font-mono pointer-events-none">
                    <span class="border border-current px-1.5 rounded">/</span>
                </div>
            </div>
        </div>

        <div id="groups-container" class="space-y-10">
            <template x-for="group in filteredGroups" :key="group.id">
                <div class="group-container transition-opacity duration-300" :data-id="group.id">
                    <div class="flex items-center justify-between mb-4 px-1 group/header select-none">
                        <div class="flex items-center gap-3">
                            <h2 class="text-lg font-bold tracking-tight flex items-center gap-2" style="color: var(--text-primary)">
                                <span x-text="group.name"></span>
                                <i x-show="group.isPrivate" class="fa-solid fa-lock text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full"></i>
                            </h2>
                            <template x-if="isLoggedIn && !search">
                                <div class="cursor-move handle-group opacity-0 group-hover/header:opacity-100 p-1.5 hover:bg-white/5 rounded text-xs transition" style="color: var(--text-secondary)">
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

                    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sortable-items min-h-[80px]" 
                         :data-group-id="group.id"
                         x-init="initSortable($el)">
                        
                        <template x-for="link in group.items" :key="link.id">
                            <div class="nav-card rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer select-none h-full group"
                                 :data-id="link.id"
                                 @click="openLink(link.url)"
                                 @contextmenu.prevent.stop="showContextMenu($event, link, group.id)">
                                
                                <img :src="link.iconUrl || getFavicon(link.url)" class="link-icon rounded-xl bg-gray-500/5 p-0.5 object-contain" loading="lazy" onerror="this.src='https://ui-avatars.com/api/?name=W&background=random&color=fff&rounded=true'">
                                
                                <div class="min-w-0 flex-1 relative">
                                    <div class="font-semibold text-[13px] truncate leading-tight mb-0.5 flex items-center gap-1.5" style="color: var(--text-primary)">
                                        <span x-text="link.title"></span>
                                        <i x-show="link.isPrivate" class="fa-solid fa-lock text-[8px] text-amber-500"></i>
                                    </div>
                                    <div class="text-[11px] truncate opacity-60" style="color: var(--text-secondary)" x-text="link.desc || getDomain(link.url)"></div>
                                </div>
                            </div>
                        </template>
                        
                        <template x-if="isLoggedIn && !search">
                            <div @click="openLinkModal(group.id)" class="rounded-2xl border-2 border-dashed border-gray-500/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 cursor-pointer flex flex-col items-center justify-center gap-2 opacity-60 hover:opacity-100 transition duration-300 min-h-[80px]" style="color: var(--text-secondary)">
                                <div class="w-8 h-8 rounded-full bg-gray-500/10 flex items-center justify-center">
                                    <i class="fa-solid fa-plus text-xs"></i>
                                </div>
                                <span class="text-[10px] font-bold uppercase tracking-wider">Add</span>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>
        
        <div x-show="groups.length === 0 && !status.loading" class="text-center py-32 opacity-40">
            <i class="fa-brands fa-space-awesome text-6xl mb-6 animate-pulse"></i>
            <p class="text-sm tracking-wide">你的数字宇宙空空如也</p>
            <button x-show="isLoggedIn" @click="openGroupModal()" class="mt-6 px-6 py-2 rounded-full bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition text-sm font-bold">开始构建</button>
        </div>
    </main>
    
    <footer class="text-center pb-8 -mt-16 relative z-0">
        <a href="https://github.com/jinhuaitao/NAV" target="_blank" 
           class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg opacity-40 hover:opacity-100 transition-all duration-300 hover:bg-white/5 group" 
           style="color: var(--text-secondary)">
            <i class="fa-brands fa-github text-sm group-hover:text-white transition-colors"></i>
            <span class="text-xs font-mono group-hover:text-indigo-400 transition-colors">欢迎光临</span>
        </a>
    </footer>

    <div x-show="menu.show" 
         :style="\`top: \${menu.y}px; left: \${menu.x}px\`" 
         class="context-menu" @click.outside="closeMenu()" x-cloak>
        <div class="menu-item" @click="menuEdit()"><i class="fa-solid fa-pen-to-square w-5 opacity-60"></i> 编辑详情</div>
        <div class="menu-item" @click="menuCopy()"><i class="fa-solid fa-link w-5 opacity-60"></i> 复制链接</div>
        <div class="h-px bg-white/10 my-1"></div>
        <div class="menu-item danger" @click="deleteLink(menu.targetLink?.id, menu.targetGroupId)"><i class="fa-solid fa-trash-can w-5 opacity-60"></i> 移除项目</div>
    </div>

    <div x-show="modals.login" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" x-cloak x-transition.opacity>
        <div class="glass-panel p-8 rounded-2xl w-full max-w-sm relative overflow-hidden" style="background: var(--modal-bg)">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <h2 class="text-xl font-bold mb-6 text-center" style="color: var(--text-primary)" x-text="needsSetup ? '初始化指挥官' : '身份验证'"></h2>
            <form @submit.prevent="handleAuth">
                <input type="text" x-model="authForm.username" placeholder="Username" class="search-input w-full mb-3 p-3.5 rounded-xl text-center" required>
                <input type="password" x-model="authForm.password" placeholder="Password" class="search-input w-full mb-8 p-3.5 rounded-xl text-center" required>
                <button type="submit" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition transform active:scale-95">
                    <span x-show="!status.submitting" x-text="needsSetup ? '系统初始化' : '解锁控制台'"></span>
                    <span x-show="status.submitting"><i class="fa-solid fa-circle-notch fa-spin"></i></span>
                </button>
            </form>
        </div>
    </div>

    <div x-show="modals.link" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" x-cloak x-transition.opacity>
        <div class="glass-panel p-6 rounded-2xl w-full max-w-md" style="background: var(--modal-bg)" @click.away="modals.link = false">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold" style="color: var(--text-primary)" x-text="linkForm.id ? '编辑信标' : '新建信标'"></h3>
                <button x-show="linkForm.id" @click="deleteLink(linkForm.id, linkForm.groupId)" class="text-red-400 hover:text-red-300 bg-red-500/10 p-2 rounded-lg transition"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="space-y-4">
                <input type="text" x-model="linkForm.title" placeholder="标题" class="search-input w-full p-3 rounded-xl">
                <input type="text" x-model="linkForm.url" placeholder="https://" class="search-input w-full p-3 rounded-xl">
                <input type="text" x-model="linkForm.desc" placeholder="描述 (可选)" class="search-input w-full p-3 rounded-xl">
                <div class="flex gap-3">
                    <input type="text" x-model="linkForm.iconUrl" placeholder="图标 URL (可选)" class="search-input flex-1 p-3 rounded-xl text-sm">
                    <div class="flex items-center justify-center px-4 rounded-xl cursor-pointer border transition select-none" 
                         :class="linkForm.isPrivate ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-gray-500/20 bg-gray-500/5 text-gray-400'"
                         @click="linkForm.isPrivate = !linkForm.isPrivate">
                        <i class="fa-solid" :class="linkForm.isPrivate ? 'fa-lock' : 'fa-lock-open'"></i>
                    </div>
                </div>
            </div>
            <div class="mt-8 flex gap-3">
                <button @click="modals.link = false" class="flex-1 py-3 rounded-xl bg-gray-500/10 hover:bg-gray-500/20 transition font-medium" style="color: var(--text-secondary)">取消</button>
                <button @click="saveLink()" class="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20">保存</button>
            </div>
        </div>
    </div>

    <div x-show="modals.group" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" x-cloak x-transition.opacity>
        <div class="glass-panel p-6 rounded-2xl w-full max-w-sm" style="background: var(--modal-bg)" @click.away="modals.group = false">
            <h3 class="text-lg font-bold mb-6" style="color: var(--text-primary)" x-text="groupForm.id ? '重构区域' : '开拓新区域'"></h3>
            <div class="space-y-4 mb-6">
                <input type="text" x-model="groupForm.name" placeholder="区域名称" class="search-input w-full p-3.5 rounded-xl font-bold text-center" @keydown.enter="saveGroup()">
                <div @click="groupForm.isPrivate = !groupForm.isPrivate" class="p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition select-none"
                     :class="groupForm.isPrivate ? 'border-amber-500/50 bg-amber-500/10' : 'border-gray-500/20 bg-gray-500/5'">
                    <div class="w-5 h-5 rounded-full border flex items-center justify-center" :class="groupForm.isPrivate ? 'bg-amber-500 border-amber-500 text-black' : 'border-gray-500 text-transparent'">
                        <i class="fa-solid fa-check text-[10px]"></i>
                    </div>
                    <span class="text-sm font-medium" :class="groupForm.isPrivate ? 'text-amber-500' : 'text-gray-500'">设为私有区域 (隐形模式)</span>
                </div>
            </div>
            <div class="flex gap-3">
                <button @click="deleteGroup()" x-show="groupForm.id" class="px-4 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition"><i class="fa-solid fa-trash"></i></button>
                <div class="flex-1"></div>
                <button @click="modals.group = false" class="px-5 py-3 rounded-xl bg-gray-500/10 hover:bg-gray-500/20 transition" style="color: var(--text-secondary)">取消</button>
                <button @click="saveGroup()" class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg">确认</button>
            </div>
        </div>
    </div>

    <div x-show="modals.settings" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" x-cloak x-transition.opacity>
        <div class="glass-panel p-6 rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" style="background: var(--modal-bg)" @click.away="modals.settings = false">
            <h3 class="text-lg font-bold mb-6" style="color: var(--text-primary)">仪表盘设置</h3>
            <div class="space-y-6">
                <div class="p-4 rounded-xl bg-gray-500/5 border border-gray-500/10">
                    <label class="text-xs font-bold uppercase tracking-wider mb-3 block opacity-50" style="color: var(--text-secondary)">视觉背景</label>
                    <div class="flex gap-2 mb-3">
                        <button @click="settings.bgType = 'bing'" class="flex-1 py-2 rounded-lg text-xs font-medium transition border"
                            :class="settings.bgType === 'bing' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-500/20 hover:bg-gray-500/10'" style="color: var(--text-secondary)">每日 Bing</button>
                        <button @click="settings.bgType = 'custom'" class="flex-1 py-2 rounded-lg text-xs font-medium transition border"
                            :class="settings.bgType === 'custom' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-500/20 hover:bg-gray-500/10'" style="color: var(--text-secondary)">自定义 URL</button>
                    </div>
                    <input x-show="settings.bgType === 'custom'" type="text" x-model="settings.customBg" placeholder="https://image.url..." class="search-input w-full p-2.5 rounded-lg text-xs">
                </div>

                <div class="p-4 rounded-xl bg-gray-500/5 border border-gray-500/10">
                    <label class="text-xs font-bold uppercase tracking-wider mb-3 block opacity-50" style="color: var(--text-secondary)">界面布局</label>
                    <div class="flex gap-2 mb-4">
                        <button @click="settings.layoutWidth = 'center'" class="flex-1 py-2 rounded-lg text-xs font-medium transition border"
                            :class="settings.layoutWidth !== 'wide' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-500/20 hover:bg-gray-500/10'" style="color: var(--text-secondary)">标准居中</button>
                        <button @click="settings.layoutWidth = 'wide'" class="flex-1 py-2 rounded-lg text-xs font-medium transition border"
                            :class="settings.layoutWidth === 'wide' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-500/20 hover:bg-gray-500/10'" style="color: var(--text-secondary)">沉浸宽屏</button>
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between text-xs mb-2" style="color: var(--text-secondary)"><span>图标尺寸</span> <span x-text="settings.iconSize + 'px'"></span></div>
                            <input type="range" x-model="settings.iconSize" min="20" max="48" class="w-full h-1.5 bg-gray-500/20 rounded-lg appearance-none cursor-pointer accent-indigo-500" @input="updateCSSVars()">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <div class="flex justify-between text-xs mb-2" style="color: var(--text-secondary)"><span>图标透明度</span> <span x-text="settings.iconOpacity + '%'"></span></div>
                                <input type="range" x-model="settings.iconOpacity" min="10" max="100" step="5" class="w-full h-1.5 bg-gray-500/20 rounded-lg appearance-none cursor-pointer accent-indigo-500" @input="updateCSSVars()">
                            </div>
                            <div>
                                <div class="flex justify-between text-xs mb-2" style="color: var(--text-secondary)"><span>卡片背景浓度</span> <span x-text="settings.cardOpacity + '%'"></span></div>
                                <input type="range" x-model="settings.cardOpacity" min="0" max="100" step="5" class="w-full h-1.5 bg-gray-500/20 rounded-lg appearance-none cursor-pointer accent-indigo-500" @input="updateCSSVars()">
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs mb-2" style="color: var(--text-secondary)"><span>背景模糊</span> <span x-text="settings.blur + 'px'"></span></div>
                            <input type="range" x-model="settings.blur" max="20" class="w-full h-1.5 bg-gray-500/20 rounded-lg appearance-none cursor-pointer accent-indigo-500">
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs" style="color: var(--text-secondary)">浅色模式显示壁纸</span>
                            <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" name="toggle" id="bg-toggle" x-model="settings.showBgInLight" class="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300" :class="settings.showBgInLight ? 'right-0 border-indigo-500' : 'right-5 border-gray-300'"/>
                                <label for="bg-toggle" class="toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors" :class="settings.showBgInLight ? 'bg-indigo-500' : 'bg-gray-300'"></label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex gap-3">
                     <button @click="exportData()" class="flex-1 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 text-xs font-bold transition"><i class="fa-solid fa-download mr-1"></i> 备份数据</button>
                     <label class="flex-1 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-bold text-center cursor-pointer transition">
                        <i class="fa-solid fa-upload mr-1"></i> 恢复数据
                        <input type="file" class="hidden" accept=".json" @change="importData($event)">
                    </label>
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
                groups: [],
                search: '',
                timeStr: '',
                weather: { temp: null },
                theme: localStorage.getItem('theme') || 'dark',
                isLoggedIn: false,
                needsSetup: false,
                token: localStorage.getItem('nexus_token'),
                
                status: { loading: true, saving: false, submitting: false, unsaved: false },
                modals: { login: false, link: false, group: false, settings: false },
                menu: { show: false, x: 0, y: 0, targetLink: null, targetGroupId: null },
                toast: { show: false, msg: '', type: 'success' },

                // 新增 cardOpacity 默认值 40
                settings: { bgType: 'bing', customBg: '', blur: 5, engine: 'google', showBgInLight: false, iconSize: 32, layoutWidth: 'center', iconOpacity: 100, cardOpacity: 40 },
                engines: [
                    { name: 'Google', val: 'google', url: 'https://www.google.com/search?q=' },
                    { name: 'Baidu', val: 'baidu', url: 'https://www.baidu.com/s?wd=' },
                    { name: 'Bing', val: 'bing', url: 'https://www.bing.com/search?q=' },
                    { name: 'Duck', val: 'duck', url: 'https://duckduckgo.com/?q=' }
                ],

                authForm: { username: '', password: '' },
                linkForm: { id: null, groupId: null, title: '', url: '', desc: '', iconUrl: '', isPrivate: false },
                groupForm: { id: null, name: '', isPrivate: false },

                async init() {
                    setInterval(() => {
                        const now = new Date();
                        this.timeStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
                    }, 1000);

                    this.fetchWeather();
                    await Promise.all([this.checkStatus(), this.syncData('GET')]);
                    if(this.token) await this.verifyToken();
                    
                    this.initGroupSortable();
                    this.updateCSSVars();
                    this.status.loading = false;
                },

                handleKeydown(e) {
                    if (e.key === '/' && document.activeElement !== this.$refs.searchInput) { e.preventDefault(); this.$refs.searchInput.focus(); }
                    if (e.key === 'Escape') { this.modals.login = false; this.modals.link = false; this.modals.group = false; this.modals.settings = false; this.closeMenu(); }
                },

                async fetchWeather() {
                    if (!navigator.geolocation) return;
                    navigator.geolocation.getCurrentPosition(async (pos) => {
                        try {
                            const { latitude, longitude } = pos.coords;
                            const res = await fetch(\`https://api.open-meteo.com/v1/forecast?latitude=\${latitude}&longitude=\${longitude}&current_weather=true\`);
                            const data = await res.json();
                            if(data.current_weather) this.weather.temp = Math.round(data.current_weather.temperature);
                        } catch(e) {}
                    });
                },

                updateCSSVars() { 
                    document.documentElement.style.setProperty('--icon-size', this.settings.iconSize + 'px'); 
                    document.documentElement.style.setProperty('--icon-opacity', (this.settings.iconOpacity ?? 100) / 100);
                    
                    // 卡片背景透明度逻辑
                    const cardOp = (this.settings.cardOpacity ?? 40) / 100;
                    document.documentElement.style.setProperty('--card-opacity', cardOp);
                    // 悬停时稍微增加不透明度，最大为1
                    document.documentElement.style.setProperty('--hover-opacity', Math.min(cardOp + 0.3, 1));
                },

                toggleTheme() {
                    this.theme = this.theme === 'dark' ? 'light' : 'dark';
                    localStorage.setItem('theme', this.theme);
                },

                get filteredGroups() {
                    if(!this.search) return this.groups;
                    const q = this.search.toLowerCase();
                    return this.groups.map(g => ({
                        ...g, items: g.items.filter(i => i.title.toLowerCase().includes(q) || i.url.includes(q))
                    })).filter(g => g.items.length > 0);
                },

                get bgUrl() {
                    return (this.settings.bgType === 'custom' && this.settings.customBg) 
                        ? this.settings.customBg 
                        : 'https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN';
                },

                initGroupSortable() {
                    const el = document.getElementById('groups-container');
                    if(!el) return;
                    new Sortable(el, {
                        animation: 200, handle: '.handle-group', disabled: !this.isLoggedIn,
                        ghostClass: 'opacity-50',
                        onEnd: (evt) => {
                            const item = this.groups.splice(evt.oldIndex, 1)[0];
                            this.groups.splice(evt.newIndex, 0, item);
                            this.saveAll();
                        }
                    });
                },
                initSortable(el) {
                    new Sortable(el, {
                        group: 'shared-links', animation: 200, delay: 100, delayOnTouchOnly: true,
                        disabled: !this.isLoggedIn || !!this.search, ghostClass: 'sortable-ghost', dragClass: 'sortable-drag',
                        onEnd: (evt) => {
                            if (!evt.to || !evt.from) return;
                            const fromG = this.groups.find(g => String(g.id) === evt.from.dataset.groupId);
                            const toG = this.groups.find(g => String(g.id) === evt.to.dataset.groupId);
                            if (fromG && toG) {
                                const item = fromG.items.splice(evt.oldIndex, 1)[0];
                                toG.items.splice(evt.newIndex, 0, item);
                                this.saveAll();
                            }
                        }
                    });
                },

                showContextMenu(e, link, groupId) {
                    if(!this.isLoggedIn) return;
                    this.menu.targetLink = link; this.menu.targetGroupId = groupId;
                    let x = e.clientX, y = e.clientY;
                    if (window.innerWidth - x < 180) x -= 170;
                    this.menu.x = x; this.menu.y = y; this.menu.show = true;
                },
                closeMenu() { this.menu.show = false; },
                menuEdit() { this.linkForm = { ...this.menu.targetLink, groupId: this.menu.targetGroupId }; this.modals.link = true; this.closeMenu(); },
                menuCopy() { navigator.clipboard.writeText(this.menu.targetLink.url); this.showToast('链接已复制'); this.closeMenu(); },
                async deleteLink(linkId, groupId) {
                    if(!confirm('确定删除此项目？')) return;
                    const gId = String(groupId); const lId = String(linkId);
                    const group = this.groups.find(g => String(g.id) === gId);
                    if(group) {
                        group.items = group.items.filter(i => String(i.id) !== lId);
                        await this.saveAll(); this.modals.link = false; this.closeMenu(); this.showToast('项目已移除');
                    }
                },

                openLinkModal(groupId = null) {
                    const defaultGroup = groupId || (this.groups.length > 0 ? this.groups[0].id : null);
                    if(!defaultGroup && !groupId) return this.showToast('请先创建分组', 'error');
                    this.linkForm = { id: null, groupId: defaultGroup, title: '', url: '', desc: '', iconUrl: '', isPrivate: false };
                    this.modals.link = true;
                },
                saveLink() {
                    if(!this.linkForm.url) return;
                    if(!this.linkForm.url.startsWith('http')) this.linkForm.url = 'https://' + this.linkForm.url;
                    const oldIdStr = this.linkForm.id ? String(this.linkForm.id) : null;
                    if(oldIdStr) this.groups.forEach(g => g.items = g.items.filter(i => String(i.id) !== oldIdStr));
                    const g = this.groups.find(x => String(x.id) === String(this.linkForm.groupId));
                    if(g) {
                        g.items.push({ 
                            id: oldIdStr || Date.now().toString(), 
                            title: this.linkForm.title || new URL(this.linkForm.url).hostname, 
                            url: this.linkForm.url, desc: this.linkForm.desc,
                            iconUrl: this.linkForm.iconUrl, isPrivate: this.linkForm.isPrivate
                        });
                        this.saveAll(); this.modals.link = false;
                    }
                },
                openGroupModal() { this.groupForm = { id: null, name: '', isPrivate: false }; this.modals.group = true; },
                editGroup(g) { this.groupForm = { ...g }; this.modals.group = true; },
                saveGroup() {
                    if(!this.groupForm.name) return;
                    if(this.groupForm.id) { 
                        const g = this.groups.find(x => String(x.id) === String(this.groupForm.id)); 
                        if(g) { g.name = this.groupForm.name; g.isPrivate = this.groupForm.isPrivate; }
                    } else { 
                        this.groups.push({ id: Date.now().toString(), name: this.groupForm.name, isPrivate: this.groupForm.isPrivate, items: [] }); 
                        this.$nextTick(() => this.initGroupSortable()); 
                    }
                    this.saveAll(); this.modals.group = false;
                },
                deleteGroup() {
                    if(!confirm('确定删除此区域及其所有内容？')) return;
                    this.groups = this.groups.filter(x => String(x.id) !== String(this.groupForm.id));
                    this.saveAll(); this.modals.group = false;
                },

                async syncData(method, payload = null) {
                    const headers = { 'Content-Type': 'application/json' };
                    if(this.token) headers['Authorization'] = this.token;
                    if(method === 'POST') this.status.saving = true;
                    try {
                        const res = await fetch('/api/data', { method, headers, body: payload ? JSON.stringify(payload) : null });
                        if(res.status === 401) { this.logout(); return; }
                        if(method === 'GET') {
                            const data = await res.json();
                            this.groups = (Array.isArray(data.data) && data.data.length > 0 && !data.data[0].items) ? [{ id: 'default', name: '我的收藏', items: data.data }] : (data.data || []);
                            if(data.settings) { this.settings = { ...this.settings, ...data.settings }; this.updateCSSVars(); }
                        } else { this.status.unsaved = false; }
                    } catch(e) { if(method === 'POST') this.status.unsaved = true; } finally { this.status.saving = false; }
                },
                async saveAll() { if(this.isLoggedIn) await this.syncData('POST', { groups: this.groups, settings: this.settings }); },
                async saveSettings() { await this.saveAll(); },

                async checkStatus() { try { const res = await fetch('/api/status'); this.needsSetup = !(await res.json()).setup; if(this.needsSetup) this.modals.login = true; } catch(e) {} },
                async handleAuth() {
                    this.status.submitting = true;
                    const endpoint = this.needsSetup ? '/api/setup' : '/api/login';
                    try {
                        const res = await fetch(endpoint, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(this.authForm) });
                        if(res.ok) {
                            const data = await res.json();
                            this.token = data.token; localStorage.setItem('nexus_token', this.token);
                            this.isLoggedIn = true; this.modals.login = false; this.needsSetup = false;
                            this.syncData('GET'); this.showToast('欢迎回来，指挥官');
                            setTimeout(() => { this.initGroupSortable(); }, 500);
                        } else { this.showToast('身份验证失败', 'error'); }
                    } catch(e) {} this.status.submitting = false;
                },
                async verifyToken() { const res = await fetch('/api/check', { headers: { 'Authorization': this.token } }); if(!res.ok) this.logout(); else this.isLoggedIn = true; },
                logout() { this.token = null; localStorage.removeItem('nexus_token'); this.isLoggedIn = false; this.groups = []; this.syncData('GET'); this.showToast('已安全下线'); },

                doSearch() {
                    if(!this.search) return;
                    if(this.search.includes('.') && !this.search.includes(' ')) { window.open(this.search.startsWith('http') ? this.search : 'https://' + this.search, '_blank'); }
                    else { const engine = this.engines.find(e => e.val === this.settings.engine) || this.engines[0]; window.open(engine.url + encodeURIComponent(this.search), '_blank'); }
                },
                getFavicon(url) { try { return \`https://icons.duckduckgo.com/ip3/\${new URL(url).hostname}.ico\`; } catch { return ''; } },
                getDomain(url) { try { return new URL(url).hostname; } catch { return ''; } },
                openLink(url) { window.open(url, '_blank'); },
                showToast(msg, type='success') { this.toast.msg = msg; this.toast.type = type; this.toast.show = true; setTimeout(() => this.toast.show = false, 2500); },
                exportData() {
                    const blob = new Blob([JSON.stringify({ data: this.groups, settings: this.settings })], {type: "application/json"});
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = "nexus_backup.json"; a.click();
                },
                importData(e) {
                    const reader = new FileReader();
                    reader.onload = async (ev) => {
                        try {
                            const json = JSON.parse(ev.target.result);
                            if(json.data) this.groups = json.data; if(json.settings) this.settings = json.settings;
                            await this.saveAll(); this.showToast('系统恢复成功'); setTimeout(() => location.reload(), 1000);
                        } catch { this.showToast('数据文件损坏', 'error'); }
                    }; reader.readAsText(e.target.files[0]);
                }
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

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" };
        if (request.method === "OPTIONS") return new Response(null, { headers: cors });

        try {
            if (path === "/" || path === "/index.html") return new Response(HTML_TEMPLATE, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
            if (path === "/api/status") { const admin = await env.NAV_DB.get("admin_hash"); return new Response(JSON.stringify({ setup: !!admin }), { headers: cors }); }
            
            // 数据接口
            if (path === "/api/data") {
                if (request.method === "GET") {
                    let data = await env.NAV_DB.get("nav_data", { type: "json" }) || [];
                    const settings = await env.NAV_DB.get("nav_settings", { type: "json" }) || {};
                    const isAuth = await checkAuth(request, env);
                    if (!isAuth && Array.isArray(data)) {
                        data = data.filter(g => !g.isPrivate).map(g => ({ ...g, items: g.items.filter(i => !i.isPrivate) }));
                    }
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
            
            // Auth logic
            if (path === "/api/setup" && request.method === "POST") {
                if (await env.NAV_DB.get("admin_hash")) return new Response("Forbidden", { status: 403, headers: cors });
                const body = await request.json();
                const hash = await hashText(body.password);
                const creds = { username: body.username, password: hash };
                await env.NAV_DB.put("admin_hash", JSON.stringify(creds));
                return new Response(JSON.stringify({ token: "Bearer " + btoa(JSON.stringify(creds)) }), { headers: cors });
            }
            if (path === "/api/login" && request.method === "POST") {
                const body = await request.json();
                const stored = JSON.parse(await env.NAV_DB.get("admin_hash") || "{}");
                if (body.username === stored.username && (await hashText(body.password)) === stored.password) {
                    return new Response(JSON.stringify({ token: "Bearer " + btoa(JSON.stringify(stored)) }), { headers: cors });
                }
                return new Response("Unauthorized", { status: 401, headers: cors });
            }
            if (path === "/api/check") return (await checkAuth(request, env)) ? new Response("OK", { headers: cors }) : new Response("Unauthorized", { status: 401, headers: cors });
        } catch (e) { return new Response("Error: " + e.message, { status: 500, headers: cors }); }
        return new Response("Not Found", { status: 404 });
    }
};

async function checkAuth(req, env) {
    const h = req.headers.get("Authorization");
    const stored = await env.NAV_DB.get("admin_hash");
    return h && stored && h === "Bearer " + btoa(stored);
}
