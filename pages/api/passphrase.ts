export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  try {
    const { uid, passphrase } = JSON.parse(req.body);

    if (!uid || !passphrase) {
      throw new Error('Please provide a passphrase.');
    }

    const secret = process.env[`NEXT_PUBLIC_PASSPHRASE_${uid.toUpperCase()}`];

    if (!secret) {
      throw new Error('Passphrase has not been set up for this project.');
    }

    if (secret !== passphrase) {
      throw new Error("Passphrase is not correct.");
    }

    res.statusCode = 200;
    res.json({ success: true });
  } catch (error) {
    res.statusCode = 500;
    res.json({ message: error.message });
  }
}
