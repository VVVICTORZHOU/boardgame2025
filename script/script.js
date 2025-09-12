class GameManager {
    constructor() {
        this.gameStarted = false;
        this.currentPlayer = 0;
        this.players = [];
        this.scores = [];
        this.timer = 0;
        this.timerInterval = null;
        this.gameDuration = 45;
        this.language = 'zh';
        this.darkMode = false;
        this.round = 1;  // 第一回合從1開始
        this.turnCount = 0; // 玩家輪過的次數
        this.actionAcount = 0; // 玩家調適行動次數
        this.actionMcount = 0; // 玩家減碳行動次數
        this.actionNcount = 0; // 玩家無作為行動次數


        this.eventIds = Array.from({ length: 21 }, (_, i) => i + 1);
        this.eventCounts = {};  // { id: 次數 }
        this.activeWatches = {}; // { id: HTML element }
        
        this.eventZhName = [
            '海平面持續上升', '極端風暴潮', '年度大潮海水倒灌', '鹽水入侵',
            '冰湖潰決洪水', '梅雨鋒面極端暴雨', '強熱帶氣旋侵襲（沿海）', '強熱帶氣旋侵襲（內陸）',
            '連日暴雨', '森林野火', '破紀錄熱浪', '長期乾旱',
            '高溫夜間效應', '坡地災害', '副熱帶高壓持續偏強', '土地退化與沙漠化',
            '炸彈低壓侵襲', '春季晚霜', '極地渦旋侵襲', '凍雨侵襲', '病蟲害異常爆發'
        ];
        
        this.eventEnName = [
            'Sea level rise', 'Extreme storm surge', 'Seawater Inundation', 'Saltwater Intrusion',
            'Glacial Lake Outburst Flood', 'Extreme Rainfall in Mei-Yu Front', 'Intensified tropical cyclone (Coast)', 'Intensified tropical cyclone (Inland)',
            'Prolonged heavy rainfall', 'Forest Wildfire', 'Record-breaking Heatwave', 'Prolonged drought',
            'Elevated nighttime temperatures', 'Slopeland Disaster', 'Persistent subtropical high pressure', 'Land degradation and Desertification',
            'Explosive Cyclone Strikes', 'Late Spring Frost', 'Polar Vortex Strikes', 'Ice Storm Strikes', 'Climate-driven Pest Outbreak'
        ];
        

        // 屬性圖片資源（建議放絕對或相對根目錄）
        this.eventAttrIcons = [
            { key: 'coast', img: '../img/coast_icon.png' },
            { key: 'coldsurge', img: '../img/coldsurge_icon.png' },
            { key: 'flood', img: '../img/flood_icon.png' },
            { key: 'heatwave', img: '../img/heatwave_icon.png' },
            { key: 'ecology', img: '../img/ecology_icon.png' }
        ];

        // 屬性標記 (保留數值)
        this.eventAttrCoast = [
            2, 2, 2, 1,
            0, 0, 2, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0
        ];
        this.eventAttrColdSurge = [
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            2, 1, 2, 1,
            0
        ];
        this.eventAttrFlood = [
            0, 0, 0, 0,
            1, 2, 0, 3,
            2, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 0, 0,
            0
        ];
        this.eventAttrHeatWave = [
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 2, 2, 2,
            1, 0, 1, 1,
            0, 0, 0, 0,
            0
        ];
        this.eventAttrEcology = [
            0, 0, 0, 1,
            0, 0, 0, 0,
            0, 1, 0, 1,
            0, 1, 0, 1,
            0, 1, 0, 0,
            2
        ];

        // 災害圖片（窮舉 21 筆）
        this.eventImage = [
            '../img/disaster01_img.png',
            '../img/disaster02_img.png',
            '../img/disaster03_img.png',
            '../img/disaster04_img.png',
            '../img/disaster05_img.png',
            '../img/disaster06_img.png',
            '../img/disaster07_img.png',
            '../img/disaster08_img.png',
            '../img/disaster09_img.png',
            '../img/disaster10_img.png',
            '../img/disaster11_img.png',
            '../img/disaster12_img.png',
            '../img/disaster13_img.png',
            '../img/disaster14_img.png',
            '../img/disaster15_img.png',
            '../img/disaster16_img.png',
            '../img/disaster17_img.png',
            '../img/disaster18_img.png',
            '../img/disaster19_img.png',
            '../img/disaster20_img.png',
            '../img/disaster21_img.png'
        ];

        // 災害影響區域
        this.eventObject = [
            ['A','C','D','E','F'],     // 1
            ['A','C','D','E','F'],     // 2
            ['C','D','F'],             // 3
            ['A','C','F'],             // 4
            ['A','B','E','G'],         // 5
            ['D','E','G'],             // 6
            ['A','D','E','F'],         // 7
            ['A','B','D','E','G'],     // 8
            ['A','B','D','G'],         // 9
            ['C','E','F','G'],         // 10
            ['A','B','C','F','G'],     // 11
            ['A','B','C','E','F','G'], // 12
            ['B','F','G'],             // 13
            ['A','B','D','E','G'],     // 14
            ['B','E','F','G'],         // 15
            ['B','C','E','F','G'],     // 16
            ['A','B','C','D'],         // 17
            ['A','B','D'],             // 18
            ['A','B','C','D'],         // 19
            ['C','D'],                 // 20
            ['A','B','C','D','E','F','G'] // 21
        ];

        // 災害懲罰（依區域數量生成對應數目的 1）
        this.eventPenalty = [
            [1,1,1,1,1],          // 1
            [1,1,1,1,1],          // 2
            [1,1,1],              // 3
            [1,1,1],              // 4
            [1,1,1,1],            // 5
            [1,1,1],              // 6
            [1,1,1,1],            // 7
            [1,1,1,1,1],          // 8
            [1,1,1,1],            // 9
            [1,1,1,1],            // 10
            [1,1,1,1,1],          // 11
            [1,1,1,1,1,1],        // 12
            [1,1,1],              // 13
            [1,1,1,1,1],          // 14
            [1,1,1,1],            // 15
            [1,1,1,1,1],          // 16
            [1,1,1,1],            // 17
            [1,1,1],              // 18
            [1,1,1,1],            // 19
            [1,1],                // 20
            [1,1,1,1,1,1,1]       // 21
        ];

        this.initializeElements();
        this.setupEventListeners();
        this.initializeGame();
        this.updateLanguage();
    }
    
    initializeElements() {
        this.settingsBtn = document.getElementById('settings-btn');
        this.sidebar = document.getElementById('sidebar');
        this.darkModeToggle = document.getElementById('dark-mode-toggle');
        this.languageToggle = document.getElementById('language-toggle');
        this.resetBtn = document.getElementById('reset-btn');
        this.timerElement = document.getElementById('timer');
        this.leftPanel = document.getElementById('left-panel');
        this.rightTop = document.getElementById('right-top');
        this.rightBottom = document.getElementById('right-bottom');
        this.playersPanel = document.getElementById('players-panel');
        this.startBtn = document.getElementById('start-btn');
        this.gameDurationInput = document.getElementById('game-duration');
        this.playerCountInput = document.getElementById('player-count');
        this.difficultyRatioInput = document.getElementById('difficulty-ratio');
        this.closeSidebarBtn = document.getElementById('close-sidebar-btn'); // ← 加這行
    }



    setupEventListeners() {
        // 設定按鈕
        this.settingsBtn.addEventListener('click', () => this.toggleSidebar());

        // 點擊外部關閉
        document.addEventListener('click', (e) => {
            if (!this.sidebar.contains(e.target) && !this.settingsBtn.contains(e.target)) {
                this.closeSidebar();
            }
        });
    
        // 點擊關閉按鈕關閉側邊欄
        this.closeSidebarBtn.addEventListener('click', () => this.closeSidebar());
        
        // 暗黑模式切換
        this.darkModeToggle.addEventListener('change', () => this.toggleDarkMode());
        
        // 語言切換
        this.languageToggle.addEventListener('change', () => this.toggleLanguage());
        
        // 重置遊戲
        this.resetBtn.addEventListener('click', () => this.resetGame());
        
        // 開始遊戲
        this.startBtn.addEventListener('click', () => this.startGame());

        // 遊戲人數變更
        this.playerCountInput.addEventListener('change', () => this.updatePlayerSeats());
        
        // 遊戲時長變更
        this.gameDurationInput.addEventListener('change', () => {
            this.gameDuration = parseInt(this.gameDurationInput.value);
        });
    }
    

    toggleSidebar() {
        this.sidebar.classList.toggle('open');
    }
    
    closeSidebar() {
        this.sidebar.classList.remove('open');
    }
    
    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        document.body.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
    }
    
    toggleLanguage() {
        this.language = this.language === 'zh' ? 'en' : 'zh';
        this.updateLanguage();
    }
    
    updateLanguage() {
        const elements = document.querySelectorAll('[data-zh][data-en]');
        elements.forEach(element => {
            const text = this.language === 'zh' ? element.getAttribute('data-zh') : element.getAttribute('data-en');
            if (element.tagName === 'INPUT') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        });
        
        // 更新玩家座位佔位符
        if (!this.gameStarted) {
            this.updatePlayerSeats();
        }


    }
    
    initializeGame() {
        this.updatePlayerSeats();
        this.updateTimer();
    }
    
    updatePlayerSeats() {
        const playerCount = parseInt(this.playerCountInput.value);
        this.playersPanel.innerHTML = '';
    
        // 設定網格列數
        const cols = playerCount <= 4 ? 2 : Math.ceil(Math.sqrt(playerCount));
        this.playersPanel.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
        const regions = ['Region A', 'Region B', 'Region C', 'Region D', 'Region E', 'Region F', 'Region G'];
    
        for (let i = 0; i < playerCount; i++) {
            const seatDiv = document.createElement('div');
            seatDiv.className = 'player-seat';
    
            // 建立 select 元素
            const select = document.createElement('select');
            select.dataset.player = i;
    
            regions.forEach(region => {
                const option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                select.appendChild(option);
            });
    
            seatDiv.innerHTML = `
                <div class="player-number">${i + 1}</div>
            `;
            seatDiv.appendChild(select);
            this.playersPanel.appendChild(seatDiv);
        }
    
        // 如果遊戲還沒開始，人數大於 6 人，則顯示提示訊息
        if (!this.gameStarted && playerCount > 6) {
            const message = this.language === 'zh'
                ? '人數超過6人，請注意遊戲平衡！'
                : 'More than 6 players, please be aware of game balance!';
            showMessage('warning', '', message);
        }

        // 如果有玩家名重複，則顯示警告訊息
        const playerNames = Array.from(this.playersPanel.querySelectorAll('select'))
            .map(select => select.value.trim())
            .filter(name => name !== '');
        const uniqueNames = new Set(playerNames);
        if (playerNames.length !== uniqueNames.size) {
            const message = this.language === 'zh'
                ? '有玩家名稱重複，請確認每位玩家的名稱唯一！'
                : 'There are duplicate player names, please ensure each player has a unique name!';
            showMessage('warning', '', message);
        }

        this.bindRegionSelectEvents();

    }
    
    bindRegionSelectEvents() {
        const selects = this.playersPanel.querySelectorAll('select');
        
        const updateOptions = () => {
            const selectedValues = Array.from(selects)
                .map(select => select.value)
                .filter(val => val !== '');
    
            selects.forEach(select => {
                const currentValue = select.value;
                const options = select.querySelectorAll('option');
    
                options.forEach(option => {
                    // 顯示這個選項，除非它被其他人選了
                    if (option.value === currentValue || !selectedValues.includes(option.value)) {
                        option.disabled = false;
                    } else {
                        option.disabled = true;
                    }
                });
            });
        };
    
        selects.forEach(select => {
            select.addEventListener('change', updateOptions);
        });
    
        updateOptions(); // 初始更新一次
    }
    
    
    startGame() {
        const selects = document.querySelectorAll('.player-seat select');
        this.players = Array.from(selects).map((select, index) => select.value.trim());
        
        this.scores = new Array(this.players.length).fill(0);
        this.currentPlayer = 0;
        this.gameStarted = true;
        
        // 隱藏左側面板內容，但保留空間
        this.leftPanel.innerHTML = '';
        
        // 替換右上面板為記分板
        this.createScoreboard();
        
        // 啟動計時器
        this.timer = this.gameDuration * 60; // 轉換為秒
        this.startTimer();

        // 為側邊欄添加手動修改分數控制
        this.createManualScoreControls();
    
        
        // 更新玩家座位顯示
        this.updateStatsPanel();
    }
    
    createScoreboard() {
        this.rightTop.innerHTML = `
            <div class="scoreboard">
                <div class="score-display" id="score-display"></div>
                <div class="score-buttons">
                    <button class="score-btn add-0" data-score="-1">+X</button>
                    <button class="score-btn add-0" data-score="0">+0</button>
                    <button class="score-btn add-1" data-score="1">+1</button>
                    <button class="score-btn add-2" data-score="2">+2</button>
                </div>
            </div>
        `;
        
        // 添加計分按鈕事件監聽器
        const scoreButtons = document.querySelectorAll('.score-btn');
        scoreButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const points = parseInt(btn.getAttribute('data-score'));
                this.addScore(points);
            });
        });
        
        this.updateScoreDisplay();
    }
    
    updateScoreDisplay() {
        const scoreDisplay = document.getElementById('score-display');
        if (!scoreDisplay) return;
        
        scoreDisplay.innerHTML = '';
        
        // 設定網格列數
        const cols = this.players.length <= 4 ? 2 : Math.ceil(Math.sqrt(this.players.length));
        scoreDisplay.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        this.players.forEach((player, index) => {
            const scoreDiv = document.createElement('div');
            scoreDiv.className = `player-score ${index === this.currentPlayer ? 'active' : ''}`;
            scoreDiv.innerHTML = `
                <div class="player-number">${index + 1}</div>
                <div class="player-name">${player}</div>
                <div class="score-value">${this.scores[index]}</div>
            `;
            scoreDisplay.appendChild(scoreDiv);
        });
    }

    updateManualScoreControls() {
        const inputs = document.querySelectorAll('#manual-score-controls .manual-score-input');
        inputs.forEach(input => {
            const index = parseInt(input.dataset.playerIndex);
            input.value = this.scores[index];
        });
    }
    
    
    updateGamePlayerSeats() {
        const seats = document.querySelectorAll('.player-seat');
        seats.forEach((seat, index) => {
            seat.classList.toggle('active', index === this.currentPlayer);
            const input = seat.querySelector('input');
            input.value = this.players[index];
            input.disabled = true;
        });
    }
    
    createManualScoreControls() {
        const sidebarContent = document.querySelector('.sidebar-content');
        let manualDiv = document.getElementById('manual-score-controls');
    
        // 避免重複添加
        if (manualDiv) manualDiv.remove();
    
        manualDiv = document.createElement('div');
        manualDiv.id = 'manual-score-controls';
        manualDiv.innerHTML = `<h3 style="margin-top:1rem;" data-zh="手動更改分數" data-en="Manual Score Adjust">手動更改分數</h3>`;
    
        this.players.forEach((player, index) => {
            const control = document.createElement('div');
            control.className = 'manual-score-item';
            control.innerHTML = `
                <label>${player}</label>
                <input type="number" value="${this.scores[index]}" data-player-index="${index}" class="manual-score-input">
                <button class="apply-score-btn" data-player-index="${index}" data-zh="套用" data-en="Apply">套用</button>
            `;
            manualDiv.appendChild(control);
        });
    
        sidebarContent.appendChild(manualDiv);
    
        // 綁定事件
        const applyBtns = manualDiv.querySelectorAll('.apply-score-btn');
        applyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.playerIndex);
                const input = manualDiv.querySelector(`.manual-score-input[data-player-index="${index}"]`);
                const newScore = parseInt(input.value);
    
                if (!isNaN(newScore)) {
                    this.scores[index] = newScore;
                    this.updateScoreDisplay();
                    this.updateGamePlayerSeats();
                    this.updateStatsPanel();
                }
            });
        });
    
        // 語言同步
        this.updateLanguage();
    }
    
    addScore(points) {
        if (!this.gameStarted) return;

        // 如果 points 為 -1，則 actionNcount +1，並將 points 設為 0
        // 如果 points 為 0，則 actionAcount +1
        // 如果 points 為 1 或 2，則 actionMcount +1 或 2
        if (points === -1) {
            this.actionNcount++;
            points = 0;
        } else if (points === 0) {
            this.actionAcount++;
        } else if (points === 1) {
            this.actionMcount++;
        } else if (points === 2) {
            this.actionMcount += 2;
        }
        
        this.scores[this.currentPlayer] += points;
        this.nextPlayer();
        this.updateScoreDisplay();
        this.triggerDisasterEvent();
        this.updateStatsPanel(); // 原本統計更新仍保留
        this.updateManualScoreControls(); // 更新手動分數控制面板

    }
    
    nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        this.turnCount++;
        if (this.currentPlayer === 0) {
            this.round++;  // 所有人輪過一遍後，進入新回合
        }
    }

    updateStatsPanel() {
        // 清除原本座位格線設定
        this.playersPanel.style.gridTemplateColumns = '';
        // 將 display = 'grid' 改為 'block'
        this.playersPanel.style.display = 'block';
    
        // 更新為統計資訊內容
        this.playersPanel.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label" data-zh="玩家總分" data-en="Total Score">目前所有玩家總分</div>
                    <div class="stat-value">${this.scores.reduce((a, b) => a + b, 0)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label" data-zh="回合數" data-en="Round">目前是第幾回合</div>
                    <div class="stat-value">${this.round}</div>
                </div>
            </div>
        `;

        this.updateLanguage(); // 重新觸發語言轉換
    }
    
    

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer-= 0.1; // 每0.1秒減少0.1秒
            if (this.timer < 0) this.timer = 0; // 確保不會小於0
            this.updateTimer();
            
            if (this.timer <= 0) {
                this.endGame();
            }
        }, 100); // 更新頻率為0.1秒以顯示小數點
    }
    
    updateTimer() {
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        const displaySeconds = Math.floor(seconds);
        const decimal = Math.floor((seconds % 1) * 10);
        
        this.timerElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}.${decimal}`;
    }
    
    endGame() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // 顯示遊戲結束訊息
        const winner = this.getWinner();
        const message = this.language === 'zh' 
            ? `遊戲結束！獲勝者：${winner.name} (${winner.score}分)`
            : `Game Over! Winner: ${winner.name} (${winner.score} points)`;
        
        alert(message);
    }
    
    getWinner() {
        let maxScore = Math.max(...this.scores);
        let winnerIndex = this.scores.indexOf(maxScore);
        return {
            name: this.players[winnerIndex],
            score: maxScore
        };
    }
    

    triggerDisasterEvent() {
        const randomIndex = Math.floor(Math.random() * this.eventIds.length);
        const id = this.eventIds[randomIndex];
        if (!this.eventCounts[id]) this.eventCounts[id] = 0;
        this.eventCounts[id]++;
        const count = this.eventCounts[id];
    
        console.log(`Disaster ID: ${id}, Count: ${count}`);
    
        if (count === 2) {
            this.addDisasterWatch(id);
        } else if (count === 3) {
            this.showDisasterDetailPopup(id);

            // 0.5 秒延遲後觸發
            const delay = 500 //500 ms
            setTimeout(() => {
                this.removeDisasterWatch(id);
                this.eventCounts[id] = 0;
            }, delay);
        }
    }
    
    
    addDisasterWatch(id) {
        const name = this.language === 'zh' ? this.eventZhName[id - 1] : this.eventEnName[id - 1];
    
        const watchBox = document.createElement('div');
        watchBox.className = 'disaster-watch-box';
        watchBox.setAttribute('data-id', id);
    
        // 生成屬性圖示
        const attrIcons = [];
        const index = id - 1;
        const attrMap = [
            this.eventAttrCoast[index],
            this.eventAttrColdSurge[index],
            this.eventAttrFlood[index],
            this.eventAttrHeatWave[index],
            this.eventAttrEcology[index]
        ];
    
        attrMap.forEach((hasAttr, i) => {
            // 如果屬性強度大於 0.5 且圖示數量少於 4，則添加圖示
            if (hasAttr > 0.5 && attrIcons.length < 4) {
                const icon = document.createElement('img');
                icon.src = this.eventAttrIcons[i].img;
                icon.alt = this.eventAttrIcons[i].key;
                icon.className = 'attr-icon';
                attrIcons.push(icon);
            }
        });
    
        // 建立 Watch HTML 結構
        const left = document.createElement('div');
        left.className = 'watch-left';
        left.textContent = `Disaster Watch: ${name}`;
    
        const right = document.createElement('div');
        right.className = 'watch-right';
    
        const iconContainer = document.createElement('div');
        iconContainer.className = 'attr-icons';
        attrIcons.forEach(icon => iconContainer.appendChild(icon));
    
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-watch-btn';
        removeBtn.title = this.language === 'zh' ? '解除災害' : 'Remove disaster';
        removeBtn.textContent = '✕';
    
        removeBtn.addEventListener('click', () => {
            this.removeDisasterWatch(id);
            this.eventCounts[id] = 0;
        });
    
        right.appendChild(iconContainer);
        right.appendChild(removeBtn);
    
        watchBox.appendChild(left);
        watchBox.appendChild(right);
    
        this.leftPanel.prepend(watchBox);
        this.activeWatches[id] = watchBox;
    }
    
    

    removeDisasterWatch(id) {
        const box = this.activeWatches[id];
        if (box) {
            box.remove();
            delete this.activeWatches[id];
        }
    }

    
    showDisasterDetailPopup(id) {
        const name = this.language === 'zh' ? this.eventZhName[id - 1] : this.eventEnName[id - 1];
        const imgSrc = this.eventImage[id - 1];
        const areas = this.eventObject[id - 1];
        const penalties = this.eventPenalty[id - 1];
        const intensityratio = 0.4; // 假設強度比例為 1（可根據實際需求調整
        const AdaptationNum = this.actionAcount;
        const MitigationNum = this.actionMcount;
        const NoactionNum = this.actionNcount;
        const playerCount = this.players.length;
        const difficultyRatio = parseFloat(this.difficultyRatioInput.value) || 1;
        let ratio = 1; // 預設值

        ratio = intensityratio + (AdaptationNum + NoactionNum) * (1/(8 * playerCount * difficultyRatio) - 0.4/160)
        
        console.log(`AdaptationNum: ${AdaptationNum}, MitigationNum: ${MitigationNum}, NoactionNum: ${NoactionNum}, playerCount: ${playerCount}, difficulty: ${difficultyRatio}, >>> ratio: ${ratio}`);

        // 建立屬性圖示：使用四捨五入顯示強度（每屬性可 0~3 個圖）
        //todo 
        const roundedAttrs = [
            Math.round(this.eventAttrCoast[id - 1] *ratio) ,
            Math.round(this.eventAttrColdSurge[id - 1] *ratio) ,
            Math.round(this.eventAttrFlood[id - 1] *ratio),
            Math.round(this.eventAttrHeatWave[id - 1] *ratio),
            Math.round(this.eventAttrEcology[id - 1] *ratio)
        ];
    
        const attrIcons = [];
        roundedAttrs.forEach((count, i) => {
            for (let j = 0; j < count; j++) {
                const icon = document.createElement('img');
                icon.src = this.eventAttrIcons[i].img;
                icon.alt = this.eventAttrIcons[i].key;
                icon.className = 'attr-icon';
                attrIcons.push(icon);
            }
        });
    
        // 建立 DOM 結構
        const popup = document.createElement('div');
        popup.className = 'disaster-popup';
    
        const left = document.createElement('div');
        left.className = 'popup-left';
        const image = document.createElement('img');
        image.src = imgSrc;
        image.className = 'popup-img';
        left.appendChild(image);
    
        const right = document.createElement('div');
        right.className = 'popup-right';
    
        const title = document.createElement('h2');
        title.textContent = this.language === 'zh' ? `災害「${name}」爆發！` : `Disaster "${name}" Erupted!`;
    
        const attrRow = document.createElement('div');
        attrRow.className = 'popup-attr-row';
        attrIcons.forEach(icon => attrRow.appendChild(icon));
        

        right.appendChild(title);
        right.appendChild(attrRow);


        // ✅ 判斷是否所有屬性皆為 0
        if (roundedAttrs.every(v => v === 0)) {
            const safeMsg = document.createElement('p');
            safeMsg.className = 'popup-safe-msg flash-safe';
            safeMsg.textContent = this.language === 'zh'
                ? '這次災害過於微弱，未造成任何影響！'
                : 'This disaster was too weak, no effect occurred!';
            right.appendChild(safeMsg);
            
        } else {
            const penalityText = document.createElement('p');
            penalityText.className = 'popup-penalty-text';
            penalityText.textContent = this.language === 'zh'
                ? `扣 ${penalties[0] || 1} 分`
                : `Penalty: -${penalties[0] || 1} pts`;

            const regionButtons = document.createElement('div');
            regionButtons.className = 'popup-region-buttons';

        
            areas.forEach((regionCode, idx) => {
                const playerIndex = this.players.findIndex(name => name.includes(regionCode));
                if (playerIndex === -1) return; // ❌ 無對應玩家 → 不建立按鈕
            
                const penalty = penalties[idx] || 1;
            
                const btn = document.createElement('button');
                const regionLabel = this.language === 'zh'
                    ? `區域 ${regionCode}` //（扣 ${penalty} 分）
                    : `Region ${regionCode}`; // (-${penalty} pts)`;
            
                btn.textContent = regionLabel;
                btn.className = 'region-penalty-btn';
            
                btn.addEventListener('click', () => {
                    this.scores[playerIndex] -= penalty;
                    this.updateScoreDisplay();
                    this.updateManualScoreControls(); // 🔥 同步更新側邊欄輸入框
                    this.updateGamePlayerSeats(); // 左下座位同步顯示 active 狀態與玩家名
                    this.updateStatsPanel();      // 右下統計更新
                    
                    
                    btn.disabled = true;
                    
                    // 👇 讓該玩家區塊閃紅提示
                    const scoreBlocks = document.querySelectorAll('.player-score');
                    if (scoreBlocks[playerIndex]) {
                        scoreBlocks[playerIndex].classList.add('flash-penalty');
                        setTimeout(() => {
                            scoreBlocks[playerIndex].classList.remove('flash-penalty');
                        }, 400);
                    }
                });
            
                regionButtons.appendChild(btn);
            });

            right.appendChild(penalityText);
            right.appendChild(regionButtons);
        }
        
    
        const clearBtn = document.createElement('button');
        clearBtn.textContent = this.language === 'zh' ? '清除' : 'Clear';
        clearBtn.className = 'popup-clear-btn';
        clearBtn.addEventListener('click', () => {
            popup.remove();
        });
    


        right.appendChild(clearBtn);
        popup.appendChild(left);
        popup.appendChild(right);
    
        document.body.appendChild(popup);
    }

    
    resetGame() {
        // 停止計時器
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // 重置遊戲狀態
        this.gameStarted = false;
        this.currentPlayer = 0;
        this.players = [];
        this.scores = [];
        this.timer = 0;
        this.round = 1;  // 重置回合數
        this.turnCount = 0; // 重置玩家輪過的次數
        this.eventCounts = {};  // 重置事件計數
        this.activeWatches = {}; // 重置活動的 Watch 方塊
        this.actionAcount = 0; // 重置行動次數
        this.actionMcount = 0;
        this.actionNcount = 0;

        
        // 重置輸入值
        this.gameDurationInput.value = 45;
        this.playerCountInput.value = 4;
        this.gameDuration = 45;
        
        // 恢復左側面板
        this.leftPanel.innerHTML = `
        
            <div class="input-group">
                <label data-zh="遊戲時長 (分鐘)" data-en="Game Duration (minutes)">遊戲時長 (分鐘)</label>
                <div class="input-with-btn">
                    <input type="number" id="game-duration" value="45" min="10" max="180">
                    <button class="help-btn" data-message="遊戲時長決定每局遊戲的分鐘數，預設為 45 分鐘。The game duration sets the length of each game in minutes, default is 45 minutes.">?</button>
                    
                </div>
            </div>
            <div class="input-group">
                <label data-zh="遊戲人數" data-en="Number of Players">遊戲人數</label>
                <div class="input-with-btn">
                    <input type="number" id="player-count" value="4" min="2" max="8">
                    <button class="help-btn" data-message="此欄決定遊戲中參與的玩家數量，預設為 4 人，允許 3 至 6 人參加。This field sets the number of players participating in the game, default is 4 players, allowing 3 to 6 players.">?</button>
                </div>
            </div>
            <div class="input-group">
                <label data-zh="難度冗額" data-en="Difficulty Multiplier">難度冗額</label>
                <div class="input-with-btn">
                    <input type="number" id="difficulty-ratio" value="3" min="1.5" max="5" step="0.1">
                    <button class="help-btn" data-message="設定遊戲難度倍率，數值越小越難，預設為 3。Sets the game difficulty multiplier, higher values increase difficulty, default is 3.">?</button>
                </div>
            </div>
        
        `;
        
        // 恢復右上面板
        this.rightTop.innerHTML = `
            <button class="start-btn" id="start-btn" data-zh="開始遊戲" data-en="Start Game">開始遊戲</button>
        `;
        
        // 重新初始化元素和事件監聽器
        this.gameDurationInput = document.getElementById('game-duration');
        this.playerCountInput = document.getElementById('player-count');
        this.difficultyRatioInput = document.getElementById('difficulty-ratio');
        this.startBtn = document.getElementById('start-btn');
        
        this.gameDurationInput.addEventListener('change', () => {
            this.gameDuration = parseInt(this.gameDurationInput.value);
        });
        this.playerCountInput.addEventListener('change', () => this.updatePlayerSeats());
        this.startBtn.addEventListener('click', () => this.startGame());
        
        // 重置計時器顯示
        this.timerElement.textContent = '00:00.0';
        
        // 更新玩家座位
        this.updatePlayerSeats();
        
        // 更新語言
        this.updateLanguage();
        
        // 關閉側邊欄
        this.closeSidebar();
    }
}

// 頁面載入完成後初始化遊戲
document.addEventListener('DOMContentLoaded', () => {
    new GameManager();
});

function showMessage(type = 'notification', title = '', content = '') {
    // 避免重複出現多個彈窗
    if (document.querySelector('.top-message-box')) return;

    const container = document.createElement('div');
    container.className = `top-message-box ${type}`;
    container.innerHTML = `
        <div class="message-content">
            <h3 class="message-title">${title}</h3>
            <p class="message-body">${content}</p>
            <button class="message-close-btn">OK</button>
        </div>
    `;

    document.body.appendChild(container);

    // 按下關閉按鈕移除訊息
    const closeBtn = container.querySelector('.message-close-btn');
    closeBtn.addEventListener('click', () => {
        container.classList.add('closing');
        setTimeout(() => container.remove(), 300); // 加一點淡出動畫效果
    });
}



document.querySelectorAll('.help-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const msg = btn.dataset.message;
        showMessage('notification', '功能提示 Function Info.', msg);
    });
});

// 一般通知
//showMessage('notification', '設定成功', '已儲存遊戲設定。');

// 警告訊息
//showMessage('warning', '警告', '請先輸入所有玩家名稱再開始遊戲！');
