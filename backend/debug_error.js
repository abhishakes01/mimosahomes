const http = require('http');

http.get('http://localhost:5000/api/floorplans?limit=100', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        try {
            console.log('Data:', JSON.stringify(JSON.parse(data), null, 2));
        } catch (e) {
            console.log('Data (raw):', data);
        }
    });
}).on('error', (err) => {
    console.error('Error fetching:', err.message);
});
