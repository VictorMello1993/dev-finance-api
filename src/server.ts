import fastify from "fastify";
import { knex } from "./database";
import crypto from "node:crypto";

const app = fastify();

app.get("/hello", async () => {
  /* INSERT INTO transactions (id, title, amount)
  VALUES(crypto.randomUUID, "First transaction example", 1000) */

  // const transaction = await knex("transactions").insert({
  //   id: crypto.randomUUID(),
  //   title: "First transaction example",
  //   amount: 1000
  // }).returning("*");

  // return transaction;

  // -------------------------------------------------------------------------------------------------

  // SELECT * FROM transactions WHERE amount = 1000
  const transactions = await knex("transactions")
    .where("amount", 1000)
    .select("*");

  return transactions;
});

app.listen({
  port: 3335
}).then(() => console.log("Server is running..."));
