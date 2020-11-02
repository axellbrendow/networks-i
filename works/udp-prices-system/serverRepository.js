const fs = require("fs");

const { getDistanceFromLatLonInKm } = require("./serverMath");
const { createNewId } = require("./utils");

/**
 * @typedef {{ id: number | undefined, fuelType: number, price: number, latitude: number, longitude: number }} Price
 */

class Repository {
  filename = "dados.json";

  getDados() {
    return JSON.parse(
      fs.existsSync(this.filename)
        ? fs.readFileSync(this.filename) || '{ "prices": {} }'
        : '{ "prices": {} }'
    );
  }

  constructor() {
    /**
     * @type {{ prices: { [priceId: string]: Price } }}
     */
    this.dados = this.getDados();
  }

  /**
   * @param {Price} price
   */
  addPrice(price) {
    price.id = createNewId();
    this.dados.prices[price.id] = price;
    fs.writeFileSync(this.filename, JSON.stringify(this.dados, null, 2));
    return price;
  }

  /**
   * @param {{ fuelType: number, radius: number, latitude: number, longitude: number }} searchParams
   *
   * @returns {Price}
   */
  searchPrice(searchParams) {
    return Object.keys(this.dados.prices)
      .filter(
        priceId =>
          this.dados.prices[priceId].fuelType === searchParams.fuelType &&
          getDistanceFromLatLonInKm(
            searchParams.latitude,
            searchParams.longitude,
            this.dados.prices[priceId].latitude,
            this.dados.prices[priceId].longitude
          ) <= searchParams.radius
      )
      .reduce(
        (lowestPrice, priceId) =>
          this.dados.prices[priceId].price < lowestPrice.price
            ? this.dados.prices[priceId]
            : lowestPrice,
        { price: Number.MAX_SAFE_INTEGER }
      );
  }
}

module.exports.Repository = Repository;
