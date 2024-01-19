// set up dependencies
import express from 'express';

// create an instance of the express application
const app = express();

// handle requests with routes
app.get('/hello', (req, res) => {
    res.send('hi there!');
});

app.get('/goodbye', (req, res) => {
    res.send('bye now!');
});
// listen on a port
const port = 8000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
