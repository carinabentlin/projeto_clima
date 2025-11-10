/**
 * @fileoverview Módulo responsável por buscar dados climáticos utilizando a API Open-Meteo.
 * Contém uma função testável para uso em testes automatizados e outra integrada à interface (DOM).
 */

// Sempre usa o fetch disponível (navegador ou mock do Jest)
const fetchFunction = (...args) => fetch(...args);

/**
 * Busca informações climáticas atuais (temperatura, vento, etc.) para uma localização específica
 * definida por latitude e longitude, utilizando a API Open-Meteo.
 *
 * @async
 * @function buscarClimaPorCoordenadas
 *
 * @param {number} latitude - Latitude da cidade a ser consultada. Ex.: -23.55 (São Paulo).
 * @param {number} longitude - Longitude da cidade a ser consultada. Ex.: -46.63 (São Paulo).
 *
 * @returns {Promise<Object>} Um objeto contendo as informações climáticas atuais da localização.
 * @property {number} temperature - Temperatura atual em graus Celsius.
 * @property {number} windspeed - Velocidade do vento em km/h.
 * @property {string} time - Horário da leitura da API.
 *
 * @throws {Error} Se a requisição falhar (`Erro ao buscar clima`).
 * @throws {Error} Se a API não retornar informações climáticas (`Clima não disponível para esta localização`).
 *
 * @example
 * // Exemplo de uso:
 * const clima = await buscarClimaPorCoordenadas(-23.55, -46.63);
 * console.log(clima.temperature); // 22
 */
async function buscarClimaPorCoordenadas(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
  const response = await fetchFunction(url);

  if (!response.ok) {
    throw new Error("Erro ao buscar clima");
  }

  const data = await response.json();

  if (!data.current_weather) {
    throw new Error("Clima não disponível para esta localização");
  }

  return data.current_weather;
}

/**
 * Lê o nome da cidade inserido na interface, consulta sua latitude e longitude,
 * busca o clima correspondente e exibe o resultado na tela.
 *
 * Esta função é utilizada apenas no navegador, pois manipula o DOM.
 *
 * @async
 * @function buscarClima
 *
 * @returns {void} Não retorna valor; atualiza o conteúdo HTML na interface.
 */
async function buscarClima() {
  const cidade = document.getElementById("cidade").value.trim();

  if (!cidade) {
    alert("Digite o nome de uma cidade.");
    return;
  }

  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}`
  );
  const geoData = await geoResponse.json();

  if (!geoData.results?.length) {
    document.getElementById("resultado").innerHTML = `
      <div class="erro-msg">
        Cidade não encontrada. Tente novamente.
      </div>
    `;
    return;
  }

  const { latitude, longitude } = geoData.results[0];
  const clima = await buscarClimaPorCoordenadas(latitude, longitude);

  document.getElementById("resultado").innerHTML = `
    <div class="weather-card">
      <div class="temp-display">${clima.temperature}°</div>
      <p class="city-label">${cidade}, Brasil</p>
    </div>
  `;
}

// Exporta apenas a função testável (compatível com Jest)
module.exports = { buscarClimaPorCoordenadas };
