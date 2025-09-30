import { db } from "./index";
import { migrate } from "drizzle-orm/neon-http/migrator";

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: "src/db/migrations" });
    console.log("Migration complete ✅");
  } catch (error) {
    console.error("Migration failed ❌", error);
  }
};

main(); // 👈 Don't forget to call your async function!