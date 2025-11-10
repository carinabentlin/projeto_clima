# 🌦️ Previsão do Tempo — Aplicativo Web

Aplicativo simples e intuitivo para consulta de **previsão do tempo em tempo real**, desenvolvido com **HTML, CSS e JavaScript puro**, com o apoio de **ferramentas de Inteligência Artificial** para acelerar o desenvolvimento Back-end e Front-end.

Este projeto demonstra como a IA pode **simplificar o desenvolvimento**, mantendo **boa estrutura, clareza e boas práticas**.

---

## ✨ Funcionalidades

- Busca de cidade via **API de Geocodificação do Open-Meteo**
- Consulta de clima atual com:
  - Temperatura (°C)
  - Ícone e descrição da condição climática
  - Nome da cidade formatado
  - Data completa da consulta
- **Tema automático Dia / Noite**
- Tratamento de erros:
  - Cidade inválida
  - Falha de rede
  - Dados climáticos indisponíveis

---

## 🖥️ Interface

### Modo Claro
_(adicione o print aqui depois)_

### Modo Noturno
_(adicione o print aqui depois)_

---

## 🧠 Tecnologias e Ferramentas

| Tecnologia | Uso |
|-----------|-----|
| JavaScript ES6+ | Lógica e requisições |
| HTML5 / CSS3 | Interface e layout responsivo |
| **Open-Meteo Geocoding API** | Conversão Cidade → Coordenadas |
| **Open-Meteo Weather API** | Dados climáticos |
| Jest (Node) | Testes automatizados |
| Git + GitHub | Versionamento e deploy |

---

## 🚀 Como executar o projeto

1. Clone o repositório:

2. Acesse a pasta:

cd projeto_clima


3. Abra o projeto no VS Code e execute o index.html usando Live Server.


## 🧪 Testes Automatizados

O projeto inclui função isolada para testes (buscarClimaPorCoordenadas).

**Rodar os testes:**
npm install
npm test

**Exemplo de teste (tests/api.test.js):**
    const { buscarClimaPorCoordenadas } = require("../api.js");

    test("Retorna dados contendo temperatura", async () => {
      const clima = await buscarClimaPorCoordenadas(-23.55, -46.63);
      expect(clima).toHaveProperty("temperature");
    });

## 🗃️ Estrutura de Pastas
    projeto_clima/
    │ index.html
    │ style.css
    │ api.js
    │ package.json
    │
    └── tests/
        └── api.test.js

## 🧭 Branches do Projeto
**Branch**	          **Conteúdo**
01_                     projeto	Estrutura inicial + interface básica
02_ep_codificacao	      Refino, clima completo, tema dinâmico, testes


## 🤖 Feito com apoio de Inteligência Artificial

Este projeto foi desenvolvido com auxílio de:

    GitHub Copilot

    ChatGPT (OpenAI)

    Claude (Anthropic)

    A IA atuou como copiloto, não substituindo análise, decisões ou estilo de código.

## 👩‍💻 Autoria

**Carina Bentlin**
Desenvolvedora Full Stack em formação
LinkedIn: https://www.linkedin.com/in/carinabentlin/