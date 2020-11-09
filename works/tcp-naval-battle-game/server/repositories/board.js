const { getData, setData, createUniqueIdFor } = require("./global");

/**
 * @param {import('../../shared/Board')} board
 * @param {string} matchId
 * @param {string} playerId
 */
module.exports.set = (board, matchId, playerId) => {
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

/**
 * @param {string} boardId
 */
module.exports.get = boardId => {
  const data = getData();

  return data.boards[boardId];
};
