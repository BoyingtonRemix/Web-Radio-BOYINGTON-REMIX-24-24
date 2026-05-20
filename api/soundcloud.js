export default async function handler(req, res) {

  const CLIENT_ID = process.env.SC_CLIENT_ID;
  const CLIENT_SECRET = process.env.SC_CLIENT_SECRET;

  try {

    const tokenResponse = await fetch(
      "https://secure.soundcloud.com/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization":
            "Basic " +
            Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    res.status(200).json(tokenData);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
}
