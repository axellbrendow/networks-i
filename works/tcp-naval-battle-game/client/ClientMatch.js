const { BoardVisualizer } = require("./BoardVisualizer");
const { question } = require("./io");

const { Message, Shot, Match } = require("../shared");
const { delay } = require("../utils");

class ClientMatch {
  static DELAY_BETWEEN_SHOTS = 2000;

  /**
   * @param {import('./Messages')} messages
   * @param {import('../shared/Match')} match
   */
  constructor(messages, match) {
    this.messages = messages;
    this.match = match;
    /** @type {Message<import('../shared/responses').Responses['SERVER_SHOT']>[]} */
    this.serverShotMessages = [];

    this.messages.addObserverFor(
      Message.MsgType.SERVER_SHOT,
      (message, messages) => {
        this.serverShotMessages.push(message);
      }
    );

    this.start = this.start.bind(this);
    this.shot = this.shot.bind(this);
    this.printBoards = this.printBoards.bind(this);
    this.player1Turn = this.player1Turn.bind(this);
    this.player2Turn = this.player2Turn.bind(this);
  }

  async start() {
    await this.messages.sendMessage(null, Message.MsgType.START_MATCH, {
      matchId: this.match.id,
    });

    this.match.status = Match.Status.STARTED;

    await this.player1Turn();

    // @ts-ignore
    while (this.match.status !== Match.Status.FINISHED) {
      await this.player2Turn();

      // @ts-ignore
      if (this.match.status === Match.Status.FINISHED) break;

      await this.player1Turn();
    }
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

  printBoards() {
    console.clear();
    console.log(
      BoardVisualizer.printPlayerAndEnemy(
        "You",
        this.match.player1Board,
        "Enemy",
        this.match.player2Board
      )
    );
  }

  async player1Turn() {
    this.printBoards();

    let shotCoords = (await question("Onde deseja atirar (ex.: A5) ? "))
      .replace(/\s/g, "")
      .toUpperCase();

    while (
      !BoardVisualizer.LINES_LETTERS.find(letter => letter === shotCoords[0]) ||
      !BoardVisualizer.COLUMNS_NUMBERS.find(number => number === shotCoords[1])
    )
      shotCoords = (await question("Onde deseja atirar (ex.: A5) ? "))
        .replace(/\s/g, "")
        .toUpperCase();

    const response = await this.shot(
      shotCoords,
      this.match.player1.id,
      this.match.player2Board.id
    );

    if (response.gameOver) {
      this.match.status = Match.Status.FINISHED;
      console.log("Parabéns! Você ganhou a partida!");
    } else if (response.hit) {
      console.log("Parabéns! Você acertou uma unidade inimiga!");
      await delay(ClientMatch.DELAY_BETWEEN_SHOTS);
      await this.player1Turn();
    }
  }

  async player2Turn() {
    this.printBoards();

    while (this.serverShotMessages.length === 0) await delay(500);

    do {
      const serverShotResponse = this.serverShotMessages.shift().data;

      await this.animateShot(serverShotResponse.shot, this.match.player1Board);

      if (serverShotResponse.gameOver) {
        this.serverShotMessages = [];
        this.match.status = Match.Status.FINISHED;
        console.log("Que pena, você perdeu a partida!");
      }
    } while (this.serverShotMessages.length !== 0);
  }
}

module.exports = ClientMatch;
