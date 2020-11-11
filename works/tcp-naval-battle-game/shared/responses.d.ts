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

  ENEMY_SHOT: {
    hit: boolean;
    gameOver: boolean;
    shot: Shot;
  };

  JOIN_MATCH:
    | {
        success: false;
        error: string;
      }
    | {
        success: true;
        match: Match;
      };

  PLAYER2_DEFINED_BOARD: Match;
}
