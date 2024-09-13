const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const loadAnimals = () => {
    const data = fs.readFileSync('animals.json');
    return JSON.parse(data);
};

const saveAnimals = (animals) => {
    fs.writeFileSync('animals.json', JSON.stringify(animals, null, 2));
};

app.get('/animals', (req, res) => {
    const animals = loadAnimals();
    res.json(animals);
});

app.post('/animals', (req, res) => {
    const animals = loadAnimals();
    const newAnimal = req.body;
    newAnimal.id = animals.length ? animals[animals.length - 1].id + 1 : 1;
    animals.push(newAnimal);
    saveAnimals(animals);
    res.status(201).json(newAnimal);
});

app.put('/animals/:id', (req, res) => {
    const animals = loadAnimals();
    const id = parseInt(req.params.id);
    const updatedAnimal = req.body;

    const index = animals.findIndex(animal => animal.id === id);
    if (index !== -1) {
        animals[index] = { id, ...updatedAnimal };
        saveAnimals(animals);
        res.json(animals[index]);
    } else {
        res.status(404).json({ error: "Animal not found" });
    }
});

app.delete('/animals/:id', (req, res) => {
    const animals = loadAnimals();
    const id = parseInt(req.params.id);

    const index = animals.findIndex(animal => animal.id === id);
    if (index !== -1) {
        const deletedAnimal = animals.splice(index, 1);
        saveAnimals(animals);
        res.json(deletedAnimal);
    } else {
        res.status(404).json({ error: "Animal not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
