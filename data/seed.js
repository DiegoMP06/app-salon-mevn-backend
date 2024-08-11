import dotenv from 'dotenv';
import colors from 'colors';
import {db} from '../config/db.js';
import Service from '../models/Service.js';
import {services} from './beautyServices.js';

dotenv.config()

await db();

async function seedDB() {
    try {
        await Service.insertMany(services);
        console.log(colors.green.bold('Se Agregaron los Datos Correctamente'))
        process.exit();
    } catch (error) {
        console.log(colors.red.bold(error))
        process.exit(1);
    }
}

async function clearDB() {
    try {
        await Service.deleteMany();
        console.log(colors.yellow.bold('Se Eliminaron los Datos Correctamente'))
        process.exit();
    } catch (error) {
        console.log(colors.red.bold(error))
        process.exit(1);
    }
}

if(process.argv[2] === '--import') {
    seedDB();
} else {
    clearDB();
}