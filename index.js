import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

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
  }).argv;

if (argv['clear-cache']) {
  console.log('Clearing cache...');
  process.exit(0);
}

if (!argv.port || !argv.origin) {
  console.error(
    'Error: Both --port and --origin are required to start the server'
  );
  process.exit(1);
}
