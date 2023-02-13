import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/checkSessionIdExists";

export async function transactionRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const { sessionId } = request.cookies;

    const transactions = await knex("transactions")
      .where("session_id", sessionId)
      .select();

    return {
      transactions
    };
  });

  app.get("/:id", { preHandler: [checkSessionIdExists] }, async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid()
    });

    const { sessionId } = request.cookies;
    const { id } = getTransactionParamsSchema.parse(request.params);

    const transaction = await knex("transactions").where({
      session_id: sessionId,
      id
    }).first();

    return { transaction };
  });

  app.get("/summary", { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies;
    const summary = await knex("transactions")
      .where("session_id", sessionId)
      .sum("amount", { as: "amount" })
      .first();

    return { summary };
  });

  app.post("/", async (request, reply) => {
    const MILISSECONDS_IN_A_WEEK = 1000 * 60 * 60 * 24 * 7;

    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"])
    });

    const { title, amount, type } = createTransactionBodySchema.parse(request.body);

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: MILISSECONDS_IN_A_WEEK
      });
    }

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId
    });

    return reply.status(201).send();
  });
}

// Demonstração
//   app.post("/hello", async () => {
//     /* INSERT INTO transactions (id, title, amount)
//     VALUES(crypto.randomUUID, "First transaction example", 1000) */

//     // const transaction = await knex("transactions").insert({
//     //   id: crypto.randomUUID(),
//     //   title: "First transaction example",
//     //   amount: 1000
//     // }).returning("*");

//     // return transaction;

//     // -------------------------------------------------------------------------------------------------

//     // SELECT * FROM transactions WHERE amount = 1000
//     const transactions = await knex("transactions")
//       .where("amount", 1000)
//       .select("*");

//     return transactions;
//   });
// }
