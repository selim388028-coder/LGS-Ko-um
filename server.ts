import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to get Stripe instance safely
  const getStripe = () => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key.includes('your_')) return null;
    return new Stripe(key);
  };

  // Stripe Checkout Session
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { userId, userEmail } = req.body;
      
      const stripeInstance = getStripe();
      if (!stripeInstance) {
        return res.status(200).json({ 
          error: "Stripe is not configured. Use mock flow.",
          isMock: true 
        });
      }

      const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "try",
              product_data: {
                name: "LGS Koçum - Kazananlar Planı",
                description: "Aylık Premium Üyelik",
              },
              unit_amount: 35900, // 359.00 TL
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/payment?canceled=true`,
        customer_email: userEmail,
        metadata: {
          userId: userId,
        },
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Verify Payment (Simple version for demo, ideally use webhooks)
  app.get("/api/verify-payment", async (req, res) => {
    try {
      const { session_id } = req.query;
      if (!session_id) return res.status(400).json({ error: "Missing session_id" });

      const stripeInstance = getStripe();
      if (!stripeInstance) {
        return res.status(400).json({ error: "Stripe is not configured" });
      }

      const session = await stripeInstance.checkout.sessions.retrieve(session_id as string);
      if (session.payment_status === "paid") {
        res.json({ success: true, userId: session.metadata?.userId });
      } else {
        res.json({ success: false });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
