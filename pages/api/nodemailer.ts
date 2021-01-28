import nodemailer from 'nodemailer';
import formidable from 'formidable';

type FormidablePromise = {
    fields: any,
    files: any,
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
    return new Promise(function (resolve, reject) {
        var form = new formidable.IncomingForm(opts)
        form.parse(req, function (
            error: Error,
            fields: any,
            files: any,
        ) {
            if (error) {
                return reject(error);
            }
            resolve({ fields, files });
        });
    });
};

export default async function handler(req, res) {

    res.setHeader('Content-Type', 'application/json');
    
    try {
        const { fields, files } = await formidablePromise(req, {});
        const fileArray: NodemailerFile[] = Object.values(files);

        await transporter.sendMail({
            to: process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
            from: process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
            replyTo: fields.email,
            subject: `Hello from ${fields.name}`,
            text: fields.message,
            html: `<p>${fields.message}</p>`,
            attachments: fileArray.map(({ name, path, type }) => ({
                filename: name,
                path: path,
                contentType: type,
            })),
        });

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true }));
    } catch (error) {
        console.log(error, 'error');
        res.statusCode = error.code;
        res.end(JSON.stringify(error.message));
    }
}