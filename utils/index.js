import mongoose from "mongoose";
import JWT from 'jsonwebtoken';
import {format} from 'date-fns'
import es from  'date-fns/locale/es'

function validateObjectId(id, response) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('El Id no es Valido'.toUpperCase());

        return response.status(400).json({
            message: error.message,
            type: 'error',
        });
    }
}

function handleNotFoundError(message, response) {
    const error = new Error(message.toUpperCase());

    return response.status(404).json({
        message: error.message,
        type: 'error',
    });
}

function handleInternalServerError(message, response) {
    const error = new Error(message.toUpperCase());

    return response.status(500).json({
        message: error.message,
        type: 'error',
    });
}

const uniqueId = () =>
    Date.now().toString(32) + Math.random().toString(32).substring(2);

const generateJWT = (id) => 
    JWT.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'});

function formatDate(date) {
    return format(date, 'PPPP', {locale: es})
}

export {
    validateObjectId,
    handleNotFoundError,
    handleInternalServerError,
    uniqueId,
    generateJWT,
    formatDate,
}