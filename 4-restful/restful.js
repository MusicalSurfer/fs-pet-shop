import express from 'express';
import fs from 'fs';
const fsPromise = fs.promises;

let port = process.env.PORT || 8000;
const app = express(); // Declare a express app.
app.use(express.json());

// Get request for all pets
app.get('/pets', (req, res, next) => {
    fsPromise.readFile('../pets.json', 'utf8')
        .then((text) => {
            res.json(JSON.parse(text));
        })
        .catch(next)
});

// Get request for specific pet
app.get('/pets/:index', (req, res, next) => {
    let index = req.params.index; // Get selected index from request.
    let parsedIndex = parseInt(index); // Concert from string.

    fsPromise.readFile('../pets.json', 'utf8')
        .then((text) => {
            const parsedData = JSON.parse(text); // Parse data.

            // If index is higher than amount of current pets, return 404.
            if (parsedIndex > parsedData.length - 1) {
                res.status(404).send('Not Found');
            }

            // Otherwise, return selected pet.
            const result = parsedData[parsedIndex];
            res.send(JSON.stringify(result));
        })
        .catch(next)
});

//Patch request to update a pet.
app.patch('/pets/:index', (req, res, next) => {
    const updatedPet = req.body;
    let index = req.params.index;
    let parsedIndex = parseInt(index);

    // If parameters for updated pet are missing or incorrect, send error.
    for (let key in updatedPet) {
        if (isNaN(parseInt(updatedPet.age)) || !updatedPet.kind || !updatedPet.name) {
            res.status(400).json({ message: 'Pet submitted incorrectly. Usage: age, kind, name' });
        }
    }

    fsPromise.readFile('../pets.json', 'utf8')
        .then((text) => {
            const parsedData = JSON.parse(text); // Parse data.

            // If index is higher than amount of current pets, return 404.
            if (parsedIndex > parsedData.length - 1) {
                res.status(404).send('Not Found');
            }

            // Update selected pet.
            const selectedPet = parsedData[index];
            selectedPet.age = updatedPet.age;
            selectedPet.kind = updatedPet.kind;
            selectedPet.name = updatedPet.name;
            console.log(parsedData);
            return parsedData;
        })
        .then((parsedData) => {
            return fsPromise.writeFile('../pets.json', JSON.stringify(parsedData));
        })
        .then(() => {
            res.status(200).json({ message: 'Pet updated successfully.', data: updatedPet });
        })
        .catch(next)
});

// Delete request to update a pet.
app.delete('/pets/:index', (req, res, next) => {
    let index = req.params.index;
    let parsedIndex = parseInt(index);

    fsPromise.readFile('../pets.json', 'utf8')
        .then((text) => {
            const parsedData = JSON.parse(text); // Parse data.

            // If index is higher than amount of current pets, return 404.
            if (parsedIndex > parsedData.length - 1) {
                res.status(404).send('Not Found');
            }

            parsedData.splice(parsedIndex, 1);
            return parsedData;
        })
        .then((parsedData) => {
            return fsPromise.writeFile('../pets.json', JSON.stringify(parsedData));
        })
        .then(() => {
            res.status(200).json({ message: 'Pet deleted successfully.' });
        })
        .catch(next)
});

// Post request to add a pet
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