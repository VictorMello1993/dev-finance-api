import fastify from "fastify";
import { env } from "./env";
import { transactionRoutes } from "./routes/transaction";
import cookie from "@fastify/cookie";

const app = fastify();

app.register(cookie);

// Middleware global, executado em todas as rotas da aplicação
app.addHook("preHandler", async (request, reply) => {
  console.log(`[${request.method}] ${request.url}`);
});

app.register(transactionRoutes, {
  prefix: "transactions"
});

app.listen({
  port: env.PORT
}).then(() => console.log("Server is running..."));
