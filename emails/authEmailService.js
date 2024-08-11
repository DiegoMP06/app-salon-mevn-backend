import {createTransport} from '../config/nodemailer.js'

export async function sendEmailVerification({name, email, token}) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS,
    );

    await transporter.sendMail({
        from: '"Appsalon" <cuentas@appsalon.com>',
        to: email,
        subject: 'AppSalon - Confirma tu Cuenta',
        text: 'AppSalon - Confirma tu Cuenta',
        html: `
        <p>
            Hola ${name}, Confirma tu cuenta en AppSalon.
        </p>

        <p>
            Tu cuenta ya casi esta lista, solo debes confirmarla en el siguiente enlace.
        </p>

        <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">
            Confirmar Cuenta
        </a>

        <p>
            Si tu no creaste esta cuenta puedes ignorar este mensaje.
        </p>
        `,
    });
}

export async function sendEmailPasswordReset({name, email, token}) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS,
    );

    await transporter.sendMail({
        from: '"Appsalon" <cuentas@appsalon.com>',
        to: email,
        subject: 'AppSalon - Restablece tu password',
        text: 'AppSalon - Restablece tu password',
        html: `
        <p>
            Hola ${name}, Has solicitado restablecer tu password de tu cuenta en AppSalon.
        </p>

        <p>
            Sigue el siguiente enlace para restablecer tu password.
        </p>

        <a href="${process.env.FRONTEND_URL}/auth/olvide-password/${token}">
            Confirmar Cuenta
        </a>

        <p>
            Si tu no solicitaste esta accion puedes ignorar este mensaje.
        </p>
        `,
    });
}