import express from 'express';
import pkg from 'pg';
const Pool = pkg.Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'petshop_db',
    password: 'postgres',
    port: 6432
})

const app = express(); // Declare a express app.
app.use(express.json());

// Get request for all pets
app.get('/pets', (req, res, next) => {
    pool.query('SELECT * FROM pets')
        .then((data) => {
            res.json(data.rows);
        })
        .catch(next)
});

// Get request for specific pet
app.get('/pets/:name', (req, res, next) => {
    let petName = req.params.name.toLowerCase(); // Get selected index from request.

    pool.query('SELECT * FROM pets WHERE name LIKE $1', [`${petName}%`]) // Grab closest matches for pet name.
        .then((data) => {
            if (data.rows.length === 0) {
                res.status(404).send('Pet not found');
            }
            res.json(data.rows);
        })
        .catch(next);
});

// Patch request to update a pet.
app.patch('/pets/:name', (req, res, next) => {
    const updatedPet = req.body;
    let petName = req.params.name;

    // If parameters for updated pet are missing or incorrect, send error.
    for (let key in updatedPet) {
        if (isNaN(parseInt(updatedPet.age)) || !updatedPet.kind || !updatedPet.name) {
            res.status(400).json({ message: 'Pet submitted incorrectly. Usage: age, kind, name' });
        }
    }
    pool.query('UPDATE pets SET age = $1, name = $2, kind = $3 WHERE name = $4', [parseInt(updatedPet.age), updatedPet.name.toLowerCase(), updatedPet.kind, petName])
        .then(() => {
            res.status(200).send(`${petName} updated successfully.`);
        })
        .catch(next)
});

// Delete request to delete a pet.
app.delete('/pets/:name', (req, res, next) => {
    let petName = req.params.name;

    pool.query('DELETE FROM pets WHERE name = $1', [petName])
        .then((result) => {
            if (result.rowCount === 0) {
                res.status(404).send(`Pet with name ${petName} not found.`);
            }
            res.status(201).json({ message: 'Pet deleted successfully' });
        })
        .catch(next)
});

// Post request to add a new pet
app.post('/pets', (req, res, next) => {
    const newPet = req.body; // Already parsed due to express.json middleware.

    for (let key in newPet) {
        if (isNaN(parseInt(newPet.age)) || !newPet.kind || !newPet.name) {
            res.status(400).json({ message: 'Pet submitted incorrectly. Usage: age, kind, name' });
        }
    }
    // Process the newPet data and update the pets.json file or database
    pool.query('INSERT INTO pets (age, name, kind) VALUES ($1, $2, $3)', [parseInt(newPet.age), newPet.name.toLowerCase(), newPet.kind])
        .then((result) => {
            res.status(201).json({ message: 'Pet Added successfully', data: newPet });
        })
        .catch(next)
});

// Use next middleware to pass errors.
app.use((err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
})

app.listen(8000, () => {
    console.log('listening on port ' + 8000);
})