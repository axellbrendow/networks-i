const { getData, createUniqueIdFor, setData } = require("./global");

const { Match, Player } = require("../../shared");

/**
 * @param {Player} player1
 * @param {string} player1SocketName
 * @param {boolean} player2IsABot
 */
module.exports.create = (player1, player1SocketName, player2IsABot) => {
  const data = getData();

  const matchId = createUniqueIdFor("matches", data);

  const match = new Match(
    matchId,
    player1,
    null,
    player1SocketName,
    null,
    null,
    null,
    player2IsABot,
    Match.Status.CREATED
  );

  data.matches[match.id] = match;

  setData(data);

  return match;
};

/**
 * @param {string} matchId
 * @param {import("../../shared/Match").MatchStatus} newStatus
 */
const updateStatus = (matchId, newStatus) => {
  const data = getData();

  data.matches[matchId].status = newStatus;

  setData(data);
};

module.exports.updateStatus = updateStatus;

/**
 * @param {string} matchId
 */
module.exports.start = matchId => updateStatus(matchId, Match.Status.CREATED);

/**
 * @param {string} matchId
 */
module.exports.get = matchId => {
  const data = getData();

  return data.matches[matchId];
};

/**
 * @param {import('../../shared/Match')} match
 */
module.exports.save = match => {
  const data = getData();

  data.matches[match.id] = match;

  setData(data);
};

/**
 * @param {import('../../shared/Board')} board
 * @param {string} matchId
 * @param {string} playerId
 */
module.exports.setBoard = (board, matchId, playerId) => {
  const data = getData();

  const match = data.matches[matchId];

  match.boardsByPlayerId[playerId] = board;

  if (playerId === match.player1.id) match.player1Board = board;
  else match.player2Board = board;

  setData(data);
};
