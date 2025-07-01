import express from "express";

import swaggerUi from "swagger-ui-express";

import swaggerJsdoc from "swagger-jsdoc";

import { options } from "./swagger/config.js";

const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));
app.get("/users", function (req, res) {
  const result = [
    {
      email: "aaa@gmail.com",
      name: "철수",
      phone: "010-1234-5678",
      personal: "220110-2222222",
      prefer: "https://naver.com",
    },
    {
      email: "aaa@gmail.com",
      name: "영희",
      phone: "010-1234-5678",
      personal: "220110-2222222",
      prefer: "https://naver.com",
    },
    {
      email: "aaa@gmail.com",
      name: "훈이이",
      phone: "010-1234-5678",
      personal: "220110-2222222",
      prefer: "https://naver.com",
    },
    {
      email: "aaa@gmail.com",
      name: "핑이",
      phone: "010-1234-5678",
      personal: "220110-2222222",
      prefer: "https://naver.com",
    },
    {
      email: "aaa@gmail.com",
      name: "팡이이",
      phone: "010-1234-5678",
      personal: "220110-2222222",
      prefer: "https://naver.com",
    },
  ];

  res.send(result);
});

app.get("/starbucks", function (req, res) {
  const result = [
    {
      name: "아메리카노1",
      kcal: 5,
    },
    {
      name: "아메리카노2",
      kcal: 5,
    },
    {
      name: "아메리카노3",
      kcal: 5,
    },
    {
      name: "아메리카노4",
      kcal: 5,
    },
    {
      name: "아메리카노5",
      kcal: 5,
    },
    {
      name: "아메리카노6",
      kcal: 5,
    },
    {
      name: "아메리카노7",
      kcal: 5,
    },
    {
      name: "아메리카노8",
      kcal: 5,
    },
    {
      name: "아메리카노9",
      kcal: 5,
    },
    {
      name: "아메리카노10",
      kcal: 5,
    },
  ];

  res.send(result);
});

app.listen(3000);
