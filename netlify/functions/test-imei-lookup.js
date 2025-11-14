// Simple tester for local execution of the Netlify function
// Usage: IMEI_API_KEY=yourkey node test-imei-lookup.js

const handler = require('./imei-lookup-enhanced').handler;

async function run() {
  const event = {
    httpMethod: 'GET',
    queryStringParameters: { imei: '490154203237518' }, // sample valid IMEI
    headers: { 'x-forwarded-for': '127.0.0.1' }
  };

  const resp = await handler(event);
  console.log('STATUS:', resp.statusCode);
  console.log('HEADERS:', resp.headers);
  console.log('BODY:', resp.body);
}

run().catch(e => console.error(e));
