const path = require("path");
const fs = require("fs");

const { createNewId } = require("../../utils");

const FILE_NAME = path.join(__dirname, "dados.json");

/**
 * @typedef {Object} GlobalData
 * @property {{ [playerId: string]: import('../../shared/Player') }} players
 * @property {{ [boardId: string]: import('../../shared/Board') }} boards
 * @property {{ [matchId: string]: import('../../shared/Match') }} matches
 */

/**
 * @returns {GlobalData}
 */
module.exports.getData = () =>
  JSON.parse(
    fs.existsSync(FILE_NAME)
      ? fs.readFileSync(FILE_NAME).toString()
      : '{ "players": {}, "matches": {}, "boards": {} }'
  );

/**
 * @param {GlobalData} data
 */
module.exports.setData = data =>
  fs.writeFileSync(FILE_NAME, JSON.stringify(data, null, 2));

/**
 * @typedef {"players" | "matches" | "boards"} EntitiesName
 *
 * @param {EntitiesName} entity
 * @param {import("./global").GlobalData} data
 */
module.exports.createUniqueIdFor = (entity, data) => {
  let id = createNewId();
  while (data[entity][id]) id = createNewId();
  return id;
};
