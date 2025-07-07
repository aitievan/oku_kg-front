import { loadStripe } from '@stripe/stripe-js';

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export const createCheckoutSession = async (cartItems) => {
    const response = await api.post('/user/orders/create', {
      items: cartItems,
      success_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/payment/cancel`
    });
    return response.data.sessionId;
  };
  

export default getStripe;