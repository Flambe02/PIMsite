"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface AutonomoViewProps {
  onProfileChange?: (profile: string) => void;
}

export default function AutonomoView({ onProfileChange }: AutonomoViewProps) {
  const [selectedItem, setSelectedItem] = useState<string>('autonomo_bruto');
  const explanationRef = useRef<HTMLDivElement>(null);

  const handleItemClick = (itemKey: string) => {
    setSelectedItem(itemKey);
    if (explanationRef.current) {
      explanationRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mt-8">
      {/* Colonne 1 : RPA (Recibo de Pagamento de Autônomo) */}
      <div className="md:col-span-5 pl-0 md:pl-0">
        <div className="bg-orange-50 rounded-xl shadow-lg border border-orange-100 p-6 max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-orange-900 mb-4 text-center">Recibo de Pagamento de Autônomo (RPA)</h2>
          
          {/* Items du RPA */}
          <div className="space-y-2 mb-4">
            <button 
              className={`w-full flex justify-between items-center px-3 py-3 rounded transition ${selectedItem === 'autonomo_bruto' ? 'bg-orange-100' : 'hover:bg-orange-50'}`} 
              onClick={() => handleItemClick('autonomo_bruto')}
            >
              <span className="font-medium text-left">Valor do Serviço Bruto</span>
              <span className="font-mono font-bold">R$ 7.000,00</span>
            </button>
            
            <button 
              className={`w-full flex justify-between items-center px-3 py-2 rounded transition ${selectedItem === 'autonomo_inss' ? 'bg-orange-100' : 'hover:bg-orange-50'}`} 
              onClick={() => handleItemClick('autonomo_inss')}
            >
              <span className="font-medium text-left">Desconto: INSS (20%)</span>
              <span className="font-mono font-bold text-rose-700">-R$ 908,85</span>
            </button>
            
            <button 
              className={`w-full flex justify-between items-center px-3 py-2 rounded transition ${selectedItem === 'autonomo_irrf' ? 'bg-orange-100' : 'hover:bg-orange-50'}`} 
              onClick={() => handleItemClick('autonomo_irrf')}
            >
              <span className="font-medium text-left">Desconto: IRRF (tabela progressiva)</span>
              <span className="font-mono font-bold text-rose-700">-R$ 884,97</span>
            </button>
            
            <button 
              className={`w-full flex justify-between items-center px-3 py-2 rounded transition ${selectedItem === 'autonomo_iss' ? 'bg-orange-100' : 'hover:bg-orange-50'}`} 
              onClick={() => handleItemClick('autonomo_iss')}
            >
              <span className="font-medium text-left">Desconto: ISS (Imposto Sobre Serviços)</span>
              <span className="font-mono font-bold text-rose-700">-R$ 350,00</span>
            </button>
          </div>
          
          {/* Total Líquido */}
          <button 
            className={`w-full flex justify-between items-center py-3 border-t border-orange-200 font-bold text-orange-900 text-lg mb-2 bg-orange-100 rounded transition ${selectedItem === 'autonomo_liquido' ? 'bg-orange-200' : 'hover:bg-orange-150'}`} 
            onClick={() => handleItemClick('autonomo_liquido')}
          >
            <span>Valor Líquido a Receber</span>
            <span className="font-mono">R$ 4.856,18</span>
          </button>
          
          <div className="text-xs text-muted-foreground text-center">* Valores simulados para ilustração</div>
        </div>
      </div>

      {/* Colonne 2 : Explications détaillées */}
      <div className="md:col-span-7 p-6 bg-white rounded-lg shadow-sm border h-full overflow-y-auto" ref={explanationRef}>
        <div className="mb-4 text-sm text-muted-foreground">Clique em um item do recibo para ver a explicação detalhada.</div>
        
        {/* Explication: Valor do Serviço Bruto */}
        {selectedItem === 'autonomo_bruto' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Valor do Serviço Bruto</h3>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">O que é?</h4>
              <p className="text-muted-foreground">É o valor total acordado pelo serviço prestado, antes de qualquer desconto de impostos. Serve de base para todos os cálculos de retenção no RPA.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Como funciona?</h4>
              <p className="text-muted-foreground">O valor bruto é definido no contrato ou acordo de prestação de serviço. Sobre ele incidem todos os descontos obrigatórios (INSS, IRRF, ISS). Não há férias, 13º ou FGTS para autônomos.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Exemplo Prático</h4>
              <p className="text-muted-foreground">Se você prestou um serviço e combinou receber R$ 7.000,00, esse será o valor bruto do seu RPA, antes dos descontos.</p>
            </div>
          </div>
        )}

        {/* Explication: INSS */}
        {selectedItem === 'autonomo_inss' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Desconto: INSS (20%)</h3>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">O que é?</h4>
              <p className="text-muted-foreground">O INSS é a contribuição previdenciária obrigatória do autônomo, recolhida diretamente na fonte pela empresa contratante.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Como funciona?</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Alíquota de 20% sobre o valor bruto do serviço, limitada ao teto do INSS (R$ 7.786,02 em 2024).</li>
                <li>O desconto é feito pela fonte pagadora, que recolhe e repassa à Previdência.</li>
                <li>Garante acesso a benefícios como aposentadoria, auxílio-doença, etc.</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Exemplo Prático</h4>
              <p className="text-muted-foreground">Para um serviço de R$ 7.000,00, o desconto de INSS será de R$ 1.400,00 (20%), mas se o valor bruto ultrapassar o teto, o desconto será limitado ao máximo permitido.</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-2">
              <h4 className="text-lg font-semibold mb-1 text-blue-900">Consulta Teto INSS</h4>
              <p className="text-muted-foreground text-sm">Confira o teto e as regras atualizadas no <a href='https://www.gov.br/inss/pt-br' target='_blank' rel='noopener noreferrer' className='underline hover:text-blue-700'>site do INSS</a>.</p>
            </div>
          </div>
        )}

        {/* Explication: IRRF */}
        {selectedItem === 'autonomo_irrf' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Desconto: IRRF (tabela progressiva)</h3>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">O que é?</h4>
              <p className="text-muted-foreground">O IRRF é o Imposto de Renda Retido na Fonte, calculado sobre o valor bruto menos o INSS, conforme a tabela progressiva da Receita Federal.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Como funciona?</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Aplica-se a tabela progressiva mensal do IRRF, igual à dos trabalhadores CLT.</li>
                <li>O cálculo considera o valor bruto do serviço menos o INSS retido.</li>
                <li>O desconto pode ser elevado para valores altos.</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Exemplo Prático</h4>
              <p className="text-muted-foreground">Se o valor bruto é R$ 7.000,00 e o INSS descontado foi R$ 908,85, a base do IRRF será R$ 6.091,15. O imposto será calculado conforme a faixa correspondente.</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-2">
              <h4 className="text-lg font-semibold mb-1 text-blue-900">Simule seu IRRF</h4>
              <p className="text-muted-foreground text-sm">Use o <a href='https://www.calculador.com.br/calculo/irrf-autonomo' target='_blank' rel='noopener noreferrer' className='underline hover:text-blue-700'>simulador de IRRF para autônomos</a> para ver quanto será descontado.</p>
            </div>
          </div>
        )}

        {/* Explication: ISS */}
        {selectedItem === 'autonomo_iss' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Desconto: ISS (Imposto Sobre Serviços)</h3>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">O que é?</h4>
              <p className="text-muted-foreground">O ISS é um imposto municipal obrigatório sobre a prestação de serviços, descontado diretamente no RPA.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Como funciona?</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>A alíquota varia de 2% a 5% conforme o município e o tipo de serviço.</li>
                <li>O desconto é feito pela fonte pagadora e repassado à prefeitura.</li>
                <li>Nem todo serviço está sujeito ao ISS, mas a maioria sim.</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Exemplo Prático</h4>
              <p className="text-muted-foreground">Se a alíquota do seu município é 5%, para um serviço de R$ 7.000,00 o ISS descontado será de R$ 350,00.</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-2">
              <h4 className="text-lg font-semibold mb-1 text-blue-900">Consulta ISS Municipal</h4>
              <p className="text-muted-foreground text-sm">Consulte a alíquota do seu município no <a href='https://www.confaz.fazenda.gov.br/legislacao/aliquotas/iss' target='_blank' rel='noopener noreferrer' className='underline hover:text-blue-700'>portal nacional do ISS</a> ou no site da prefeitura.</p>
            </div>
          </div>
        )}

        {/* Explication: Valor Líquido */}
        {selectedItem === 'autonomo_liquido' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Valor Líquido Recebido</h3>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">O que é?</h4>
              <p className="text-muted-foreground">Este é o valor que efetivamente entra na sua conta pessoal após todas as retenções de impostos na fonte.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Como funciona?</h4>
              <p className="text-muted-foreground">O valor líquido é calculado subtraindo todos os descontos obrigatórios do valor bruto do serviço. É o que você realmente recebe.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Exemplo Prático</h4>
              <p className="text-muted-foreground">Para um serviço de R$ 7.000,00, após descontos de INSS, IRRF e ISS, o valor líquido pode ser de R$ 4.856,18.</p>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="text-lg font-semibold mb-2 text-amber-900">🚀 Oportunidade de Otimização</h4>
              <p className="text-muted-foreground">Como você pode ver, os impostos para um Autônomo são muito elevados. Para rendimentos regulares, a melhor estratégia de otimização é <strong>abrir uma empresa (obter um CNPJ)</strong> e passar ao regime PJ (Simples Nacional), onde os impostos unificados começam em apenas 6% sobre o faturamento.</p>
              <Button className="mt-4" onClick={() => onProfileChange?.('PJ')}>Comparar com o Guia PJ →</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 