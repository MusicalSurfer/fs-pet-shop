#!/usr/bin/env node
import fs from 'fs';
import { exit } from 'node:process';

const petStore = {
    // Main program function
    mainArg: () => {
        if (process.argv[2] == 'read') {
            petStore.readArg();
        }
        else if (process.argv[2] == 'create') {
            petStore.createArg(process.argv[3], process.argv[4], process.argv[5]);
        }
        else if (process.argv[2] == 'update') {
            petStore.updateArg(process.argv[3], process.argv[4], process.argv[5], process.argv[6]);
        }
        else if (process.argv[2] == 'destroy') {
            petStore.destroyArg(process.argv[3]);
        }
        else {
            console.error('Usage: node fs.js [read | create | update | destroy]')
        }
    },

    // Function that is invoked if read argument is passed.
    readArg: () => {
        fs.readFile('../pets.json', 'utf8', (error, data) => {
            if (error) throw error;

            let newData = JSON.parse(data);
            switch (process.argv[3]) {
                case '0':
                    console.log(newData[0]);
                    break;
                case '1':
                    console.log(newData[1]);
                    break;
                default:
                    console.log(newData);
                    break;
            }
        })
    },

    createArg: (age, kind, name) => {
        fs.readFile('../pets.json', 'utf8', (error, data) => {
            if (error) throw error;

            let newData = JSON.parse(data);
            let addPet = {
                "age": parseInt(age),
                "kind": kind,
                "name": name
            }

            newData.push(addPet);
            let submission = JSON.stringify(newData);

            fs.writeFile('../pets.json', submission, (error) => {
                if (error) throw error;
            })
        })
    },

    updateArg: (index, age, kind, name) => {
        fs.readFile('../pets.json', 'utf8', (error, data) => {
            if (error) throw error;

            let newData = JSON.parse(data);
            let pet = newData[index];
            pet.age = parseInt(age);
            pet.kind = kind;
            pet.name = name;
            let submission = JSON.stringify(newData);
            fs.writeFile('../pets.json', submission, (error) => {
                if (error) throw error;
            });
        })
    },

    destroyArg: (index) => {
        fs.readFile('../pets.json', 'utf8', (error, data) => {
            if (error) throw error;

            let newData = JSON.parse(data);
            newData.splice(index, 1);
            let submission = JSON.stringify(newData);

            fs.writeFile('../pets.json', submission, (error) => {
                if (error) throw error;
            });
        })
    }
}

petStore.mainArg();