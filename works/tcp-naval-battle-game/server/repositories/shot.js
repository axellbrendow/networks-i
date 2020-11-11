const { getData, setData } = require("./global");

/**
 * @param {string} matchId
 * @param {import('../../shared/Shot')} shot
 */
module.exports.shoot = (matchId, shot) => {
  const data = getData();

  const board = data.boards[shot.boardId];
  data.matches[matchId].boardsByPlayerId[board.playerId].shots.push(shot);
  board.shots.push(shot);

  setData(data);
};
