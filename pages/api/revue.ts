import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<APIResponse>) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(404).send({ error: "Begone." });
  }

  try {
    const response = await fetch("https://www.getrevue.co/api/v2/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${
          process.env.NEXT_PUBLIC_REVUE_API_KEY as string
        }`,
      },
      body: JSON.stringify({
        email: JSON.parse(req.body).email,
        double_opt_in: false,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.email);
    }

    res.status(200).json({});
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
