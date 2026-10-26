import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, LoaderCircle, XCircle } from 'lucide-react';
import api from '../api/api';

export default function PaymentCallback() {
  const [params] = useSearchParams();
  const reference = params.get('reference') || params.get('trxref');
  const [state, setState] = useState('verifying');
  const [message, setMessage] = useState('Verifying your payment securely...');

  useEffect(() => {
    let cancelled = false;
    if (!reference) { setState('failed'); setMessage('Missing transaction reference.'); return; }
    api.post('/billing/confirm/', { reference })
      .then(r => { if (!cancelled) { setState(r.data.verified ? 'success' : 'failed'); setMessage(r.data.verified ? 'Payment verified. Your subscription has been updated.' : 'Payment could not be confirmed.'); } })
      .catch(err => { if (!cancelled) { setState('failed'); setMessage(err.response?.data?.detail || 'Verification is pending. Please try again later.'); } });
    return () => { cancelled = true; };
  }, [reference]);

  return <main className="flex min-h-[75vh] items-center justify-center bg-[#F8F9FF] px-4 py-10">
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      {state === 'verifying' ? <LoaderCircle size={42} className="mx-auto animate-spin text-[#5145E5]" /> : state === 'success' ? <CheckCircle2 size={42} className="mx-auto text-emerald-600" /> : <XCircle size={42} className="mx-auto text-red-600" />}
      <h1 className="mt-4 text-xl font-extrabold text-[#18124A]">{state === 'success' ? 'Payment confirmed' : state === 'failed' ? 'Verification incomplete' : 'Checking payment'}</h1>
      <p className="mt-3 text-sm text-slate-600">{message}</p>
      <Link to="/subscription" className="mt-6 inline-flex rounded-xl bg-[#5145E5] px-5 py-3 text-sm font-bold text-white">Go to My Subscription</Link>
    </div>
  </main>;
}