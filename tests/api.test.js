const { buscarClimaPorCoordenadas } = require("../api.js");

test("Retorna dados de clima contendo 'temperature'", async () => {
  const clima = await buscarClimaPorCoordenadas(-23.55, -46.63); // São Paulo
  expect(clima).toHaveProperty("temperature");
});

test("Retorna erro quando coordenadas são inválidas", async () => {
  await expect(buscarClimaPorCoordenadas(9999, 9999)).rejects.toThrow();
});
