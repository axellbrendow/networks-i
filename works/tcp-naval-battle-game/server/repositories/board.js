const { getData, setData, createUniqueIdFor } = require("./global");

const { Board } = require("../../shared");

/**
 * @param {import('../../shared/Board')} board
 * @param {string} matchId
 * @param {string} playerId
 */
const set = (board, matchId, playerId) => {
  const data = getData();

  const boardId = createUniqueIdFor("boards", data);
  board.id = boardId;
  board.matchId = matchId;
  board.playerId = playerId;

  data.boards[boardId] = board;

  data.matches[matchId].boardsByPlayerId[playerId] = board;

  setData(data);

  return board;
};

module.exports.set = set;

/**
 * @param {string} matchId
 * @param {string} playerId
 */
module.exports.random = (matchId, playerId) => {
  return set(Board.random(), matchId, playerId);
};

/**
 * @param {string} boardId
 */
module.exports.get = boardId => {
  const data = getData();

  return data.boards[boardId];
};
