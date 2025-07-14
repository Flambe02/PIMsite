'use client';

import { NextIntlClientProvider } from 'next-intl';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await import(`../../../locales/${params.locale}.json`).then(m => m.default);

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
} 