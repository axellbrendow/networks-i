const { BoardVisualizer } = require("./BoardVisualizer");
const { question } = require("./io");

const { Board } = require("../shared");

const getInitialBoard = async () => {
  let board, option;

  do {
    console.clear();
    board = Board.random();
    BoardVisualizer.print(board);
    console.log();
    option = await question("Deseja utilizar esse tabuleiro (s-n) ? ");
    option = option.toLowerCase();
  } while (option !== "s");

  return board;
};

module.exports.getInitialBoard = getInitialBoard;
