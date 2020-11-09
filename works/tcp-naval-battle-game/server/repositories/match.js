const { getData, createUniqueIdFor, setData } = require("./global");

const { Match, Board, Player } = require("../../shared");

module.exports.create = () => {
  const data = getData();

  const player1 = new Player(createUniqueIdFor("players", data));
  const player2 = new Player(Player.SERVER_PLAYER_ID);

  const matchId = createUniqueIdFor("matches", data);

  const player2Board = Board.random();
  const player2BoardId = createUniqueIdFor("boards", data);
  player2Board.id = player2BoardId;
  player2Board.matchId = matchId;
  player2Board.playerId = player2.id;

  const match = new Match(
    matchId,
    player1,
    player2,
    null,
    player2Board,
    Match.Status.CREATED
  );

  data.players[player1.id] = player1;
  data.players[player2.id] = player2;
  data.boards[player2Board.id] = player2Board;
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
