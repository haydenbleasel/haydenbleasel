import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<APIResponse>) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(404).send({ error: "Begone." });
  }

  try {
    const { uid, passphrase } = JSON.parse(req.body);

    if (!uid || !passphrase) {
      throw new Error("Please provide a passphrase.");
    }

    const secret = process.env[`NEXT_PUBLIC_PASSPHRASE_${uid.toUpperCase()}`];

    if (!secret) {
      throw new Error("Passphrase has not been set up for this project.");
    }

    if (secret !== passphrase) {
      throw new Error("Passphrase is not correct.");
    }

    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
