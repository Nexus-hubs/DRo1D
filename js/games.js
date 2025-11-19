/**
 * DRo1D Mini-Games Module
 * Interactive games with futuristic themes
 */

import logger from './logger.js';

// ═══════════════════════════════════════════════════════════
// GAMES MANAGER
// ═══════════════════════════════════════════════════════════

export class GamesManager {
  constructor(audioSystem) {
    this.audioSystem = audioSystem;
    this.currentGame = null;
    this.modal = null;
    this.highScores = this.loadHighScores();

    this.init();
  }

  init() {
    this.createModal();
    this.attachEventListeners();
    logger.info('Games manager initialized');
  }

  createModal() {
    this.modal = document.createElement('div');
    this.modal.className = 'game-modal';
    this.modal.id = 'gameModal';
    this.modal.innerHTML = `
      <div class="game-container">
        <div class="game-header">
          <h3 id="gameTitle">GAME</h3>
          <button class="game-close" id="gameClose">CLOSE</button>
        </div>
        <div class="game-score" id="gameScore">SCORE: 0</div>
        <div class="game-area" id="gameArea"></div>
        <div class="game-controls" id="gameControls"></div>
      </div>
    `;
    document.body.appendChild(this.modal);
  }

  attachEventListeners() {
    // Close button
    document.getElementById('gameClose').addEventListener('click', () => this.closeGame());

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeGame();
      }
    });

    // Close on overlay click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeGame();
      }
    });
  }

  openGame(gameType) {
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    switch (gameType) {
    case 'memory':
      this.currentGame = new MemoryGame(this);
      break;
    case 'reaction':
      this.currentGame = new ReactionGame(this);
      break;
    case 'snake':
      this.currentGame = new SnakeGame(this);
      break;
    default:
      logger.warn(`Unknown game type: ${gameType}`);
    }

    if (this.audioSystem) {
      this.audioSystem.playSound('open');
    }

    logger.info(`Game opened: ${gameType}`);
  }

  closeGame() {
    if (this.currentGame && this.currentGame.cleanup) {
      this.currentGame.cleanup();
    }

    this.currentGame = null;
    this.modal.classList.remove('active');
    document.body.style.overflow = '';

    if (this.audioSystem) {
      this.audioSystem.playSound('close');
    }

    logger.info('Game closed');
  }

  updateScore(score) {
    document.getElementById('gameScore').textContent = `SCORE: ${score}`;
  }

  playSound(type) {
    if (this.audioSystem) {
      this.audioSystem.playSound(type);
    }
  }

  saveHighScore(game, score) {
    if (!this.highScores[game] || score > this.highScores[game]) {
      this.highScores[game] = score;
      localStorage.setItem('dro1d-highscores', JSON.stringify(this.highScores));
      logger.info(`New high score for ${game}: ${score}`);
      return true;
    }
    return false;
  }

  loadHighScores() {
    try {
      return JSON.parse(localStorage.getItem('dro1d-highscores')) || {};
    } catch {
      return {};
    }
  }

  getHighScore(game) {
    return this.highScores[game] || 0;
  }
}

// ═══════════════════════════════════════════════════════════
// MEMORY GAME
// ═══════════════════════════════════════════════════════════

class MemoryGame {
  constructor(manager) {
    this.manager = manager;
    this.symbols = ['⟡', '◈', '✦', '◆', '▲', '●', '■', '★'];
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.score = 0;
    this.locked = false;

    this.init();
  }

