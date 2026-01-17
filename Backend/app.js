const express = require("express");
const cors = require("cors");
const auth = require("./Routes/auth.route");
const Expense = require("./Routes/Expence.route");
const Budget = require("./Routes/Budget");
const Insight = require("./Routes/Insight");
const subscriptions = require("./Routes/subscriptions");
const crruser = require("./Routes/crruser");
const userincome = require("./Routes/user.income")

const app = express();

app.use(
  cors({
    origin: "https://budget-tracker-ruby.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH "],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
res.send(`running ${process.env.PORT}mongo ${process.env.MONGO_URI} google ${process.env.GOOGLE_CLIENT_ID}`);
});

app.use("/auth",auth);
app.use("/expenses",Expense);
app.use("/budgets",Budget);
app.use("/insights", Insight );
app.use("/subscriptions",subscriptions);
app.use("/user",crruser);
app.use("/income",userincome);

module.exports = app;