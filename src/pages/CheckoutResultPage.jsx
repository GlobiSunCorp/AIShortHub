import { useEffect } from 'react';
import { Link } from '../lib/router';

const TYPE_LABELS = {
  viewer_subscription: 'Viewer Subscription',
  creator_plan: 'Creator Plan',
  addon_purchase: 'Add-on Service Order',
};

const GLOBAL_FLASH_KEY = 'aishorthub.globalFlash';

function writeGlobalFlash(payload) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(GLOBAL_FLASH_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage issues in demo mode
  }
}

function CelebrationBurst() {
  return (
    <div className="celebration-burst" aria-hidden="true">
      <span className="burst-dot burst-1" />
      <span className="burst-dot burst-2" />
      <span className="burst-dot burst-3" />
      <span className="burst-dot burst-4" />
      <span className="burst-dot burst-5" />
      <span className="burst-dot burst-6" />
      <span className="burst-ring burst-r1" />
      <span className="burst-ring burst-r2" />
    </div>
  );
}

function getContextCopy({ checkoutType, planId, orderId, isSuccess }) {
  if (checkoutType === 'viewer_subscription') {
    return {
      title: isSuccess ? 'Viewer membership activated' : 'Viewer membership checkout cancelled',
      hint: isSuccess
        ? `Your ${planId || 'viewer'} plan has been recorded. Next stop: Profile for membership status and Browse for content.`
        : 'No viewer membership charge was completed. You can return to Pricing and try another plan anytime.',
      primaryLabel: isSuccess ? 'Go to Profile' : 'Back to Pricing',
      primaryTo: isSuccess ? '/profile' : '/pricing',
      secondaryLabel: 'Open Browse',
      secondaryTo: '/browse',
      flashTitle: 'Viewer plan updated',
      flashMessage: isSuccess ? `${planId || 'Viewer plan'} is now active on your account.` : 'Viewer checkout was cancelled.',
    };
  }

  if (checkoutType === 'creator_plan') {
    return {
      title: isSuccess ? 'Creator plan activated' : 'Creator plan checkout cancelled',
      hint: isSuccess
        ? `Your ${planId || 'creator'} plan is ready. Open Creator Studio to continue uploads, pricing, and review.`
        : 'No creator plan charge was completed. You can stay on the current plan or retry from Pricing.',
      primaryLabel: isSuccess ? 'Open Creator Studio' : 'Back to Pricing',
      primaryTo: isSuccess ? '/creator#overview' : '/pricing',
      secondaryLabel: 'View creator pricing',
      secondaryTo: '/pricing',
      flashTitle: 'Creator plan updated',
      flashMessage: isSuccess ? `${planId || 'Creator plan'} is now active for your workspace.` : 'Creator checkout was cancelled.',
    };
  }

  if (checkoutType === 'addon_purchase') {
    return {
      title: isSuccess ? 'Service order payment recorded' : 'Service payment cancelled',
      hint: isSuccess
        ? `Order ${orderId || ''} is ready for the next step. Open the order detail page to review scope, status, and follow-up.`
        : 'No add-on service charge was completed. You can return to Services and retry whenever you are ready.',
      primaryLabel: isSuccess ? 'Open order detail' : 'Back to Services',
      primaryTo: isSuccess && orderId ? `/services/${orderId}` : '/services',
      secondaryLabel: 'Open Services',
      secondaryTo: '/services',
      flashTitle: 'Service order updated',
      flashMessage: isSuccess ? `Payment for order ${orderId || ''} was recorded.` : 'Service checkout was cancelled.',
    };
  }

  return {
    title: isSuccess ? 'Payment Success' : 'Checkout Cancelled',
    hint: isSuccess
      ? 'Your purchase has been recorded. Subscription or order access will sync after webhook confirmation.'
      : 'No charges were completed. You can return and retry whenever you are ready.',
    primaryLabel: isSuccess ? 'Go to Profile' : 'Back to Pricing',
    primaryTo: isSuccess ? '/profile' : '/pricing',
    secondaryLabel: 'Back to Home',
    secondaryTo: '/',
    flashTitle: isSuccess ? 'Payment recorded' : 'Checkout cancelled',
    flashMessage: isSuccess ? 'Your purchase was recorded successfully.' : 'No payment was completed.',
  };
}

export function CheckoutResultPage({ type, auth, platform }) {
  const isSuccess = type === 'success';
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const checkoutType = params.get('type') || 'unknown';
  const checkoutLabel = TYPE_LABELS[checkoutType] || 'Payment';
  const planId = params.get('plan') || '';
  const orderId = params.get('orderId') || '';
  const target = params.get('target') || '';
  const context = getContextCopy({ checkoutType, planId, orderId, isSuccess });
  const quickReturnTo = isSuccess && target ? target : context.primaryTo;

  useEffect(() => {
    if (!isSuccess || !auth?.isLoggedIn) return;

    if (checkoutType === 'viewer_subscription' && planId && auth.user?.id) {
      platform?.actions?.setMembershipTier?.(auth.user.id, planId);
    }

    if (checkoutType === 'creator_plan' && planId && auth.user?.id) {
      platform?.actions?.setCreatorPlan?.(auth.user.id, planId);
    }

    if (checkoutType === 'addon_purchase' && orderId) {
      platform?.actions?.updateServiceOrderStatus?.(orderId, 'pending', 'Payment recorded from checkout result page');
    }

    writeGlobalFlash({
      type: 'success',
      title: context.flashTitle,
      message: context.flashMessage,
    });
  }, [auth?.isLoggedIn, auth?.user?.id, checkoutType, context.flashMessage, context.flashTitle, isSuccess, orderId, planId, platform]);

  useEffect(() => {
    if (isSuccess || !context.flashMessage) return;
    writeGlobalFlash({ type: 'error', title: context.flashTitle, message: context.flashMessage });
  }, [context.flashMessage, context.flashTitle, isSuccess]);

  return (
    <section className={`panel stack-md checkout-result ${isSuccess ? 'success' : 'cancel'}`}>
      {isSuccess ? <CelebrationBurst /> : null}
      <span className={`status ${isSuccess ? 'ok' : 'warn'}`}>{isSuccess ? 'Payment completed' : 'Checkout cancelled'}</span>
      <h1>{context.title}</h1>
      <p className="small-text">支付类型：{checkoutLabel}{planId ? ` · ${planId}` : ''}{orderId ? ` · ${orderId}` : ''}。</p>
      <p className="small-text">{context.hint}</p>
      <ul>
        <li>
          {checkoutType === 'viewer_subscription' && isSuccess ? '下一步：在 Profile 查看会员状态，再去 Browse 看完整内容。' : null}
          {checkoutType === 'creator_plan' && isSuccess ? '下一步：在 Creator Studio 检查方案、上传入口、额度和审核流。' : null}
          {checkoutType === 'addon_purchase' && isSuccess ? '下一步：打开订单详情页，看状态、备注和交付进展。' : null}
          {!isSuccess ? '下一步：返回上一个业务页，重新发起支付或更换方案。' : null}
        </li>
        <li>若支付成功但权益未生效，请附上订单号联系 Support。</li>
      </ul>
      <div className="row wrap checkout-actions">
        <Link className="btn btn-primary" to={quickReturnTo}>{context.primaryLabel}</Link>
        <Link className="btn btn-ghost" to={context.secondaryTo}>{context.secondaryLabel}</Link>
        <Link className="btn btn-ghost" to="/profile">Go to Profile</Link>
        <Link className="btn btn-ghost" to="/browse">Continue Browsing</Link>
      </div>
    </section>
  );
}
