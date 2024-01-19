import express from 'express';
import fs from 'fs';
const fsPromise = fs.promises;

let port = process.env.PORT || 8000;
const app = express(); // Declare a express app.
app.use(express.json());

app.get('/pets', (req, res, next) => {
    fsPromise.readFile('../pets.json', 'utf8')
        .then((text) => {
            res.json(JSON.parse(text));
        })
        .catch(next)
});

app.get('/pets/:index', (req, res, next) => {
    let index = req.params.index;
    let parsedIndex = parseInt(index);

    fsPromise.readFile('../pets.json', 'utf8')
        .then((text) => {
            const parsedData = JSON.parse(text);
            const result = parsedData.at(parsedIndex)
            res.send(JSON.stringify(result));
        })
        .catch(next)
});

app.post('/pets', (req, res, next) => {
    const newPet = req.body; // Already parsed due to express.json middleware.

    for (let key in newPet) {
        if (isNaN(parseInt(newPet.age)) || !newPet.kind || !newPet.name) {
            res.status(400).json({ message: 'Pet submitted incorrectly. Usage: age, kind, name' });
        }
    }
    // Process the newPet data and update the pets.json file or database
    fsPromise.readFile('../pets.json', 'utf8')
        .then((text) => {
            const parsedData = JSON.parse(text);
            parsedData.push(newPet);
            return parsedData;
        })
        .then((parsedData) => {
            return fsPromise.writeFile('../pets.json', JSON.stringify(parsedData))
        })
        .then(() => {
            res.status(201).json({ message: 'Pet added successfully', data: newPet });
        })
        .catch(next)
});

app.use((err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
})

app.listen(port, () => {
    console.log('listening on port ' + port);
})