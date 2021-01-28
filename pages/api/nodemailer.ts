import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'FastMail',
    auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
    },
});

export default async function handler(req, res) {

    res.setHeader('Content-Type', 'application/json');
    const { name, email, message } = JSON.parse(req.body);

    try {

        // Send mail with defined transport object
        await transporter.sendMail({
            to: process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
            from: process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
            replyTo: email,
            subject: `Hello from ${name}`,
            text: message,
            html: `<p>${message}</p>`,
        });

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true }));
    } catch (error) {
        console.log(error, 'error');
        res.statusCode = error.code;
        res.end(JSON.stringify(error.message));
    }
}