import { Injectable } from '@nestjs/common';

import Stripe from 'stripe';
import credentials from '@lib/credentials';
const stripe = new Stripe(credentials.config.STRIPE_SECRET_KEY);

@Injectable()
export class StripeService {
  async createSubscribers(data, user) {
    // cus_Ja3GHQVWon6AFB, price_1Iwt9l285d61s2cI8Z2BSUCY
    const { customer, price } = data;
    const stripeQuery = {
      customer,
      items: [{ price }],
    };

    return stripe.subscriptions.create(stripeQuery);
  }
}
