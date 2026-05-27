import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
if (!stripeSecret) {
  throw new Error("STRIPE_SECRET_KEY environment variable is required.");
}

const stripe = new Stripe(stripeSecret, {
  apiVersion: '2026-04-22.dahlia' as any,
});

async function main() {
  try {
    const product = await stripe.products.create({
      name: 'PermitWatchDog T0 — Bauamt-Alerts',
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 2900,
      currency: 'eur',
      recurring: { interval: 'month' },
    });

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      after_completion: {
        type: 'redirect',
        redirect: {
          url: 'https://permitwatchdog.vercel.app/danke',
        },
      },
    });

    console.log(`Payment Link URL: ${paymentLink.url}`);
  } catch (err) {
    console.error(err);
  }
}

main();
