import User from '../models/User.js';
import {sendEmailVerification, sendEmailPasswordReset} from '../emails/authEmailService.js';
import { handleInternalServerError, generateJWT, uniqueId } from '../utils/index.js';

const MIN_PASSWORD_LENGTH = 8;

const register = async (request, response) => {

    if(Object.values(request.body).includes('')) {
        const error = new Error('Todos los Campos son Obligatorios'.toUpperCase());

        return response.status(400).json({
            message: error.message,
            type: 'error',
        });
    }

    const {email, password} = request.body;

    const userExists = await User.findOne({email});

    if(userExists) {
        const error = new Error('El usuario ya esta registrado'.toUpperCase());

        return response.status(400).json({
            message: error.message,
            type: 'error',
        });
    }

    if(password.trim().length < MIN_PASSWORD_LENGTH) {
        const error = new Error(`El password debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`.toUpperCase());

        return response.status(400).json({
            message: error.message,
            type: 'error',
        });
    }

    try {
        const user = new User(request.body)
        const result = await user.save();

        const {name, email, token} = result;

        sendEmailVerification({
            name,
            email,
            token,
        });

        return response.json({
            message: 'El Usuario se creo Correctamente, Revisa tu Email'.toUpperCase(),
            type: 'success',
        });
    } catch {
        handleInternalServerError('Hubo un Error al Registrarse', response)
    }
}

const verifyAcount = async (request, response) => {
    const { token } = request.params;

    const user = await User.findOne({token});

    if(!user) {
        const error = new Error('Hubo un Error, Token invalido'.toUpperCase());

        return response.status(401).json({
            message: error.message,
            type: 'error',
        });
    }

    try {
        user.verified = true;
        user.token = '';

        await user.save();

        response.json({
            message: 'Usuario Confirmado Correctamente'.toUpperCase(),
            type: 'success',
        });
    } catch {
        handleInternalServerError('Hubo un Error al Confirmar Cuenta', response)
    }
}

const login = async (request, response) => {
    if(Object.values(request.body).includes('')) {
        const error = new Error('Todos los Campos son Obligatorios'.toUpperCase());

        return response.status(400).json({
            message: error.message,
            type: 'error',
        });
    }

    const { email, password } = request.body;

    const user = await User.findOne({email});

    if(!user) {
        const error = new Error('El usuario no existe'.toUpperCase());

        return response.status(401).json({
            message: error.message,
            type: 'error',
        });
    }

    if(!user.verified) {
        const error = new Error('Cuenta no Confirmada'.toUpperCase());

        return response.status(401).json({
            message: error.message,
            type: 'error',
        });
    }

    if(! await user.checkPassword(password)) {
        const error = new Error('Password Incorrecto'.toUpperCase());

        return response.status(401).json({
            message: error.message,
            type: 'error',
        });
    }

    const token = generateJWT(user._id);

    return response.json({
        token
    });
}

const forgotPassword = async (request, response) => {
    const { email } = request.body;
    
    const user = await User.findOne({email});
    
    if(!user) {
        const error = new Error('El usuario no existe'.toUpperCase());

        return response.status(404).json({
            message: error.message,
            type: 'error',
        });
    }

    try {
        user.token = uniqueId();

        const result = await user.save();

        await sendEmailPasswordReset({
            name: result.name,
            email: result.email,
            token: result.token
        });

        response.json({
            message: 'Revisa tu Email para Reestablecer tu Password'.toUpperCase(),
            type: 'success',
        });
    } catch (error) {
        console.log(error)
    }
}

const verifyPasswordResetToken = async (request, response) => {
    const { token } = request.params;

    const isValidToken = await User.findOne({token});

    if(!isValidToken) {
        const error = new Error('Hubo un Error, Token invalido'.toUpperCase());

        return response.status(400).json({
            message: error.message,
            type: 'error',
        });
    }

    return response.json({
        message: 'Token Valido'.toUpperCase(),
        type: 'success',
    });
}

const updatePassword = async (request, response) => {
const { token } = request.params;
const { password } = request.body;

const user = await User.findOne({token});

if(!user) {
    const error = new Error('Hubo un Error, Token invalido'.toUpperCase());

    return response.status(401).json({
        message: error.message,
        type: 'error',
    });
}

    if(password.length < MIN_PASSWORD_LENGTH) {
        const error = new Error('Password debe tener al menos 6 caracteres'.toUpperCase());

        return response.status(400).json({
            message: error.message,
            type: 'error',
        });
    }

    try {
        user.password = password;
        user.token = '';

        await user.save();

        return response.json({
            message: 'Password Actualizado Correctamente'.toUpperCase(),
            type: 'success',
        });
    } catch {
        handleInternalServerError('Hubo un Error al Actualizar Password', response)
    }
}

const user = async (request, response) => {
    const {user} = request;

    response.json(user)
}

const admin = async (request, response) => {
    const {user} = request;

    if(!user.admin) {
        const error = new Error('Acceso Denegado'.toUpperCase());

        return response.status(403).json({
            message: error.message,
            type: 'error',
        });
    }

    response.json(user)
}

export {
    register,
    verifyAcount,
    login,
    forgotPassword,
    verifyPasswordResetToken,
    updatePassword,
    user,
    admin,
};