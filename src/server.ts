import app from "./app"
import "dotenv/config";
import { prisma } from "./lib/prisma";
import config from "./config";


async function main() {
  const PORT = config.port
  try {
   await prisma.$connect();
   console.log("Connected to the database")
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  } catch (error) {
    console.error("Error starting server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main()