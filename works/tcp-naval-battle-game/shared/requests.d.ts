import Board from "./Board";
import Shot from "./Shot";

export interface Requests {
  CREATE_MATCH: {
    player2IsABot: boolean;
  };

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

  ENEMY_SHOT: null; // Client cannot pass a message with this type

  JOIN_MATCH: {
    matchId: string;
  };

  PLAYER2_DEFINED_BOARD: null; // Client cannot pass a message with this type
}