  init() {
    document.getElementById('gameTitle').textContent = 'NEURAL MEMORY';
    this.manager.updateScore(0);

    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
      <p style="color: var(--accent-gray); margin-bottom: 1rem; text-align: center;">
        Match all pairs to calibrate neural pathways
      </p>
      <div class="memory-grid" id="memoryGrid"></div>
      <p id="memoryMoves" style="color: var(--accent-gray); margin-top: 1rem; text-align: center;">
        MOVES: 0 | BEST: ${this.manager.getHighScore('memory') || 'N/A'}
      </p>
    `;

    const controls = document.getElementById('gameControls');
    controls.innerHTML = `
      <button id="memoryReset">RESET GRID</button>
    `;

    document.getElementById('memoryReset').addEventListener('click', () => this.reset());

    this.createGrid();
  }

  createGrid() {
    const pairs = [...this.symbols, ...this.symbols];
    this.cards = this.shuffle(pairs);

    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';

    this.cards.forEach((symbol, index) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.index = index;
      card.dataset.symbol = symbol;
      card.textContent = '?';
      card.addEventListener('click', () => this.flipCard(card));
      grid.appendChild(card);
    });
  }

  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  flipCard(card) {
    if (this.locked) return;
    if (card.classList.contains('flipped')) return;
    if (card.classList.contains('matched')) return;
    if (this.flippedCards.length >= 2) return;

    card.classList.add('flipped');
    card.textContent = card.dataset.symbol;
    this.flippedCards.push(card);
    this.manager.playSound('click');

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.updateMoves();
      this.checkMatch();
    }
  }

  checkMatch() {
    this.locked = true;

    const [card1, card2] = this.flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
      // Match found
      card1.classList.add('matched');
      card2.classList.add('matched');
      this.matchedPairs++;
      this.score += 100;
      this.manager.updateScore(this.score);
      this.manager.playSound('open');

      this.flippedCards = [];
      this.locked = false;

      if (this.matchedPairs === this.symbols.length) {
        this.gameComplete();
      }
    } else {
      // No match
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '?';
        card2.textContent = '?';
        this.flippedCards = [];
        this.locked = false;
      }, 1000);
    }
  }

  updateMoves() {
    document.getElementById('memoryMoves').textContent =
      `MOVES: ${this.moves} | BEST: ${this.manager.getHighScore('memory') || 'N/A'}`;
  }

  gameComplete() {
    const finalScore = Math.max(0, 1000 - (this.moves * 50));
    this.manager.updateScore(finalScore);

    const isHighScore = this.manager.saveHighScore('memory', this.moves);

    setTimeout(() => {
      const grid = document.getElementById('memoryGrid');
      grid.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <h3 style="color: var(--accent-cyan); font-family: 'Orbitron', monospace; margin-bottom: 1rem;">
            CALIBRATION COMPLETE
          </h3>
          <p style="color: var(--accent-gray);">
            Completed in ${this.moves} moves
            ${isHighScore ? '<br><span style="color: var(--accent-cyan);">NEW RECORD!</span>' : ''}
          </p>
        </div>
      `;
    }, 500);

    logger.info(`Memory game completed in ${this.moves} moves`);
  }

  reset() {
    this.matchedPairs = 0;
    this.moves = 0;
    this.score = 0;
    this.flippedCards = [];
    this.locked = false;
    this.manager.updateScore(0);
    this.updateMoves();
    this.createGrid();
  }

  cleanup() {
    // Nothing to clean up
  }
}

// ═══════════════════════════════════════════════════════════
// REACTION GAME
// ═══════════════════════════════════════════════════════════

class ReactionGame {
  constructor(manager) {
    this.manager = manager;
    this.waiting = false;
    this.startTime = 0;
    this.timeoutId = null;
    this.results = [];
    this.round = 0;
    this.maxRounds = 5;

    this.init();
  }

