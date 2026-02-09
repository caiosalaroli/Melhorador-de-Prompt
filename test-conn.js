
const https = require('https');

const url = 'https://hbgmpqzaqjqjizutgnml.supabase.co';

console.log(`Testing connection to ${url}...`);

https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
}).on('error', (e) => {
    console.error('Error:', e);
});
