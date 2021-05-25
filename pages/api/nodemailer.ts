import nodemailer from 'nodemailer';
import formidable from 'formidable';

type Fields = {
    name: string,
    message: string,
    email: string,
}

type FormidablePromise = {
    fields: Fields,
    files?: any,
}

interface NodemailerFile extends File {
    path: string;
}

const transporter = nodemailer.createTransport({
    service: 'FastMail',
    auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
    },
});

export const config = {
    api: {
        bodyParser: false,
    },
}

function formidablePromise(req, opts): Promise<FormidablePromise> {
    return new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm(opts);
        
        form.parse(req, (
            error: Error,
            fields: any,
            files: any,
        ) => {
            if (error) {
                return reject(error);
            }
            resolve({ fields, files });
        });
    });
};

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(404).send('Begone.');
    }

    res.setHeader('Content-Type', 'application/json');
    
    try {
        const { fields, files } = await formidablePromise(req, {});
        const fileArray: NodemailerFile[] = Object.values(files);
        const { name, email, message } = fields;

        if (!name || !name.trim()) {
            throw new Error('Please provide a valid name.')
        }

        if (!email || !email.trim()) {
            throw new Error('Please provide a valid email address.')
        }

        if (!message || !message.trim()) {
            throw new Error('Please provide a valid email message.');
        }

        await transporter.sendMail({
            to: process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
            from: process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
            replyTo: email,
            subject: `Hello from ${name}`,
            text: message,
            html: `<p>${message.replace(/(?:\r\n|\r|\n)/g, '<br>')}</p>`,
            attachments: fileArray.map(({ name, path, type }) => ({
                filename: name,
                path: path,
                contentType: type,
            })),
        });

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true }));
    } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ message: error.message }));
    }
}
