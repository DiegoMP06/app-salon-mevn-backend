import {formatISO, parse, startOfDay, endOfDay, isValid} from 'date-fns';
import Appointment from '../models/Appointment.js';
import {handleInternalServerError, handleNotFoundError, validateObjectId, formatDate} from '../utils/index.js';
import {sendEmailCancelAppointment, sendEmailNewAppointment, sendEmailUpdateAppointment} from '../emails/appointmentEmailService.js';

const getAppointmentsByDate = async (request, response) => {
    const {date} = request.query;

    const newDate = parse(date, 'dd/MM/yyyy', new Date());

    if(!isValid(newDate)) {
        const error = new Error('Fecha Invalida'.toUpperCase());

        return response.status(400).json({
            message: error.message,
            type: 'error',
        });
    }

    const ISODate = formatISO(newDate);

    const appointments = await Appointment.find({
        date: {
            $gte: startOfDay(new Date(ISODate)),
            $lte: endOfDay(new Date(ISODate)),
        }
    }).select('time');

    response.json(appointments);
}

const createAppointment = async (request, response) => {
    const appointment = request.body;
    appointment.user = request.user._id.toString();

    try {
        const newAppointment = new Appointment(appointment);
        const result = await newAppointment.save();
        await sendEmailNewAppointment({
            date: formatDate(result.date),
            time: result.time
        });

        response.json({
            message: 'Cita Creada Correctamente'.toUpperCase(),
            type: 'success',
        });
    } catch {
        handleInternalServerError('Ocurrio un Error al Crear la Cita', response)
    }
}

const getAppointment = async (request, response) => {
    const {id} = request.params;

    validateObjectId(id, response);

    try {
        const appointment = await Appointment.findById(id).populate('services');

        if(!appointment) {
            return handleNotFoundError('Cita No Encontrada', response);
        }

        if(appointment.user.toString() !== request.user._id.toString()) {
            const error = new Error('Acceso No Autorizado'.toUpperCase());

            return response.status(403).json({
                message: error.message,
                type: 'error',
            }) 
        }

        response.json(appointment);
    } catch (error) {
        console.log(error)
    }
}

const updateAppointment = async (request, response) => {
    const { id } = request.params;

    validateObjectId(id, response);

    try {
        const appointment = await Appointment.findById(id);

        if(!appointment) {
            return handleNotFoundError('Cita No Encontrada', response);
        }

        if(appointment.user.toString() !== request.user._id.toString()) {
            const error = new Error('Acceso No Autorizado'.toUpperCase());

            return response.status(403).json({
                message: error.message,
                type: 'error',
            }) 
        }

        const { date, time, services, amount } = request.body;

        appointment.date = date || appointment.date;
        appointment.time = time || appointment.time;
        appointment.services = services || appointment.services;
        appointment.amount = amount || appointment.amount;

        const result = await appointment.save();

        await sendEmailUpdateAppointment({
            date: formatDate(result.date),
            time: result.time
        });
        
        response.json({
            message: 'Cita Actualizada Correctamente'.toUpperCase(),
            type: 'success',
        });
    } catch (error) {
        console.log(error)
    }
}

const deleteAppointment = async (request, response) => {
    const { id } = request.params;
    validateObjectId(id, response);

    try {
        const appointment = await Appointment.findById(id);

        if(!appointment) {
            return handleNotFoundError('Cita No Encontrada', response);
        }

        if(appointment.user.toString() !== request.user._id.toString()) {
            const error = new Error('Acceso No Autorizado'.toUpperCase());

            return response.status(403).json({
                message: error.message,
                type: 'error',
            }) 
        }

        await appointment.deleteOne();

        await sendEmailCancelAppointment({
            date: formatDate(appointment.date),
            time: appointment.time
        });

        response.json({
            message: 'Cita Eliminada Correctamente'.toUpperCase(),
            type: 'success',
        });
    } catch (error) {
        console.log(error)
    }
}

export { 
    getAppointmentsByDate,
    createAppointment, 
    getAppointment,
    updateAppointment,
    deleteAppointment,
};