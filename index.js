import express from "express";
import dotenv from 'dotenv'
import colors from 'colors';
import cors from 'cors';
import { db } from "./config/db.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

db();

const whitelist = process.argv[2] === '--postman' ?
    [process.env.FRONTEND_URL, undefined] : [process.env.FRONTEND_URL];

const optionsCors = {
    origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Error de Cors'));
        }
    }
}

app.use(cors(optionsCors))

app.use('/api/services', servicesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(colors.blue.bold('El Servidor se Esta ejecutando en el puerto:', PORT))
});