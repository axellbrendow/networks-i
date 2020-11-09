class Point {
  /**
   * @param {number} line
   * @param {number} column
   */
  constructor(line, column) {
    this.line = line;
    this.column = column;

    this.equals = this.equals.bind(this);
  }

  /**
   * @param {Point} point
   */
  equals(point) {
    return this.line == point.line && this.column == point.column;
  }
}

module.exports = Point;
