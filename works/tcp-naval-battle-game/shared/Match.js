/**
 * @typedef {"CREATED" | "STARTED" | "FINISHED"} MatchStatus
 */

class Match {
  /** @type {{ [status in MatchStatus]: status }} */
  static Status = {
    CREATED: "CREATED",
    STARTED: "STARTED",
    FINISHED: "FINISHED",
  };

  /**
   * @param {string} id
   * @param {import('./Player')} player1
   * @param {import('./Player')} player2
   * @param {import('./Board')} player1Board
   * @param {import('./Board')} player2Board
   * @param {MatchStatus} status
   */
  constructor(id, player1, player2, player1Board, player2Board, status) {
    this.id = id;
    this.player1 = player1;
    this.player2 = player2;
    this.player1Board = player1Board;
    this.player2Board = player2Board;

    /** @type {{ [playerId: string]: import('../shared/Board') }} */
    this.boardsByPlayerId = {};
    if (player1) this.boardsByPlayerId[player1.id] = player1Board;
    if (player2) this.boardsByPlayerId[player2.id] = player2Board;

    /** @type {{ [boardId: string]: import('../shared/Board') }} */
    this.boardsById = {};
    if (player1Board) this.boardsById[player1Board.id] = player1Board;
    if (player2Board) this.boardsById[player2Board.id] = player2Board;

    this.status = status;

    this.toJSON = () => ({
      id,
      player1,
      player2,
      player1Board,
      player2Board,
      boardsByPlayerId: this.boardsByPlayerId,
      status,
    });
  }
}

module.exports = Match;
