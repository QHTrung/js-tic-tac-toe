import {
  getCellElementAtIdx,
  getCellElementList,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayButtonElement,
  getCellListElement,
} from './selectors.js';

import { TURN, CELL_VALUE, GAME_STATUS } from './constants.js';
import { checkGameStatus } from './utils.js';
/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let isGameEnded = false;
let cellValues = new Array(9).fill('');

console.log(checkGameStatus(['X', 'O', 'X', 'X', 'O', 'X', 'O', 'X', 'O']));
/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */
function toggleTurn() {
  // toggle turn logic
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;
  // update on DOM
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
    currentTurnElement.classList.add(currentTurn);
  }
}
function updateGameStatus(newGameStatus) {
  gameStatus = newGameStatus;
  const gameStatusElement = getGameStatusElement();
  if (gameStatusElement) gameStatusElement.textContent = newGameStatus;
}
function showReplayButton() {
  const replayButtonElement = getReplayButtonElement();
  if (replayButtonElement) replayButtonElement.classList.add('show');
}
function hideReplayButton() {
  const replayButtonElement = getReplayButtonElement();
  if (replayButtonElement) replayButtonElement.classList.remove('show');
}
function highlightWinCells(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) {
    throw new Error('Invalid positions!');
  }
  for (const position of winPositions) {
    const cell = getCellElementAtIdx(position);
    if (cell) cell.classList.add('win');
  }
}
function handleCellClick(cell, index) {
  const isClicked =
    cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
  if (isClicked || isEndGame) return;
  // set selected cell
  cell.classList.add(currentTurn);
  // update cellValues
  cellValues[index] =
    currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;
  // toggle turn
  toggleTurn();
  // check game status
  const game = checkGameStatus(cellValues);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      // update game status
      updateGameStatus(game.status);
      // show replay button
      showReplayButton();
      break;
    }
    case GAME_STATUS.O_WIN:
    case GAME_STATUS.X_WIN: {
      // update game status
      updateGameStatus(game.status);
      // show replay button
      showReplayButton();
      // highlight win cells
      highlightWinCells(game.winPositions);
      break;
    }
    default:
    // playing
  }
}
function resetGame() {
  // reset temp global vars
  currentTurn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map(() => '');
  // reset DOM elements
  // reset game status
  updateGameStatus(GAME_STATUS.PLAYING);
  // reset current turn
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
    currentTurnElement.classList.add(currentTurn);
  }
  // reset game board
  const cellElementList = getCellElementList();
  for (const cellElement of cellElementList) {
    cellElement.className = '';
  }
  // hide replay button
  hideReplayButton();
}
function initReplayButton() {
  const replayButtonElement = getReplayButtonElement();
  if (replayButtonElement) {
    replayButtonElement.addEventListener('click', resetGame);
  }
}
function initCellElementList() {
  // set index for each li element
  const liElement = getCellElementList();
  liElement.forEach((cell, index) => {
    cell.dataset.idx = index;
    // cell.addEventListener('click', () => handleCellClick(cell, index));
  });
  // attach event click for ul element
  const ulElement = getCellListElement();
  if (ulElement) {
    ulElement.addEventListener('click', (event) => {
      if (event.target.tagName !== 'LI') return;
      const index = Number.parseInt(event.target.dataset.idx);
      handleCellClick(event.target, index);
    });
  }
}
(() => {
  initCellElementList();
  initReplayButton();
})();
