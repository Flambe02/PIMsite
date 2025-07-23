import React from "react";
import { useSupabase } from "@/components/supabase-provider";
import { useParams } from "next/navigation";

interface OAuthLoginButtonProps {
  provider?: string;
  label?: string;
  className?: string;
  onClick?: () => void | Promise<void>;
  loading?: boolean;
  locale?: string;
}

export function OAuthLoginButton({ provider = 'google', label = 'Entrar com Google', className = '', onClick, loading = false, locale }: OAuthLoginButtonProps) {
  const { supabase } = useSupabase();
  const params = useParams();
  const effectiveLocale = locale || (typeof params?.locale === 'string' ? params?.locale : Array.isArray(params?.locale) ? params?.locale[0] : 'br');
  const handleOAuth = async () => {
    await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/${effectiveLocale}/auth/callback` : undefined
      }
    });
  };
  return (
    <button
      type="button"
      onClick={onClick || handleOAuth}
      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white border border-gray-300 shadow-sm text-gray-800 font-semibold text-lg hover:bg-gray-50 transition ${className}`}
      disabled={loading}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
      ) : provider === 'google' && (
        <svg className="w-6 h-6" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.09 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.36 46.1 31.45 46.1 24.55z"/><path fill="#FBBC05" d="M9.67 28.09c-1.09-3.25-1.09-6.74 0-9.99l-7.98-6.2C-1.13 17.09-1.13 30.91 1.69 36.11l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.18 0 11.64-2.04 15.54-5.54l-7.19-5.6c-2.01 1.35-4.58 2.14-8.35 2.14-6.38 0-11.87-3.59-14.33-8.84l-7.98 6.2C6.73 42.52 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
      )}
      {label}
    </button>
  );
}
export default OAuthLoginButton; 