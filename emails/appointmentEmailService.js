import {createTransport} from '../config/nodemailer.js'

export async function sendEmailNewAppointment({date, time}) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS
    );

    await transporter.sendMail({
        from: '"Appsalon" <appsalon@mevn.com>',
        to: "admin@appsalon.com",
        subject: 'AppSalon - Nueva Cita',
        text: 'AppSalon - Nueva Cita',
        html: `
        <p>
            Hola Admin AppSalon Tienes una nueva Cita:
        </p>

        <p>
            Hay una nueva Cita agendada para el dia ${date} a las ${time} Horas.
        </p>
        `,
    });
}


export async function sendEmailUpdateAppointment({date, time}) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS
    );

    await transporter.sendMail({
        from: '"Appsalon" <appsalon@mevn.com>',
        to: "admin@appsalon.com",
        subject: 'AppSalon - Cita Actualizada',
        text: 'AppSalon - Cita Actualizada',
        html: `
        <p>
            Hola Admin AppSalon Un Usuario ha actualizado su Cita:
        </p>

        <p>
            La Cita sera agendada para el dia ${date} a las ${time} Horas.
        </p>
        `,
    });
}


export async function sendEmailCancelAppointment({date, time}) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS
    );

    await transporter.sendMail({
        from: '"Appsalon" <appsalon@mevn.com>',
        to: "admin@appsalon.com",
        subject: 'AppSalon - Cita Cancelada',
        text: 'AppSalon - Cita Cancelada',
        html: `
        <p>
            Hola Admin AppSalon Un Usuario ha cancelado su Cita:
        </p>

        <p>
            La Cita estaba agendada para el dia ${date} a las ${time} Horas.
        </p>
        `,
    });
}