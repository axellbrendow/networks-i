const { question } = require("./io");

const readFuelType = async () => {
  let fuelType = parseInt(
    await question(
      "Qual é o tipo de combustível (0 - diesel, 1 - álcool, 2 - gasolina) ? "
    )
  );

  while (
    isNaN(fuelType) ||
    (fuelType !== 0 && fuelType !== 1 && fuelType !== 2)
  )
    fuelType = parseInt(
      await question(
        "Qual é o tipo de combustível (0 - diesel, 1 - álcool, 2 - gasolina) ? "
      )
    );

  return fuelType;
};

module.exports.readFuelType = readFuelType;

const readPrice = async () => {
  let price = parseInt(
    await question("Informe o preço * 1000 (ex: R$3,299 fica 3299): ")
  );

  while (isNaN(price) || price < 0)
    price = parseInt(
      await question("Informe o preço * 1000 (ex: R$3,299 fica 3299): ")
    );

  return price;
};

module.exports.readPrice = readPrice;

const readLatitude = async () => {
  let latitude = parseFloat(await question("Informe a latitude [-90, 90]: "));

  while (isNaN(latitude) || latitude < -90 || latitude > 90)
    latitude = parseFloat(await question("Informe a latitude [-90, 90]: "));

  return latitude;
};

module.exports.readLatitude = readLatitude;

const readLongitude = async () => {
  let longitude = parseFloat(
    await question("Informe a longitude [-180, 180]: ")
  );

  while (isNaN(longitude) || longitude < -180 || longitude > 180)
    longitude = parseFloat(await question("Informe a longitude [-180, 180]: "));

  return longitude;
};

module.exports.readLongitude = readLongitude;

const readRadius = async () => {
  let radius = parseFloat(await question("Informe o raio de busca: "));

  while (isNaN(radius) || radius <= 0)
    radius = parseFloat(await question("Informe o raio de busca: "));

  return radius;
};

module.exports.readRadius = readRadius;

module.exports.readPriceForInsertion = async () => {
  const fuelType = await readFuelType();
  const price = await readPrice();
  const latitude = await readLatitude();
  const longitude = await readLongitude();
  return { fuelType, price, latitude, longitude };
};

module.exports.readPriceForSearch = async () => {
  const fuelType = await readFuelType();
  const radius = await readRadius();
  console.log("Informe as coordenadas do centro de busca:");
  const latitude = await readLatitude();
  const longitude = await readLongitude();
  return { fuelType, radius, latitude, longitude };
};
