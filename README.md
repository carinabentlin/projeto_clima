# 🌦️ Previsão do Tempo — Aplicativo Web

Aplicativo simples e intuitivo para consulta de **previsão do tempo em tempo real**, desenvolvido com **HTML, CSS e JavaScript puro**, com o apoio de **ferramentas de Inteligência Artificial** para acelerar o desenvolvimento Back-end e Front-end.

Este projeto demonstra como a IA pode **simplificar o desenvolvimento**, mantendo **boa estrutura, clareza e boas práticas**.

---

## ✨ Funcionalidades

Busca de cidade via API de Geocodificação do Open-Meteo

Consulta de clima atual, exibindo:

Temperatura (°C)

Ícone e descrição do clima

Nome da cidade formatado

Data e horário da consulta

Tema automático (Dia / Noite) baseado na API

Tratamento de erros:

Cidade inexistente

Falha de rede

Dados climáticos indisponíveis

---

## 🖥️ Interface

| Modo Claro            | Modo Noturno          |
| --------------------- | --------------------- |
| *(insira print aqui)* | *(insira print aqui)* |




---

## 🧠 Tecnologias e Ferramentas

| Tecnologia / Ferramenta   | Finalidade                                     |
| ------------------------- | ---------------------------------------------- |
| JavaScript ES6+           | Lógica, integração com API, manipulação de DOM |
| HTML5 e CSS3              | Interface, responsividade e estilos            |
| Open-Meteo Geocoding API  | Conversão Nome da Cidade → Coordenadas         |
| Open-Meteo Weather API    | Dados climáticos                               |
| Jest (Node)               | Testes automatizados                           |
| Git + GitHub              | Versionamento e organização do projeto         |
| ChatGPT, Copilot e Claude | Assistência na escrita e revisão de código     |


---

## 🚀 Como executar o projeto

1. git clone https://github.com/carinabentlin/projeto_clima.git


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
    │ README.md
    │
    └── tests/
        └── api.test.js


| Branch                | Conteúdo                                      |
| --------------------- | --------------------------------------------- |
| **01_projeto**        | Estrutura inicial + interface                 |
| **02_ep_codificacao** | Refinamento, retorno formatado, tema dinâmico |
| **03_testes**         | Testes com Jest                               |
| **04_doc_review**     | Documentação, README e revisão de código      |



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