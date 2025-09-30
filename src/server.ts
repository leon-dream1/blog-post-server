import app from './app';
import mongoose from 'mongoose';
import config from './config';
import { Server } from 'http';
// import { seedAdmin } from './app/utils/seedAdmin';

let server: Server;
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    // seedAdmin();

    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on('uncaughtException', () => {
  console.log(`uncaughtException is detected , shut done server`);
  process.exit(1);
});

process.on('unhandledRejection', () => {
  if (server) {
    server.close(() => {
      console.log(`unhandledRejection is detected , shut done server`);
      process.exit(1);
    });
  }
  process.exit(1);
});
