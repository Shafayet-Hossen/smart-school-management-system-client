
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  ShieldCheck,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import api from "../../../services/api.js";

const initialSettings = {
  enabled: false,
  mode: "test",
  publishable_key: "",
  secret_key: "",
  currency: "USD",
};

const fetchStripeSettings = async () => {
  const { data } = await api.get(
    "/school-admin/fees/stripe-settings"
  );

  return data.settings;
};

const saveStripeSettings = async (settings) => {
  const { data } = await api.put(
    "/school-admin/fees/stripe-settings",
    settings
  );

  return data;
};

export default function StripeSettings() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(initialSettings);
  const [showSecret, setShowSecret] = useState(false);
  const [clearSecret, setClearSecret] = useState(false);

  const {
    data: settings,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["stripe-settings"],
    queryFn: fetchStripeSettings,
  });

  useEffect(() => {
    if (!settings) return;

    setFormData({
      enabled: settings.enabled ?? false,
      mode: settings.mode ?? "test",
      publishable_key: settings.publishable_key ?? "",
      secret_key: "",
      currency: settings.currency ?? "USD",
    });

    setClearSecret(false);
  }, [settings]);

  const mutation = useMutation({
    mutationFn: saveStripeSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stripe-settings"],
      });
    },
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      enabled: formData.enabled,
      mode: formData.mode,
      publishable_key: formData.publishable_key.trim(),
      currency: formData.currency,
      ...(formData.secret_key.trim()
        ? { secret_key: formData.secret_key.trim() }
        : {}),
      ...(clearSecret ? { clear_secret_key: true } : {}),
    };

    mutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error">
        <span>
          {error?.response?.data?.message ||
            "Failed to load Stripe settings."}
        </span>

        <button
          className="btn btn-sm"
          onClick={() => refetch()}
        >
          Retry
        </button>
      </div>
    );
  }

  const secretConfigured = settings?.secret_key_configured ?? false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-base-content">
          Stripe Settings
        </h1>

        <p className="mt-1 text-sm text-base-content/60">
          Configure Stripe to accept online fee payments
          from students and parents.
        </p>
      </div>

      {/* Information */}
      <div className="alert border border-info/30 bg-info/10">
        <ShieldCheck className="h-6 w-6 text-info" />

        <div>
          <h3 className="font-semibold">
            Secure payment configuration
          </h3>

          <p className="text-sm">
            Your Stripe secret key is stored securely and
            will never be displayed after saving.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body space-y-5">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-primary" />

              <div>
                <h2 className="text-lg font-semibold">
                  Payment Configuration
                </h2>

                <p className="text-sm text-base-content/60">
                  Enable or disable Stripe payments.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-base-200 p-4">
              <div>
                <p className="font-medium">
                  Enable Stripe Payments
                </p>

                <p className="text-sm text-base-content/60">
                  Allow students and parents to pay fees online.
                </p>
              </div>

              <input
                type="checkbox"
                name="enabled"
                className="toggle toggle-primary"
                checked={formData.enabled}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Payment Mode
                  </span>
                </label>

                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="test">Test Mode</option>
                  <option value="live">Live Mode</option>
                </select>

                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    Use Test Mode before accepting real payments.
                  </span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Currency
                  </span>
                </label>

                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="BDT">BDT - Bangladeshi Taka</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="INR">INR - Indian Rupee</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body space-y-5">
            <div>
              <h2 className="text-lg font-semibold">
                Stripe API Keys
              </h2>

              <p className="text-sm text-base-content/60">
                Get your API keys from your Stripe Dashboard.
              </p>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Publishable Key
                </span>
              </label>

              <input
                type="text"
                name="publishable_key"
                value={formData.publishable_key}
                onChange={handleChange}
                placeholder="pk_test_..."
                className="input input-bordered w-full"
                autoComplete="off"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Secret Key
                </span>

                {secretConfigured && (
                  <span className="badge badge-success badge-sm">
                    Configured
                  </span>
                )}
              </label>

              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  name="secret_key"
                  value={formData.secret_key}
                  onChange={handleChange}
                  placeholder={
                    secretConfigured
                      ? "Enter a new key to replace the saved key"
                      : "sk_test_..."
                  }
                  className="input input-bordered w-full pr-12"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60"
                  onClick={() => setShowSecret((value) => !value)}
                  aria-label={
                    showSecret ? "Hide secret key" : "Show secret key"
                  }
                >
                  {showSecret ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Leave blank to keep the existing secret key.
                </span>
              </label>

              {secretConfigured && (
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-error"
                    checked={clearSecret}
                    onChange={(event) => {
                      setClearSecret(event.target.checked);
                      if (event.target.checked) {
                        setFormData((previous) => ({
                          ...previous,
                          secret_key: "",
                        }));
                      }
                    }}
                  />

                  <span className="label-text text-error">
                    Remove saved secret key
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-base-content/60">
            Changes apply to this school only.
          </p>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn btn-primary"
          >
            {mutation.isPending ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Settings
              </>
            )}
          </button>
        </div>

        {mutation.isSuccess && (
          <div className="alert alert-success">
            Stripe settings saved successfully.
          </div>
        )}

        {mutation.isError && (
          <div className="alert alert-error">
            {mutation.error?.response?.data?.message ||
              "Failed to save Stripe settings."}
          </div>
        )}
      </form>
    </div>
  );
}
