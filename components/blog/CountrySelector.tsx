"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCountry, Country } from '@/hooks/useCountry';
import { ChevronDown, Globe } from 'lucide-react';

interface CountrySelectorProps {
  variant?: 'dropdown' | 'buttons';
  className?: string;
}

export function CountrySelector({ variant = 'dropdown', className = '' }: CountrySelectorProps) {
  const { currentCountry, changeCountry, availableCountries, isLoading } = useCountry();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Globe className="w-4 h-4 animate-pulse" />
        <span className="text-sm text-gray-500">Carregando...</span>
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {availableCountries.map((country) => (
          <Button
            key={country.code}
            variant={currentCountry === country.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => changeCountry(country.code)}
            className="flex items-center gap-2"
          >
            <span>{country.flag}</span>
            <span className="hidden sm:inline">{country.name}</span>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="w-4 h-4 text-gray-500" />
      <Select value={currentCountry} onValueChange={(value) => changeCountry(value as Country)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span>{availableCountries.find(c => c.code === currentCountry)?.flag}</span>
              <span>{availableCountries.find(c => c.code === currentCountry)?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableCountries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <div className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 