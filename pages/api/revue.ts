export default async function handler(req, res) {

    res.setHeader('Content-Type', 'application/json');
    
    try {
        const response = await fetch('https://www.getrevue.co/api/v2/subscribers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${process.env.NEXT_PUBLIC_REVUE_API_KEY as string}`,
            },
            body: JSON.stringify({
                email: JSON.parse(req.body).email,
            }),
        });

        await response.json();

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true }));
    } catch (error) {
        res.statusCode = error.code;
        res.end(JSON.stringify(error.message));
    }
}