'use strict';

import fs from 'fs';
import path, { parse } from 'path';
import * as http from 'http';
let port = process.env.PORT || 8000;
const petRegExp = /^\/pets\/(.*)$/;

let server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/pets') {
        fs.readFile('../pets.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                return res.end('Internal Server Error');
            }

            res.setHeader('Content-Length', 'application/json');
            res.end(data);
        })
    }
    else if (req.method === 'GET' && req.url.match(petRegExp)) {
        fs.readFile('../pets.json', 'utf8', (err, data) => {
            let parsedData = JSON.parse(data);
            let index = Number(req.url.match(petRegExp)[1]);
            let response = parsedData[index];

            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                return res.end('Internal Server Error');
            }
            else if (index < 0 || index > parsedData.length - 1) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'text/plain');
                return res.end('Not Found')
            }
            res.setHeader('Content-Length', 'application/json');
            res.end(JSON.stringify(response));
        })
    }
    // else if (req.method === 'POST' && req.url === '/pets') {
    //     fs.readFile('../pets.json', 'utf8', (err, data) => {
    //         if (err) {
    //             console.error(err);
    //             res.statusCode = 500;
    //             res.setHeader('Content-Type', 'text/plain');
    //             return res.end('Internal Server Error');
    //         }

    //         let parsedData = JSON.parse(data);
    //         resultObject = {
    //             "age": process.argv[2],
    //             "kind": process.argv[3],
    //             "breed": process.argv[4],
    //         }
    //         parsedData.push()
    //     })
    // }
    else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log('Listening on port, ' + port);
})