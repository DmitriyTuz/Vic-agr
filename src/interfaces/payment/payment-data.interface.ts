export interface PaymentDataInterface {
  agree: boolean;
  cardType: string;
  exp_month: number;
  exp_year: number;
  number: number;
  token: string;
  nameOnCard?: string;
}