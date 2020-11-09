const repositories = require("../repositories");

const { Message, Shot, Player, Board, Match } = require("../../shared");

/**
 * @param {import('../../shared/Shot')} shot
 * @param {import('../../shared/Board')} board
 */
const hitShip = (shot, board) =>
  board.ships.find(
    ship =>
      ship.points.find(
        point => point.line === shot.line && point.column === shot.column
      ) &&
      !board.shots.find(
        firedShot =>
          firedShot.line === shot.line && firedShot.column === shot.column
      )
  );

/**
 * @param {import('../../shared/Board')} board
 */
const anyShipRemaining = board => {
  for (const ship of board.ships) {
    for (const point of ship.points) {
      if (
        !board.shots.find(
          shot => shot.line === point.line && shot.column === point.column
        )
      )
        return true;
    }
  }

  return false;
};

/**
 * @param {import('../../shared/Shot')} shot
 * @param {import('../../shared/Board')} board
 */
const isInvalidShot = (shot, board) =>
  shot.line < 0 ||
  shot.line >= Board.BOARD_SIZE ||
  shot.column < 0 ||
  shot.column >= Board.BOARD_SIZE ||
  board.shots.find(
    boardShot =>
      boardShot.line === shot.line && boardShot.column === shot.column
  );

/**
 * @param {string} shooterId
 * @param {import('../../shared/Board')} board
 */
const getValidShot = (shooterId, board) => {
  let shot = Shot.random(shooterId, board.id);

  while (isInvalidShot(shot, board)) shot = Shot.random(shooterId, board.id);

  return shot;
};

/**
 * @param {import('../../shared/Shot')} lastShot
 * @param {import('../../shared/Board')} board
 */
const getValidShotAfterHit = (lastShot, board) => {
  const possibleOffsets = [
    [-1, -0],
    [-0, +1],
    [+1, -0],
    [-0, -1],
  ];

  let shot = new Shot(
    lastShot.line + possibleOffsets[0][0],
    lastShot.column + possibleOffsets[0][1],
    lastShot.shooterId,
    board.id
  );

  for (let i = 1; isInvalidShot(shot, board) && i < possibleOffsets.length; i++)
    shot = new Shot(
      lastShot.line + possibleOffsets[i][0],
      lastShot.column + possibleOffsets[i][1],
      lastShot.shooterId,
      board.id
    );

  if (isInvalidShot(shot, board)) {
    shot = Shot.random(lastShot.shooterId, board.id);
    while (isInvalidShot(shot, board))
      shot = Shot.random(lastShot.shooterId, board.id);
  }

  return shot;
};

/**
 * @param {import('../Messages')} messages
 * @param {string} socketName
 * @param {string} matchId
 * @param {string} serverEnemyId
 */
const doServerShots = async (messages, socketName, matchId, serverEnemyId) => {
  const match = repositories.match.get(matchId);
  const serverEnemyBoard = match.boardsByPlayerId[serverEnemyId];

  let serverShot = getValidShot(Player.SERVER_PLAYER_ID, serverEnemyBoard);
  let gameOver = !anyShipRemaining(serverEnemyBoard);

  while (!gameOver && hitShip(serverShot, serverEnemyBoard)) {
    repositories.shot.shot(matchId, serverShot);
    serverEnemyBoard.shots.push(serverShot);

    gameOver = !anyShipRemaining(serverEnemyBoard);

    messages.sendMessage(null, socketName, Message.MsgType.SERVER_SHOT, {
      hit: true,
      gameOver,
      shot: serverShot,
    });

    serverShot = getValidShotAfterHit(serverShot, serverEnemyBoard);
  }

  if (gameOver) repositories.match.updateStatus(matchId, Match.Status.FINISHED);
  else
    messages.sendMessage(null, socketName, Message.MsgType.SERVER_SHOT, {
      hit: false,
      gameOver: false,
      shot: serverShot,
    });
};

/**
@type {import("../Observers").Observer<
  import('../../shared/requests').Requests['SHOT']
>}
*/
module.exports = (message, messages, socketName) => {
  if (message.type === Message.MsgType.SHOT) {
    const shot = message.data.shot;
    const board = repositories.board.get(shot.boardId);
    const hit = !!hitShip(shot, board);

    repositories.shot.shot(message.data.matchId, shot);
    board.shots.push(shot);

    const gameOver = !anyShipRemaining(board);

    messages.sendMessage(message.id, socketName, message.type, {
      hit,
      gameOver,
    });

    if (gameOver)
      repositories.match.updateStatus(
        message.data.matchId,
        Match.Status.FINISHED
      );
    else if (!hit)
      doServerShots(messages, socketName, message.data.matchId, shot.shooterId);
  }
};
