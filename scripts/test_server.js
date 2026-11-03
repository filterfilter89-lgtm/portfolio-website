const http = require('http');

http.get('http://localhost:5173/', (res) => {
  console.log('Status code:', res.statusCode);
});
