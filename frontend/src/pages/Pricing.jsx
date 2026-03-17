import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui';

export default function Pricing() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/plans')
      .then(({ data }) => setPlans(data))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, []);

  const currentPlanSlug = user?.planId?.slug;

  if (loading) return <LoadingSpinner label="Loading plans..." />;

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Choose your plan
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Upgrade anytime to list more properties and unlock features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = currentPlanSlug === plan.slug;
          const isPro = plan.slug === 'pro';
          return (
            <div
              key={plan._id}
              className={`rounded-2xl border-2 p-6 flex flex-col ${
                isPro
                  ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-900/20 dark:border-sky-500'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
              }`}
            >
              {isPro && (
                <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wide mb-2">
                  Popular
                </span>
              )}
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  ${plan.priceMonthly}
                </span>
                <span className="text-slate-500 dark:text-slate-400">/month</span>
              </div>
              {plan.priceYearly > 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  or ${plan.priceYearly}/year (save 2 months)
                </p>
              )}
              <ul className="mt-6 space-y-3 flex-1">
                {plan.features?.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <svg className="w-5 h-5 text-sky-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                {isCurrent ? (
                  <span className="block w-full py-2.5 text-center rounded-lg font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                    Current plan
                  </span>
                ) : (
                  <button
                    type="button"
                    className={`block w-full py-2.5 rounded-lg font-medium text-center transition-colors ${
                      isPro
                        ? 'bg-sky-500 text-white hover:bg-sky-600'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {plan.priceMonthly === 0 ? 'Get started' : 'Upgrade'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Need a custom plan? Contact us for enterprise pricing.
      </p>
    </div>
  );
}
