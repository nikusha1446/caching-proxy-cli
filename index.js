import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { createServer } from './server.js';
import axios from 'axios';

const argv = yargs(hideBin(process.argv))
  .option('port', {
    type: 'number',
    description: 'Port on which the caching proxy server will run',
  })
  .option('origin', {
    type: 'string',
    description: 'URL of the server to which requests will be forwarded',
  })
  .option('clear-cache', {
    type: 'boolean',
    description: 'Clear the cache',
  })
  .option('proxy-port', {
    type: 'number',
    description: 'Port of the running proxy server (for clearing cache)',
  }).argv;

if (argv['clear-cache']) {
  if (!argv['proxy-port']) {
    console.error('Error: --proxy-port is required when using --clear-cache');
    console.error('Example: node index.js --clear-cache --proxy-port 3000');
    process.exit(1);
  }

  const proxyPort = argv['proxy-port'];

  try {
    const response = await axios.delete(`http://localhost:${proxyPort}/cache`);
    console.log(response.data.message);
    process.exit(0);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error(`Error: No proxy server running on port ${proxyPort}`);
    } else {
      console.error('Error clearing cache:', error.message);
    }
    process.exit(1);
  }
}

if (!argv.port || !argv.origin) {
  console.error(
    'Error: Both --port and --origin are required to start the server'
  );
  process.exit(1);
}

createServer(argv.port, argv.origin);
