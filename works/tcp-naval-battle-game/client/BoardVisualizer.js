const { Board } = require("../shared");

class BoardVisualizer {
  static WATER = " ";
  static SHOT = "X";

  static COLUMNS_NUMBERS = "0123456789".match(/./g);
  static LINES_LETTERS = "ABCDEFGHIJ".match(/./g);

  /** @returns {string[][]} */
  static getNewVisualBoard(boardSize = Board.BOARD_SIZE) {
    const visualBoard = new Array(boardSize);

    for (let i = 0; i < visualBoard.length; i++)
      visualBoard[i] = new Array(boardSize).fill(this.WATER);

    return visualBoard;
  }

  /**
   * @param {string[][]} visualBoard
   */
  static printVisualBoard(visualBoard) {
    console.log("   " + this.COLUMNS_NUMBERS.join(" "));
    console.log();

    visualBoard.forEach((line, index) => {
      let lineStr = BoardVisualizer.LINES_LETTERS[index] + "  ";
      line.forEach(elem => (lineStr += elem + " "));
      console.log(lineStr);
    });
  }

  /**
   * @param {Board} board
   */
  static print(board) {
    const visualBoard = this.getNewVisualBoard();

    board.ships.forEach(ship =>
      ship.points.forEach(
        point => (visualBoard[point.line][point.column] = ship.letter)
      )
    );

    board.shots.forEach(
      shot => (visualBoard[shot.line][shot.column] = this.SHOT)
    );

    this.printVisualBoard(visualBoard);
  }

  /**
   * @param {string} str
   * @param {number} length
   * @param {string} fillChar
   */
  static centerJustify(str, length, fillChar = " ") {
    let i = 0;
    let toggle = true;

    while (i + this.length < length) {
      if (toggle) str = str + fillChar;
      else str = fillChar + str;
      toggle = !toggle;
      i++;
    }

    return str;
  }

  /**
   * @param {string} playerBoardTitle
   * @param {string[][]} playerVisualBoard
   * @param {string} enemyBoardTitle
   * @param {string[][]} enemyVisualBoard
   */
  static printVisualBoards(
    playerBoardTitle,
    playerVisualBoard,
    enemyBoardTitle,
    enemyVisualBoard
  ) {
    const numbersHeader = "   0 1 2 3 4 5 6 7 8 9";

    const playerTitleHeader = this.centerJustify(
      playerBoardTitle,
      numbersHeader.length
    );
    const enemyTitleHeader = this.centerJustify(
      enemyBoardTitle,
      numbersHeader.length
    );

    console.log(`${playerTitleHeader}${enemyTitleHeader}`);
    console.log(`${numbersHeader}   ${numbersHeader}`);
    console.log();

    const letters = "ABCDEFGHIJ";

    for (let i = 0; i < playerVisualBoard.length; i++) {
      let playerLine = letters[i] + "  ";
      let enemyLine = letters[i] + "  ";

      playerVisualBoard[i].forEach(elem => (playerLine += elem + " "));
      enemyVisualBoard[i].forEach(elem => (enemyLine += elem + " "));

      console.log(`${playerLine}  ${enemyLine}`);
    }
  }

  /**
   * @param {string} playerBoardTitle
   * @param {Board} playerBoard
   * @param {string} enemyBoardTitle
   * @param {Board} enemyBoard
   */
  static printPlayerAndEnemy(
    playerBoardTitle,
    playerBoard,
    enemyBoardTitle,
    enemyBoard
  ) {
    const boards = [playerBoard, enemyBoard];
    const playerVisualBoard = this.getNewVisualBoard();
    const enemyVisualBoard = this.getNewVisualBoard();
    const visualBoards = [playerVisualBoard, enemyVisualBoard];

    playerBoard.ships.forEach(ship =>
      ship.points.forEach(
        point => (playerVisualBoard[point.line][point.column] = ship.letter)
      )
    );

    boards.forEach((board, index) =>
      board.shots.forEach(
        shot => (visualBoards[index][shot.line][shot.column] = this.SHOT)
      )
    );

    this.printVisualBoards(
      playerBoardTitle,
      playerVisualBoard,
      enemyBoardTitle,
      enemyVisualBoard
    );
  }
}

module.exports.BoardVisualizer = BoardVisualizer;
