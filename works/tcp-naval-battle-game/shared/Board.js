const Ship = require("./Ship");
const { getRandomInt } = require("./math");

class Board {
  static BOARD_SIZE = 10;
  static NUM_AIRCRAFT_CARRIERS = 1;
  static NUM_TANKERS = 2;
  static NUM_DESTROYERS = 3;
  static NUM_SUBMARINES = 4;

  /**
   * @param {string} id
   * @param {string} matchId
   * @param {string} playerId
   * @param {Ship[]} ships
   * @param {import('./Shot')[]} shots
   */
  constructor(
    id = null,
    matchId = null,
    playerId = null,
    ships = [],
    shots = []
  ) {
    this.id = id;
    this.matchId = matchId;
    this.playerId = playerId;
    this.ships = ships;
    this.shots = shots;

    this.placeShip = this.placeShip.bind(this);
  }

  /**
   * @param {Ship} ship
   */
  placeShip(ship) {
    const collides = this.ships.some(boardShip => boardShip.collidesWith(ship));

    if (!collides) this.ships.push(ship);

    return !collides;
  }

  /**
   * @param {import('./Ship').ShipType} shipType
   */
  static randomShip(shipType) {
    const shipSize = Ship.getShipSize(shipType);
    const maxline = this.BOARD_SIZE - shipSize;
    const line0 = getRandomInt(0, maxline);
    const column0 = getRandomInt(0, maxline);
    let line1, column1;

    // Points will be in the same line
    if (getRandomInt(0, 1) == 0) {
      line1 = line0;
      column1 = column0 + shipSize - 1;
    } else {
      line1 = line0 + shipSize - 1;
      column1 = column0;
    }

    return new Ship(shipType, line0, column0, line1, column1);
  }

  static random() {
    const randomBoard = new Board();

    for (let i = 0; i < this.NUM_AIRCRAFT_CARRIERS; i++)
      while (
        !randomBoard.placeShip(this.randomShip(Ship.Type.AIRCRAFT_CARRIER))
      );

    for (let i = 0; i < this.NUM_TANKERS; i++)
      while (!randomBoard.placeShip(this.randomShip(Ship.Type.TANKER)));

    for (let i = 0; i < this.NUM_DESTROYERS; i++)
      while (!randomBoard.placeShip(this.randomShip(Ship.Type.DESTROYER)));

    for (let i = 0; i < this.NUM_SUBMARINES; i++)
      while (!randomBoard.placeShip(this.randomShip(Ship.Type.SUBMARINE)));

    return randomBoard;
  }
}

module.exports = Board;
