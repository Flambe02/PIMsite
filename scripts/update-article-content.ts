import 'dotenv/config';
import { sanityClient } from '@/lib/sanity/config';

console.log('📝 Mise à jour du contenu de l\'article');
console.log('======================================\n');

async function updateArticleContent() {
  try {
    const articleId = '1ff962da-81cf-4978-a3aa-7b500d6e9e7c'; // ID de l'article trouvé
    
    // Nouveau contenu pour l'article
    const newBody = [
      {
        _type: 'block',
        _key: 'intro',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'intro-text',
            text: 'Seu holerite é um documento fundamental que contém informações importantes sobre sua remuneração, benefícios e descontos. Entender cada campo pode ajudar você a otimizar seus ganhos e identificar oportunidades de melhoria.',
            marks: []
          }
        ],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'section1',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'section1-title',
            text: 'Principais campos do holerite',
            marks: []
          }
        ],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'section1-content',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'section1-text',
            text: 'O holerite brasileiro contém várias seções importantes:',
            marks: []
          }
        ],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'list1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'list1-item1',
            text: '• Remuneração: Salário base, adicionais e benefícios',
            marks: []
          }
        ],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'list2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'list2-item2',
            text: '• Descontos: INSS, IRRF e outros descontos obrigatórios',
            marks: []
          }
        ],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'list3',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'list3-item3',
            text: '• Benefícios: Vale refeição, vale transporte, plano de saúde',
            marks: []
          }
        ],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'section2',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'section2-title',
            text: 'Como otimizar seus ganhos',
            marks: []
          }
        ],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'section2-content',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'section2-text',
            text: 'Analisando seu holerite regularmente, você pode identificar oportunidades para:',
            marks: []
          }
        ],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'list4',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'list4-item1',
            text: '• Negociar melhores benefícios com seu empregador',
            marks: []
          }
        ],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'list5',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'list5-item2',
            text: '• Verificar se todos os descontos estão corretos',
            marks: []
          }
        ],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'list6',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'list6-item3',
            text: '• Planejar investimentos e economias',
            marks: []
          }
        ],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'conclusion',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'conclusion-text',
            text: 'Use nossa ferramenta de análise de holerite para obter insights personalizados sobre seus benefícios e oportunidades de otimização salarial.',
            marks: []
          }
        ],
        markDefs: []
      }
    ];

    console.log('📝 Mise à jour du contenu...');
    
    // Mettre à jour l'article
    const result = await sanityClient
      .patch(articleId)
      .set({
        body: newBody
      })
      .commit();

    console.log('✅ Article mis à jour avec succès !');
    console.log(`📄 ID: ${result._id}`);
    console.log(`📝 Titre: ${result.title}`);
    console.log(`📖 Nouveau body: ${result.body.length} blocs`);
    
    // Afficher la structure du nouveau body
    console.log('\n🔍 Structure du nouveau body:');
    result.body.forEach((block: any, index: number) => {
      console.log(`   [${index}] Type: ${block._type}, Style: ${block.style || 'N/A'}`);
      if (block.children && block.children.length > 0) {
        const text = block.children[0].text;
        console.log(`       Texte: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
      }
    });

    console.log('\n🎉 Contenu mis à jour ! Vous pouvez maintenant voir l\'article complet sur le site.');

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  }
}

updateArticleContent(); 