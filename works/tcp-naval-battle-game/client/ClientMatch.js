const { BoardVisualizer } = require("./BoardVisualizer");
const { question } = require("./io");

const { Message, Shot, Match } = require("../shared");
const { delay } = require("../utils");

class ClientMatch {
  static DELAY_BETWEEN_SHOTS = 2000;

  /**
   * @param {import('./Messages')} messages
   * @param {import('../shared/Match')} match
   * @param {boolean} isPlayer1 indicates if this client is the player1
   */
  constructor(messages, match, isPlayer1) {
    this.messages = messages;
    this.match = match;
    this.isPlayer1 = isPlayer1;

    if (isPlayer1) {
      this.player = match.player1;
      this.playerBoard = match.player1Board;
      this.enemyBoard = match.player2;
      this.enemyBoard = match.player2Board;
    } else {
      this.player = match.player2;
      this.playerBoard = match.player2Board;
      this.enemyBoard = match.player1;
      this.enemyBoard = match.player1Board;
    }

    /** @type {Message<import('../shared/responses').Responses['ENEMY_SHOT']>[]} */
    this.enemyShotMessages = [];

    this.enemyShotObserverId = this.messages.addObserverFor(
      Message.MsgType.ENEMY_SHOT,
      (message, messages) => {
        this.enemyShotMessages.push(message);
      }
    );

    this.printBoards = this.printBoards.bind(this);
    this.animateShot = this.animateShot.bind(this);
    this.shot = this.shot.bind(this);
    this.letPlayerShoot = this.letPlayerShoot.bind(this);
    this.waitEnemyShots = this.waitEnemyShots.bind(this);
    this.start = this.start.bind(this);
  }

  printBoards() {
    console.clear();
    console.log(
      BoardVisualizer.printPlayerAndEnemy(
        "You",
        this.playerBoard,
        "Enemy",
        this.enemyBoard
      )
    );
  }

  /**
   * @param {Shot} shot
   * @param {import('../shared/Board')} board
   */
  async animateShot(shot, board) {
    for (let i = 0; i < 5; i++) {
      board.shots.push(shot);
      this.printBoards();

      await delay(400);

      board.shots.pop();
      this.printBoards();

      await delay(400);
    }

    board.shots.push(shot);
    this.printBoards();
  }

  /**
   * @param {string} shotCoords
   * @param {string} shooterId
   * @param {string} boardId
   */
  async shot(shotCoords, shooterId, boardId) {
    const shotLine = BoardVisualizer.LINES_LETTERS.findIndex(
      letter => letter === shotCoords[0]
    );
    const shotColumn = BoardVisualizer.COLUMNS_NUMBERS.findIndex(
      number => number === shotCoords[1]
    );

    const shot = new Shot(shotLine, shotColumn, shooterId, boardId);

    this.match.boardsById[boardId].shots.push(shot);

    return (
      await this.messages.sendMessage(null, Message.MsgType.SHOT, {
        matchId: this.match.id,
        shot,
      })
    ).data;
  }

  async letPlayerShoot() {
    this.printBoards();

    let shotCoords = (await question("Where do you wanna shoot (ex.: A5) ? "))
      .replace(/\s/g, "")
      .toUpperCase();

    while (
      !BoardVisualizer.LINES_LETTERS.find(letter => letter === shotCoords[0]) ||
      !BoardVisualizer.COLUMNS_NUMBERS.find(number => number === shotCoords[1])
    )
      shotCoords = (await question("Where do you wanna shoot (ex.: A5) ? "))
        .replace(/\s/g, "")
        .toUpperCase();

    const response = await this.shot(
      shotCoords,
      this.player.id,
      this.enemyBoard.id
    );

    if (response.gameOver) {
      this.match.status = Match.Status.FINISHED;
      console.log("Congratulations! You won the match!");
    } else if (response.hit) {
      console.log("Congratulations! You hit an enemy unit!");
      await delay(ClientMatch.DELAY_BETWEEN_SHOTS);
      await this.letPlayerShoot();
    }
  }

  async waitEnemyShots() {
    this.printBoards();

    let enemyShotResponse;

    do {
      console.log("Waiting enemy shots...");
      while (this.enemyShotMessages.length === 0) await delay(500);

      enemyShotResponse = this.enemyShotMessages.shift().data;

      await this.animateShot(enemyShotResponse.shot, this.playerBoard);
    } while (!enemyShotResponse.gameOver && enemyShotResponse.hit);

    if (enemyShotResponse.gameOver) {
      this.match.status = Match.Status.FINISHED;
      console.log("What a pity, you lost the match!");
    }
  }

  async start() {
    if (this.isPlayer1)
      await this.messages.sendMessage(null, Message.MsgType.START_MATCH, {
        matchId: this.match.id,
      });

    this.match.status = Match.Status.STARTED;

    if (this.isPlayer1) await this.letPlayerShoot();
    else await this.waitEnemyShots();

    // @ts-ignore
    while (this.match.status !== Match.Status.FINISHED) {
      if (this.isPlayer1) await this.waitEnemyShots();
      else await this.letPlayerShoot();

      // @ts-ignore
      if (this.match.status === Match.Status.FINISHED) break;

      if (this.isPlayer1) await this.letPlayerShoot();
      else await this.waitEnemyShots();
    }

    this.messages.removeObserver(this.enemyShotObserverId);
  }
}

module.exports = ClientMatch;
