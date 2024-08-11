import Service from "../models/Service.js";
import { validateObjectId, handleNotFoundError, handleInternalServerError } from "../utils/index.js";

const getServices = async (request, response) => {
    try {
        const services = await Service.find();

        response.json(services);
    } catch (error) {
        console.log(error)
        handleInternalServerError('Ocurrio un Error al Obtener los Servicios', response);
    }
}

const createService = async (request, response) => {
    if(Object.values(request.body).includes('')) {
        const error = new Error('Todos los Campos son Obligatorios'.toUpperCase());

        return response.status(400).json({
            message: error.message,
            type: 'error',
        });
    }

    try {
        const service = new Service(request.body);
        await service.save();

        response.json({
            message: `El Servicio se Creo Correctamente`.toUpperCase(),
            type: 'success',
        });
    } catch (error) {
        console.log(error)
        handleInternalServerError('Ocurrio un Error al Crear el Servicio', response);
    }
}

const getService = async (request, response) => {
    const { id } = request.params;
    if(validateObjectId(id, response)) return;
    const service = await Service.findById(id);
    if(!service) return handleNotFoundError('Servicio No Encontrado', response)

    response.json(service);
}

const updateService = async (request, response) => {
    const { id } = request.params;
    if(validateObjectId(id, response)) return;
    const service = await Service.findById(id);
    if(!service) return handleNotFoundError('Servicio No Encontrado', response)


    service.name = request.body.name || service.name;
    service.price = request.body.price || service.price;

    try {
        await service.save();

        response.json({
            message: `El Servicio se Actualizo Correctamente`.toUpperCase(),
            type: 'success',
        });
    } catch (error) {
        console.log(error)
        handleInternalServerError('Ocurrio un Error al Actualizar el Servicio', response)
    }
}

const deleteService = async (request, response) => {
    const { id } = request.params;
    if(validateObjectId(id, response)) return;
    const service = await Service.findById(id);
    if(!service) return handleNotFoundError('Servicio No Encontrado', response)

    try {
        await service.deleteOne();

        response.json({
            message: `El Servicio se Elimino Correctamente`.toUpperCase(),
            type: 'success',
        });
    } catch (error) {
        handleInternalServerError('Ocurrio un Error al Eliminar el Servicio', response);
    }
}

export {
    getServices,
    createService,
    getService,
    updateService,
    deleteService,
}