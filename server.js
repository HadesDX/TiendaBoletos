// server.js
const app = require('./nodeApp');
const port = 3000;

app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});