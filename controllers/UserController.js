import Appointment	from '../models/Appointment.js';
import { handleInternalServerError } from '../utils/index.js';

const getUserAppointments = async (request, response) => { 
    const { user } = request.params;

    if(user !== request.user._id.toString()) {
        const error = new Error('Acceso No Autorizado'.toUpperCase());
        return response.status(400).json({
            message: error.message,
            type: 'error',
        });
    }

    try {
        const query = request.user.admin ? 
            {date: {$gte: new Date()}} : {user, date: {$gte: new Date()}};

        const appointments = await Appointment.find(query).populate('services').populate({
            path: 'user',
            select: 'name email',
        }).sort({date: 'asc'});

        response.json(appointments);
    } catch (error) {
        handleInternalServerError('Ocurrio un Error al Obtener las Citas', response);
    }
}


export {
    getUserAppointments,
}