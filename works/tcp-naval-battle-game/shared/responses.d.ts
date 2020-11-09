import Board from "./Board";
import Match from "./Match";
import Shot from "./Shot";

export interface Responses {
  CREATE_MATCH: Match;

  START_MATCH: null;

  SET_BOARD: Board;

  SHOT: {
    hit: boolean;
    gameOver: boolean;
  };

  SERVER_SHOT: {
    hit: boolean;
    gameOver: boolean;
    shot: Shot;
  };
}
