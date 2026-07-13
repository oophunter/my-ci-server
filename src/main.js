import './style.css';
import { generate5RecommendedSets } from './lotto.js';

// State management
let currentData = null;

// DOM Elements
const btnGenerate = document.getElementById('btn-generate');
const recommendationsContainer = document.getElementById('recommendations-container');

// Event Listeners
btnGenerate.addEventListener('click', handleGenerate);

/**
 * Helper to determine which Lotto Ball class to apply based on Korean standards
 */
function getBallClass(num) {
  if (num >= 1 && num <= 10) return 'num-1-10';
  if (num >= 11 && num <= 20) return 'num-11-20';
  if (num >= 21 && num <= 30) return 'num-21-30';
  if (num >= 31 && num <= 40) return 'num-31-40';
  return 'num-41-45';
}

/**
 * Handle Lotto Generation
 */
function handleGenerate() {
  currentData = generate5RecommendedSets();
  
  // Render the cards
  renderRecommendations();
}

/**
 * Render the 5 recommended sets cards
 */
function renderRecommendations() {
  if (!currentData) return;

  recommendationsContainer.innerHTML = '';

  currentData.forEach((item, cardIdx) => {
    const card = document.createElement('div');
    card.className = 'recommendation-card';



    // Header area of the card
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header-info';
    cardHeader.innerHTML = `
      <span class="set-title">🔮 추천 조합 #${item.id}</span>
    `;
    card.appendChild(cardHeader);

    // Balls row
    const ballsRow = document.createElement('div');
    ballsRow.className = 'balls-row';

    item.set.forEach((num, ballIdx) => {
      const ball = document.createElement('div');
      ball.className = `lotto-ball ${getBallClass(num)}`;
      ball.innerText = num;
      // Stagger animations in CSS using inline style delays
      const delay = cardIdx * 120 + ballIdx * 80;
      ball.style.animationDelay = `${delay}ms`;
      ballsRow.appendChild(ball);
    });

    card.appendChild(ballsRow);
    recommendationsContainer.appendChild(card);
  });
}
