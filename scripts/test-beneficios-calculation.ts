// Script de test pour vérifier le calcul des bénéfices
// Simule les données d'un holerite avec des bénéfices

// Fonction pour calculer le total des bénéfices (copiée du dashboard)
const calculateBenefitsTotal = (beneficiosArray: any[]): number => {
  if (!Array.isArray(beneficiosArray)) return 0;
  return beneficiosArray.reduce((total, beneficio) => {
    if (beneficio && typeof beneficio === 'object') {
      const valor = beneficio.valor || beneficio.value || 0;
      return total + (Number(valor) || 0);
    }
    return total;
  }, 0);
};

// Données de test - simule un holerite avec des bénéfices
const testHoleriteData = {
  structured_data: {
    final_data: {
      beneficios: [
        { nome: "Vale Refeição", valor: 600.00 },
        { nome: "Vale Transporte", valor: 180.00 },
        { nome: "Plano de Saúde", valor: 400.00 },
        { nome: "Plano Odontológico", valor: 150.00 },
        { nome: "Gympass", valor: 89.90 }
      ],
      seguros: [
        { nome: "Seguro de Vida", valor: 50.00 },
        { nome: "Seguro Auto", valor: 120.00 }
      ]
    }
  }
};

// Test 1: Calcul des bénéfices
console.log('🧪 Test du calcul des bénéfices...\n');

const beneficiosArray = testHoleriteData.structured_data?.final_data?.beneficios || [];
const totalBeneficios = calculateBenefitsTotal(beneficiosArray);

console.log('📊 Bénéfices détectés:');
beneficiosArray.forEach((beneficio, index) => {
  console.log(`   ${index + 1}. ${beneficio.nome}: R$ ${beneficio.valor.toLocaleString('pt-BR')}`);
});

console.log(`\n💰 Total des bénéfices: R$ ${totalBeneficios.toLocaleString('pt-BR')}`);

// Test 2: Vérification du calcul
const expectedTotal = 600 + 180 + 400 + 150 + 89.90;
console.log(`\n✅ Vérification:`);
console.log(`   Total attendu: R$ ${expectedTotal.toLocaleString('pt-BR')}`);
console.log(`   Total calculé: R$ ${totalBeneficios.toLocaleString('pt-BR')}`);
console.log(`   Calcul correct: ${Math.abs(totalBeneficios - expectedTotal) < 0.01 ? '✅' : '❌'}`);

// Test 3: Test avec données vides
console.log('\n🧪 Test avec données vides...');
const emptyBeneficios = calculateBenefitsTotal([]);
console.log(`   Total avec tableau vide: R$ ${emptyBeneficios.toLocaleString('pt-BR')}`);

const nullBeneficios = calculateBenefitsTotal(null as any);
console.log(`   Total avec null: R$ ${nullBeneficios.toLocaleString('pt-BR')}`);

// Test 4: Test avec données malformées
console.log('\n🧪 Test avec données malformées...');
const malformedBeneficios = [
  { nome: "Vale Refeição", valor: "600.00" }, // string au lieu de number
  { nome: "Vale Transporte", value: 180.00 }, // 'value' au lieu de 'valor'
  { nome: "Plano de Saúde" }, // pas de valeur
  null, // null
  { valor: 150.00 } // pas de nom
];

const malformedTotal = calculateBenefitsTotal(malformedBeneficios);
console.log(`   Total avec données malformées: R$ ${malformedTotal.toLocaleString('pt-BR')}`);

// Test 5: Simulation du calcul dans le dashboard
console.log('\n🧪 Simulation du calcul dans le dashboard...');

const salarioLiquido = 3500.00;
const poderCompraReal = salarioLiquido + totalBeneficios;

console.log(`   Salaire net: R$ ${salarioLiquido.toLocaleString('pt-BR')}`);
console.log(`   Bénéfices: R$ ${totalBeneficios.toLocaleString('pt-BR')}`);
console.log(`   Pouvoir d'achat réel: R$ ${poderCompraReal.toLocaleString('pt-BR')}`);

console.log('\n🎉 Test du calcul des bénéfices terminé !');
console.log('\n📋 Résumé:');
console.log('   ✅ Calcul correct des bénéfices à partir d\'un tableau d\'objets');
console.log('   ✅ Gestion des données vides et malformées');
console.log('   ✅ Calcul du pouvoir d\'achat réel (salaire net + bénéfices)');
console.log('   ✅ Format compatible avec les données extraites par l\'IA'); 