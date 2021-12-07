import type { NextApiHandler } from 'next';

// eslint-disable-next-line camelcase, @typescript-eslint/naming-convention
const double_opt_in = false;

const handler: NextApiHandler<{
  error?: string;
}> = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(404).send({ error: 'Begone.' });
  }

  const { body } = req as { body: string };
  const { email } = JSON.parse(body) as { email: string };

  if (!email) {
    return res.status(400).send({ error: 'No email provided.' });
  }

  if (!process.env.NEXT_PUBLIC_REVUE_API_KEY) {
    return res.status(500).send({ error: 'No API key.' });
  }

  try {
    const response = await fetch('https://www.getrevue.co/api/v2/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${process.env.NEXT_PUBLIC_REVUE_API_KEY}`,
      },
      // eslint-disable-next-line camelcase, @typescript-eslint/naming-convention
      body: JSON.stringify({ email, double_opt_in }),
    });

    const data = (await response.json()) as {
      error?: { message: string; email?: string };
    };

    if (data.error) {
      throw new Error(data.error.email);
    }

    return res.status(200).json({});
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return res.status(500).json({ error: "Couldn't subscribe." });
  }
};

export default handler;
