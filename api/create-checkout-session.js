const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  p1: "price_1SpPjAKXxUK3uxiUU3NTwdQQ",
  p2: "price_1SpmiXKXxUK3uxiUAZHfuE6l",
  p3: "price_1SpmihKXxUK3uxiUISYDKpSR",
};

module.exports = async (req, res) => {
  // CORS for BlinkWebHost
  res.setHeader("Access-Control-Allow-Origin", "https://fpsecondpage.adelinfp.blog");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email, product, fp_tid } = req.body || {};

    if (!email || !product) {
      return res.status(400).json({ error: "Missing email or product" });
    }

    const price = PRICES[product];
    if (!price) {
      return res.status(400).json({ error: "Invalid product" });
    }

    const baseUrl = process.env.BASE_URL || "https://fpsecondpage.adelinfp.blog";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price, quantity: 1 }],
      customer_email: email,
      success_url: `${baseUrl}/success.html`,
      cancel_url: `${baseUrl}/cancel.html`,
      metadata: {
        fp_tid: fp_tid || ""
      }
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
