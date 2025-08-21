# E. Visual Snapshot (Textual DOM Outline)

Locale: BR (/br/dashboard)

- Header (sticky)
- Grid: Sidebar (lg), Main Content (10 cols)
  - Sidebar nav buttons (labels): Overview, Salário, Benefícios, Seguros, Investimentos, Well-being, Direitos Sociais, Histórico & Documentos, Dados
  - Main > Overview (when active)
    - Overview component (loading fallback via dynamic import)
  - Main > Salário (when active)
    - 3–4 summary cards: Salário Bruto, Salário Líquido, Descontos, Eficiência
    - AIRecommendations (list)
    - PersonalizedRecommendations
    - General recommendations (3 cards)
  - Main > Benefícios
    - Beneficios component with actionLink to recursos
  - Right column (lg only)
    - FinancialCheckupSummaryCard (latestCheckup)
    - PayslipAnalysisDetail (modal when active)
  - Bottom (mobile only)
    - DashMobileTabBar (activeTab, onTabChange)

Locale: FR (/fr/dashboard)

- Structure identical, content labels in FR
