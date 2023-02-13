import fastify from "fastify";
import { env } from "./env";
import { transactionRoutes } from "./routes/transaction";
import cookie from "@fastify/cookie";

const app = fastify();

app.register(cookie);
app.register(transactionRoutes, {
  prefix: "transactions"
});

app.listen({
  port: env.PORT
}).then(() => console.log("Server is running..."));
