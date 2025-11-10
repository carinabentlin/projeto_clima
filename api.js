// Sempre usa fetch do ambiente (navegador ou mock do Jest)
const fetchFunction = (...args) => fetch(...args);

// Função testável (sem DOM)
async function buscarClimaPorCoordenadas(latitude, longitude) {
  const response = await fetchFunction(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar clima");
  }

  const data = await response.json();

  if (!data.current_weather) {
    throw new Error("Clima não disponível para esta localização");
  }

  return data.current_weather;
}

// Função usada no navegador
async function buscarClima() {
  const cidade = document.getElementById("cidade").value;

  if (!cidade) {
    alert("Digite o nome de uma cidade.");
    return;
  }

  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}`
  );
  const geoData = await geoResponse.json();

  if (!geoData.results || geoData.results.length === 0) {
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

// Export para Jest
module.exports = { buscarClimaPorCoordenadas };
