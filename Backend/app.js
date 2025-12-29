const express = require("express");
const cors = require("cors");
const auth = require("./Routes/auth.route");
const Expense = require("./Routes/Expence.route");
const Catogary = require("./Routes/Catogery.route")

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth",auth);
app.use("/expenses",Expense);
app.use("catogary",Catogary);

module.exports = app;
