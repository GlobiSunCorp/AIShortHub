import { Link } from '../lib/router';

const TYPE_LABELS = {
  viewer_subscription: 'Viewer Subscription',
  creator_plan: 'Creator Plan',
  addon_purchase: 'Add-on Service Order',
};

export function CheckoutResultPage({ type }) {
  const isSuccess = type === 'success';
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const checkoutType = params.get('type') || 'unknown';
  const checkoutLabel = TYPE_LABELS[checkoutType] || 'Payment';

  return (
    <section className="panel stack-md">
      <h1>{isSuccess ? 'Payment Success' : 'Checkout Cancelled'}</h1>
      <p className="small-text">支付类型：{checkoutLabel}。</p>
      <p className="small-text">{isSuccess ? 'Your purchase has been recorded. Subscription/order state will sync after webhook confirmation.' : 'No charges were completed. You can retry anytime.'}</p>
      <ul>
        <li>{isSuccess ? '下一步：进入 Profile 检查订阅或订单状态。' : '下一步：返回 Pricing 或 Services 重新发起支付。'}</li>
        <li>若支付成功但权益未生效，请附上订单号联系 Support。</li>
      </ul>
      <div className="row wrap">
        <Link className="btn btn-primary" to="/pricing">Back to Pricing</Link>
        <Link className="btn btn-ghost" to="/services">Back to Services</Link>
        <Link className="btn btn-ghost" to="/profile">Go to Profile</Link>
      </div>
    </section>
  );
}
