import 'dotenv/config';

// Fonction de test pour la détection de pages dupliquées
function testDuplicatePagesDetection() {
  console.log('🧪 Test de détection de pages dupliquées');
  console.log('==========================================');

  // Test avec des pages dupliquées
  const duplicatePayslipText = `
    Recibo de Pagamento de Salário
    Empresa: Tech Corp Ltda
    Funcionário: João Silva
    Cargo: Desenvolvedor
    Período: Janeiro 2024
    SALÁRIO BRUTO: R$ 5.000,00
    SALÁRIO LÍQUIDO: R$ 3.800,00
    DESCONTOS: R$ 1.200,00
    
    Recibo de Pagamento de Salário
    Empresa: Tech Corp Ltda
    Funcionário: Maria Santos
    Cargo: Analista
    Período: Janeiro 2024
    SALÁRIO BRUTO: R$ 4.000,00
    SALÁRIO LÍQUIDO: R$ 3.200,00
    DESCONTOS: R$ 800,00
  `;

  console.log('📁 Test avec pages dupliquées');
  console.log('📄 Contenu original:');
  console.log(duplicatePayslipText);
  console.log();

  // Simuler la détection de pages dupliquées
  console.log('🔍 Test détection de pages dupliquées...');
  
  const textLower = duplicatePayslipText.toLowerCase();
  
  // Mots-clés qui indiquent le début d'une feuille de paie
  const payslipStartKeywords = [
    'recibo de pagamento de salário',
    'comprovante de pagamento',
    'holerite',
    'contracheque',
    'bulletin de paie',
    'salaire',
    'paiement'
  ];
  
  // Chercher les occurrences multiples
  const occurrences: number[] = [];
  payslipStartKeywords.forEach(keyword => {
    let index = textLower.indexOf(keyword);
    while (index !== -1) {
      occurrences.push(index);
      index = textLower.indexOf(keyword, index + 1);
    }
  });
  
  // Trier les occurrences par position
  occurrences.sort((a, b) => a - b);
  
  console.log('🔍 Occurrences trouvées:', occurrences);
  console.log('📊 Positions:', occurrences.map(pos => `${pos}: "${duplicatePayslipText.substring(pos, pos + 30)}..."`));
  
  if (occurrences.length > 1) {
    console.log('🔄 Páginas duplicadas detectadas:', occurrences.length, 'ocorrências');
    
    // Prendre la première occurrence (la plus petite position)
    const firstOccurrence = occurrences[0];
    
    // Chercher la fin de la première feuille de paie
    let endOfFirstPayslip = duplicatePayslipText.length;
    
    // Chercher le début de la deuxième occurrence
    if (occurrences.length > 1) {
      endOfFirstPayslip = occurrences[1];
    }
    
    // Extraire seulement la première feuille de paie
    const processedText = duplicatePayslipText.substring(firstOccurrence, endOfFirstPayslip);
    
    console.log('✅ Primeira página extraída:');
    console.log(processedText);
    console.log();
    
    console.log('📊 Estatísticas:');
    console.log('- Texto original:', duplicatePayslipText.length, 'caracteres');
    console.log('- Texto processado:', processedText.length, 'caracteres');
    console.log('- Redução:', Math.round((1 - processedText.length / duplicatePayslipText.length) * 100), '%');
    
  } else {
    console.log('✅ Nenhuma página duplicada detectada');
  }

  console.log('✅ Test terminé');
}

testDuplicatePagesDetection(); 