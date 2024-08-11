import JWT from 'jsonwebtoken';
import User from  '../models/User.js';

const authMiddleware = async (request, response, next) => {
    if(request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const decoded = JWT.verify(token, process.env.JWT_SECRET);

            request.user = await User.findById(decoded.id).select('-password -verified -token -__v');

            if(!request.user) {
                const error = new Error('Token no Valido');
                return response.status(403).json({
                    message: error.message
                });
            }
            
            next();
        } catch {
            const error = new Error('Token no Valido');

            response.status(403).json({
                message: error.message
            });
        }

        return;
    } 
    
    const error = new Error('No Autorizado');

    response.status(403).json({
        message: error.message
    });
}

export default authMiddleware;