  init() {
    document.getElementById('gameTitle').textContent = 'REFLEX CALIBRATION';
    this.manager.updateScore(0);

    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
      <p style="color: var(--accent-gray); margin-bottom: 2rem; text-align: center;">
        Click when the target turns CYAN<br>
        Best of ${this.maxRounds} rounds
      </p>
      <div class="reaction-target" id="reactionTarget"></div>
      <div class="reaction-result" id="reactionResult"></div>
      <p id="reactionRound" style="color: var(--accent-gray); margin-top: 1rem; text-align: center;">
        ROUND: 0/${this.maxRounds}
      </p>
    `;

    const controls = document.getElementById('gameControls');
    controls.innerHTML = `
      <button id="reactionStart">START TEST</button>
    `;

    document.getElementById('reactionStart').addEventListener('click', () => this.startRound());
    document.getElementById('reactionTarget').addEventListener('click', () => this.handleClick());
  }

  startRound() {
    if (this.round >= this.maxRounds) {
      this.reset();
      return;
    }

    const target = document.getElementById('reactionTarget');
    const result = document.getElementById('reactionResult');

    target.classList.remove('ready');
    result.textContent = 'WAIT...';
    result.style.color = 'var(--accent-red)';

    this.waiting = true;

    // Random delay between 1-4 seconds
    const delay = 1000 + Math.random() * 3000;

    this.timeoutId = setTimeout(() => {
      target.classList.add('ready');
      result.textContent = 'CLICK NOW!';
      result.style.color = 'var(--accent-cyan)';
      this.startTime = performance.now();
      this.manager.playSound('open');
    }, delay);
  }

  handleClick() {
    const target = document.getElementById('reactionTarget');
    const result = document.getElementById('reactionResult');

    if (!this.waiting) {
      this.startRound();
      return;
    }

    if (!target.classList.contains('ready')) {
      // Clicked too early
      clearTimeout(this.timeoutId);
      result.textContent = 'TOO EARLY!';
      result.style.color = 'var(--accent-red)';
      this.manager.playSound('close');
      this.waiting = false;

      setTimeout(() => this.startRound(), 1000);
      return;
    }

    // Valid click
    const reactionTime = Math.round(performance.now() - this.startTime);
    this.results.push(reactionTime);
    this.round++;

    target.classList.remove('ready');
    result.textContent = `${reactionTime}ms`;
    result.style.color = 'var(--accent-cyan)';
    this.waiting = false;

    document.getElementById('reactionRound').textContent =
      `ROUND: ${this.round}/${this.maxRounds}`;

    this.manager.playSound('click');

    if (this.round >= this.maxRounds) {
      this.showFinalResults();
    } else {
      setTimeout(() => this.startRound(), 1500);
    }
  }

  showFinalResults() {
    const average = Math.round(
      this.results.reduce((a, b) => a + b, 0) / this.results.length
    );
    const best = Math.min(...this.results);
    const worst = Math.max(...this.results);

    // Score based on average reaction time
    const score = Math.max(0, 1000 - average);
    this.manager.updateScore(score);
    this.manager.saveHighScore('reaction', score);

    const result = document.getElementById('reactionResult');
    result.innerHTML = `
      <div style="font-size: 1rem; line-height: 1.8;">
        <div>AVERAGE: ${average}ms</div>
        <div style="font-size: 0.8rem; color: var(--accent-gray);">
          BEST: ${best}ms | WORST: ${worst}ms
        </div>
      </div>
    `;

    document.getElementById('reactionStart').textContent = 'TRY AGAIN';

    logger.info(`Reaction test complete. Average: ${average}ms`);
  }

  reset() {
    this.results = [];
    this.round = 0;
    this.waiting = false;
    this.manager.updateScore(0);
    document.getElementById('reactionResult').textContent = '';
    document.getElementById('reactionRound').textContent =
      `ROUND: 0/${this.maxRounds}`;
    document.getElementById('reactionStart').textContent = 'START TEST';
  }

  cleanup() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

// ═══════════════════════════════════════════════════════════
// SNAKE GAME
// ═══════════════════════════════════════════════════════════

class SnakeGame {
  constructor(manager) {
    this.manager = manager;
    this.canvas = null;
    this.ctx = null;
    this.gridSize = 20;
    this.tileCount = 15;
    this.snake = [];
    this.food = { x: 0, y: 0 };
    this.dx = 0;
    this.dy = 0;
    this.score = 0;
    this.gameLoop = null;
    this.isRunning = false;
    this.speed = 150;

    this.init();
  }

  init() {
    document.getElementById('gameTitle').textContent = 'DATA SNAKE';
    this.manager.updateScore(0);

    const size = Math.min(300, window.innerWidth - 80);

    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
      <canvas id="snakeCanvas" class="snake-canvas" width="${size}" height="${size}"></canvas>
      <p style="color: var(--accent-gray); margin-top: 1rem; text-align: center; font-size: 0.8rem;">
        Use arrow keys or WASD to move<br>
        HIGH SCORE: ${this.manager.getHighScore('snake')}
      </p>
    `;

    const controls = document.getElementById('gameControls');
    controls.innerHTML = `
      <button id="snakeStart">START</button>
      <button id="snakeUp">↑</button>
      <button id="snakeLeft">←</button>
      <button id="snakeDown">↓</button>
      <button id="snakeRight">→</button>
    `;

    this.canvas = document.getElementById('snakeCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.gridSize = size / this.tileCount;

    // Event listeners
    document.getElementById('snakeStart').addEventListener('click', () => this.start());
    document.getElementById('snakeUp').addEventListener('click', () => this.setDirection(0, -1));
    document.getElementById('snakeDown').addEventListener('click', () => this.setDirection(0, 1));
    document.getElementById('snakeLeft').addEventListener('click', () => this.setDirection(-1, 0));
    document.getElementById('snakeRight').addEventListener('click', () => this.setDirection(1, 0));

    document.addEventListener('keydown', this.handleKeyDown.bind(this));

    this.reset();
    this.draw();
  }

  handleKeyDown(e) {
    switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      e.preventDefault();
      this.setDirection(0, -1);
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      e.preventDefault();
      this.setDirection(0, 1);
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      e.preventDefault();
      this.setDirection(-1, 0);
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      e.preventDefault();
      this.setDirection(1, 0);
      break;
    }
  }

