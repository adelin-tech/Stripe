const express = require("express");
const Stripe = require("stripe");

const app = express();
app.use(express.json());
app.use(express.static(".")); 

const stripe = Stripe("process.env.STRIPE_SECRET_KEY");

const PRICES = {
  p1: "price_1SpPjAKXxUK3uxiUU3NTwdQQ",  
  p2: "price_1SpmiXKXxUK3uxiUAZHfuE6l",  
  p3: "price_1SpmihKXxUK3uxiUISYDKpSR",  
};
a
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { email, product, fp_tid } = req.body;

    const price = PRICES[product];
    if (!price) return res.status(400).json({ error: "Invalid product" });

    const baseUrl = process.env.BASE_URL || "http://localhost:4242";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${baseUrl}/success.html`,
      cancel_url: `${baseUrl}/cancel.html`,
      metadata: {
        fp_tid: fp_tid || "",   
      },
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(4242, () => console.log("Server running on http://localhost:4242"));
