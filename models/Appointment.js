import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
    services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',   
        }
    ],
    date: {
        type: Date,
        required: true,
        trim: true,
    },
    time: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Appointment = mongoose.model('Appointments', appointmentSchema);

export default Appointment;