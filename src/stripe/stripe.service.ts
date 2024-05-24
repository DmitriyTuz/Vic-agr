import { Injectable } from '@nestjs/common';

import Stripe from 'stripe';
import credentials from '@src/lib/credentials';
const stripe = new Stripe(credentials.config.STRIPE_SECRET_KEY);
import * as _ from 'underscore';
import * as moment from 'moment';
import {User} from "@src/entities/user/user.entity";

interface SubscriptionData {
  customer: string;
  price: string;
}

@Injectable()
export class StripeService {

  async createSubscribers(data: SubscriptionData, user: User) {
    // cus_Ja3GHQVWon6AFB, price_1Iwt9l285d61s2cI8Z2BSUCY
    const { customer, price } = data;
    const stripeQuery = {
      customer,
      items: [{ price }],
    };

    const sub = await stripe.subscriptions.create(stripeQuery);
    console.log('!!! sub = ', sub)
    return sub
  }

  async cancelSubscribe(id) {
    return stripe.subscriptions.cancel(id);
  }

  async customerCreate(token, phone, name) {
    return stripe.customers.create({source: token, phone: phone, name: name});
  }

  // https://stripe.com/docs/api/plans/create
  async createPlan(data) {
    // 2000, USD, month, prod_HKL5XT1MkHHBkE
    let plansData = _.pick(data, ['amount', 'currency', 'interval', 'product', 'active']);
    return stripe.plans.create(plansData);
  };

  // https://stripe.com/docs/api/products/create
  async createProduct(name) {
    return stripe.products.create({
      name: name,
    });
  };

  checkTrialDays(currentDate, trialDate) {
    const diff = +moment(currentDate, 'x').diff(moment(trialDate, 'x'), 'day');
    return diff >= 15;
  };
}
