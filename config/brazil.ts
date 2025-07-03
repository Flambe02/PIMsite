export const brazilConfig = {
  currency: 'BRL',
  salaryBrackets: [
    { min: 0, max: 1320, rate: 0.075 },
    { min: 1320.01, max: 2571.29, rate: 0.09 },
    { min: 2571.30, max: 3856.94, rate: 0.12 },
    { min: 3856.95, max: 7507.49, rate: 0.14 },
  ],
  benefitProviders: ['Edenred', 'Pluxee', 'Alelo'],
  contractTypes: ['CLT', 'PJ', 'Estagiário', 'Autônomo'],
  dateFormat: 'dd/MM/yyyy',
} 