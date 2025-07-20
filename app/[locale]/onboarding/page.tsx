import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMessages, isValidLocale } from "@/lib/i18n-simple";
import OnboardingClient from "./OnboardingClient";

interface OnboardingPageProps {
  params: {
    locale: string;
  };
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale } = params;
  
  // Validation de la locale
  if (!isValidLocale(locale)) {
    redirect('/fr/onboarding');
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect(`/${locale}/login?redirectTo=/${locale}/onboarding`);
  }

  // Vérifier si l'utilisateur a déjà complété l'onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single();

  if (profile?.onboarding_completed) {
    redirect(`/${locale}/dashboard`);
  }

  const messages = getMessages(locale);

  return (
    <OnboardingClient 
      user={user} 
      locale={locale} 
      messages={messages}
    />
  );
} 