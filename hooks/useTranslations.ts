'use client';

import { useParams } from 'next/navigation';
import { getMessages, isValidLocale } from '@/lib/i18n-simple';

export function useTranslations() {
  const params = useParams();
  const locale = params?.locale as string;
  
  if (!isValidLocale(locale)) {
    return getMessages('br');
  }
  
  return getMessages(locale);
} 