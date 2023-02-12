import fastify from "fastify";

const app = fastify();

app.get("/hello", async () => {
  return "Hello World";
});

app.listen({
  port: 3335
}).then(() => console.log("Server is running..."));
