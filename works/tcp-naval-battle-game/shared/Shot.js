const Board = require("./Board");
const { getRandomInt } = require("../utils/math");

class Shot {
  /**
   * @param {number} line
   * @param {number} column
   * @param {string} shooterId
   * @param {string} boardId
   */
  constructor(line, column, shooterId, boardId) {
    this.line = line;
    this.column = column;
    this.shooterId = shooterId;
    this.boardId = boardId;

    this.equals = this.equals.bind(this);
  }

  /**
   * @param {string} shooterId
   * @param {string} boardId
   */
  static random(shooterId, boardId) {
    const line = getRandomInt(0, Board.BOARD_SIZE - 1);
    const column = getRandomInt(0, Board.BOARD_SIZE - 1);
    const shot = new Shot(line, column, shooterId, boardId);
    return shot;
  }

  /**
   * @param {Shot} shot
   */
  equals(shot) {
    return this.line === shot.line && this.column === shot.column;
  }
}

module.exports = Shot;
