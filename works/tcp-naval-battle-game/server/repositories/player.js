const { getData, setData, createUniqueIdFor } = require("./global");

const { Player } = require("../../shared");

/**
 * @param {string} id
 */
module.exports.create = (id = null) => {
  const data = getData();

  const player = new Player(id || createUniqueIdFor("players", data));

  data.players[player.id] = player;

  setData(data);

  return player;
};
