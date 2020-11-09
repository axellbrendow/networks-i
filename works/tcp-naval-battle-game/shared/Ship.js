const Point = require("./Point");

/**
 * @typedef {"AIRCRAFT_CARRIER" | "TANKER" | "DESTROYER" | "SUBMARINE"} ShipType
 * @typedef {5 | 4 | 3 | 2} ShipSize
 */

/**
@typedef {{
  AIRCRAFT_CARRIER: 5,
  TANKER: 4,
  DESTROYER: 3,
  SUBMARINE: 2,
}} ShipSizeMap
*/

class Ship {
  /**
   * @type {{ [shipType in ShipType]: shipType }}
   */
  static Type = {
    AIRCRAFT_CARRIER: "AIRCRAFT_CARRIER",
    TANKER: "TANKER",
    DESTROYER: "DESTROYER",
    SUBMARINE: "SUBMARINE",
  };

  /**
   * @type {{ [shipType in ShipType]: ShipSizeMap[shipType] }}
   */
  static Size = {
    AIRCRAFT_CARRIER: 5,
    TANKER: 4,
    DESTROYER: 3,
    SUBMARINE: 2,
  };

  /**
   * @param {ShipType} type
   * @param {number} line0
   * @param {number} column0
   * @param {number} line1
   * @param {number} column1
   */
  constructor(type, line0, column0, line1, column1) {
    this.type = type;
    this.letter = type[0];
    this.line0 = line0;
    this.column0 = column0;
    this.line1 = line1;
    this.column1 = column1;

    if (line0 < line1 || column0 < column1) {
      this.startLine = line0;
      this.startColumn = column0;
      this.endLine = line1;
      this.endColumn = column1;
    } else {
      this.startLine = line1;
      this.startColumn = column1;
      this.endLine = line0;
      this.endColumn = column0;
    }

    /** @type {Point[]} */
    this.points = [];

    for (let i = this.startLine; i <= this.endLine; i++) {
      for (let j = this.startColumn; j <= this.endColumn; j++) {
        this.points.push(new Point(i, j));
      }
    }

    this.collidesWith = this.collidesWith.bind(this);
  }

  /**
   * @param {ShipType} shipType
   */
  static getShipSize(shipType) {
    return this.Size[shipType];
  }

  /**
   * @param {Ship} ship
   */
  collidesWith(ship) {
    return this.points.some(mypoint =>
      ship.points.some(shipPoint => shipPoint.equals(mypoint))
    );
  }
}

module.exports = Ship;
