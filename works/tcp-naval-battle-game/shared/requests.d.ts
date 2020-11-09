import Board from "./Board";
import Shot from "./Shot";

export interface Requests {
  CREATE_MATCH: null;

  START_MATCH: {
    matchId: string;
  };

  SET_BOARD: {
    board: Board;
    matchId: string;
    playerId: string;
  };

  SHOT: {
    matchId: string;
    shot: Shot;
  };

  SERVER_SHOT: null; // Client cannot pass a message with this type
}