  setDirection(dx, dy) {
    // Prevent reverse direction
    if (this.dx === -dx && this.dy === -dy) return;
    if (this.dx !== 0 && dx !== 0) return;
    if (this.dy !== 0 && dy !== 0) return;

    this.dx = dx;
    this.dy = dy;
  }

  start() {
    if (this.isRunning) {
      this.stop();
      return;
    }

    this.reset();
    this.dx = 1;
    this.dy = 0;
    this.isRunning = true;

    document.getElementById('snakeStart').textContent = 'STOP';
    this.gameLoop = setInterval(() => this.update(), this.speed);
    logger.info('Snake game started');
  }

  stop() {
    this.isRunning = false;
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    document.getElementById('snakeStart').textContent = 'START';
  }

  reset() {
    const center = Math.floor(this.tileCount / 2);
    this.snake = [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center }
    ];
    this.score = 0;
    this.dx = 0;
    this.dy = 0;
    this.manager.updateScore(0);
    this.spawnFood();
  }

  spawnFood() {
    do {
      this.food = {
        x: Math.floor(Math.random() * this.tileCount),
        y: Math.floor(Math.random() * this.tileCount)
      };
    } while (this.snake.some(seg => seg.x === this.food.x && seg.y === this.food.y));
  }

  update() {
    // Move snake
    const head = {
      x: this.snake[0].x + this.dx,
      y: this.snake[0].y + this.dy
    };

    // Check wall collision
    if (head.x < 0 || head.x >= this.tileCount ||
        head.y < 0 || head.y >= this.tileCount) {
      this.gameOver();
      return;
    }

    // Check self collision
    if (this.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      this.gameOver();
      return;
    }

    this.snake.unshift(head);

    // Check food collision
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.manager.updateScore(this.score);
      this.manager.playSound('click');
      this.spawnFood();

      // Increase speed
      if (this.score % 50 === 0 && this.speed > 50) {
        this.speed -= 10;
        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), this.speed);
      }
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    for (let i = 0; i <= this.tileCount; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.gridSize, 0);
      this.ctx.lineTo(i * this.gridSize, this.canvas.height);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.gridSize);
      this.ctx.lineTo(this.canvas.width, i * this.gridSize);
      this.ctx.stroke();
    }

    // Draw food
    this.ctx.fillStyle = '#FF0033';
    this.ctx.shadowColor = '#FF0033';
    this.ctx.shadowBlur = 10;
    this.ctx.fillRect(
      this.food.x * this.gridSize + 2,
      this.food.y * this.gridSize + 2,
      this.gridSize - 4,
      this.gridSize - 4
    );

    // Draw snake
    this.ctx.shadowColor = '#00F0FF';
    this.ctx.shadowBlur = 5;
    this.snake.forEach((segment, index) => {
      const alpha = 1 - (index / this.snake.length) * 0.5;
      this.ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
      this.ctx.fillRect(
        segment.x * this.gridSize + 1,
        segment.y * this.gridSize + 1,
        this.gridSize - 2,
        this.gridSize - 2
      );
    });

    this.ctx.shadowBlur = 0;
  }

  gameOver() {
    this.stop();
    this.manager.playSound('close');
    this.manager.saveHighScore('snake', this.score);

    // Draw game over
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#00F0FF';
    this.ctx.font = '20px Orbitron';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 10);
    this.ctx.font = '14px Rajdhani';
    this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);

    logger.info(`Snake game over. Score: ${this.score}`);
  }

  cleanup() {
    this.stop();
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}

export default GamesManager;
