import { Link } from '../lib/router';

export function CheckoutResultPage({ type }) {
  const isSuccess = type === 'success';
  return (
    <section className="panel stack-md">
      <h1>{isSuccess ? 'Payment Success' : 'Checkout Cancelled'}</h1>
      <p className="small-text">{isSuccess ? 'Your purchase has been recorded. Subscription/order state will sync after webhook confirmation.' : 'No charges were completed. You can retry anytime.'}</p>
      <div className="row wrap">
        <Link className="btn btn-primary" to="/pricing">Back to Pricing</Link>
        <Link className="btn btn-ghost" to="/profile">Go to Profile</Link>
      </div>
    </section>
  );
}
