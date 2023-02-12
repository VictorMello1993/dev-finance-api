import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary(); // PK;
    table.text("title").notNullable(); // Coluna varchar title NOT NULL
    table.decimal("amount", 10, 2).notNullable(); // Coluna number(10, 2) amount NOT NULL
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable(); // Coluna timestamp created_at default SYSDATE NOT NULL
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("transactions");
}
