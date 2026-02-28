import { PrismaClient } from "@prisma/client";
import { DATABASE_URL, PRIMARY_REGION, FLY_REGION } from "astro:env/server";

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (import.meta.env.PROD) {
  prisma = getClient();
} else {
  if (!global.__db__) {
    global.__db__ = getClient();
  }
  prisma = global.__db__;
}

function getClient() {
  const databaseUrl = new URL(DATABASE_URL);

  const isLocalHost = databaseUrl.hostname === "localhost";

  const primaryRegion = isLocalHost ? null : PRIMARY_REGION;
  const flyRegion = isLocalHost ? null : FLY_REGION;

  const isReadReplicaRegion = !primaryRegion || primaryRegion === flyRegion;

  if (!isLocalHost) {
    databaseUrl.host = `${flyRegion}.${databaseUrl.host}`;
    if (!isReadReplicaRegion) {
      // 5433 is the read-replica port
      databaseUrl.port = "5433";
    }
  }

  console.log(`🔌 setting up prisma client to ${databaseUrl.host}`);
  const client = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl.toString(),
      },
    },
  });
  // connect eagerly
  client.$connect();

  return client;
}

export { prisma };
