import React, { useState, useRef } from "react";

// Composant autonome pour la vue Estagiário (Bolsa-Auxílio, Recesso, etc.)
const EstagiarioView: React.FC = () => {
  // États principaux pour la vue Estagiário
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const explanationRef = useRef<HTMLDivElement>(null);

  // Handler pour sélectionner un item du recibo (affiche l'explication à droite)
  const handleItemClick = (itemKey: string) => {
    setSelectedItem(itemKey);
    if (explanationRef.current) {
      explanationRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      {/* Colonne 1 : Recibo de Pagamento de Bolsa-Auxílio */}
      <div className="md:col-span-5 pl-0 md:pl-0">
        <div className="bg-emerald-50 rounded-xl shadow-lg border border-emerald-100 p-6 max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-emerald-900 mb-4">Recibo de Pagamento de Bolsa-Auxílio</h2>
          {/* Détails de pagamento */}
          <div className="mb-2">
            <div className="font-semibold text-emerald-800 mb-1">Detalhes do Pagamento</div>
            <button className={`w-full flex justify-between items-center px-2 py-3 rounded transition ${selectedItem === 'estagio_bolsa' ? 'bg-emerald-100' : 'hover:bg-emerald-50'}`} onClick={() => handleItemClick('estagio_bolsa')}>
              <span className="font-medium text-left">Bolsa-Auxílio</span>
              <span className="font-mono font-bold">R$ 1.800,00</span>
            </button>
            <button className={`w-full flex justify-between items-center px-2 py-2 rounded transition ${selectedItem === 'estagio_transporte' ? 'bg-emerald-100' : 'hover:bg-emerald-50'}`} onClick={() => handleItemClick('estagio_transporte')}>
              <span className="font-medium text-left">Auxílio-Transporte</span>
              <span className="font-mono font-bold">R$ 150,00</span>
            </button>
            <button className={`w-full flex justify-between items-center px-2 py-2 rounded transition ${selectedItem === 'estagio_irrf' ? 'bg-rose-100' : 'hover:bg-rose-50'}`} onClick={() => handleItemClick('estagio_irrf')}>
              <span className="font-medium text-left">Desconto de IRRF (se aplicável)</span>
              <span className="font-mono font-bold text-rose-700">-R$ 0,00</span>
            </button>
          </div>
          {/* Total net */}
          <div className="flex justify-between items-center py-3 border-t border-emerald-200 font-bold text-emerald-900 text-lg mb-4">
            <span>Valor Líquido Recebido</span>
            <span className="font-mono">R$ 1.950,00</span>
          </div>
          {/* Concepts légaux */}
          <div className="mt-6">
            <div className="font-semibold text-emerald-800 mb-2">Contexto Legal do Estágio</div>
            <button className={`w-full text-left px-4 py-2 rounded-lg border font-semibold transition mb-2 ${selectedItem === 'estagio_lei' ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : 'bg-white border-gray-200 text-gray-700 hover:bg-emerald-50'}`} onClick={() => handleItemClick('estagio_lei')}>Lei do Estágio (Nº 11.788/08)</button>
            <button className={`w-full text-left px-4 py-2 rounded-lg border font-semibold transition mb-2 ${selectedItem === 'estagio_vinculo' ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : 'bg-white border-gray-200 text-gray-700 hover:bg-emerald-50'}`} onClick={() => handleItemClick('estagio_vinculo')}>Ausência de Vínculo Empregatício</button>
            <button className={`w-full text-left px-4 py-2 rounded-lg border font-semibold transition ${selectedItem === 'estagio_recesso' ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : 'bg-white border-gray-200 text-gray-700 hover:bg-emerald-50'}`} onClick={() => handleItemClick('estagio_recesso')}>Recesso Remunerado (Férias de 30 dias)</button>
          </div>
        </div>
      </div>
      {/* Colonne 2 : Explication contextuelle Estagiário */}
      <div className="md:col-span-7 p-6 bg-white rounded-lg shadow-sm border h-full overflow-y-auto" ref={explanationRef}>
        <div className="mb-4 text-sm text-muted-foreground">Clique em um item do recibo ou conceito para ver a explicação detalhada.</div>
        {selectedItem === 'estagio_bolsa' && (
          <div>
            <h3 className="text-2xl font-bold">Bolsa-Auxílio</h3>
            <p className="text-muted-foreground mt-4">A bolsa-auxílio é o valor pago ao estagiário como contraprestação pelo estágio. Não é salário, mas uma ajuda de custo, e seu valor pode variar conforme o acordo entre as partes.</p>
          </div>
        )}
        {selectedItem === 'estagio_transporte' && (
          <div>
            <h3 className="text-2xl font-bold">Auxílio-Transporte</h3>
            <p className="text-muted-foreground mt-4">O auxílio-transporte é um benefício obrigatório para o estagiário, destinado a custear o deslocamento entre a residência e o local de estágio.</p>
          </div>
        )}
        {selectedItem === 'estagio_irrf' && (
          <div>
            <h3 className="text-2xl font-bold">Desconto de IRRF (se aplicável)</h3>
            <p className="text-muted-foreground mt-4">Em geral, a bolsa-auxílio do estágio não sofre desconto de IRRF, exceto em casos de valores elevados ou situações específicas previstas em lei.</p>
          </div>
        )}
        {selectedItem === 'estagio_lei' && (
          <div>
            <h3 className="text-2xl font-bold">Lei do Estágio (Nº 11.788/08)</h3>
            <p className="text-muted-foreground mt-4">O estágio é regido por uma legislação própria, que estabelece as regras para a contratação, incluindo carga horária, duração, e os direitos e deveres da empresa e do estudante.</p>
          </div>
        )}
        {selectedItem === 'estagio_vinculo' && (
          <div>
            <h3 className="text-2xl font-bold">Ausência de Vínculo Empregatício</h3>
            <p className="text-muted-foreground mt-4">O estágio, quando realizado conforme a lei, não gera vínculo empregatício, ou seja, não há direitos trabalhistas típicos como FGTS, INSS ou 13º salário.</p>
          </div>
        )}
        {selectedItem === 'estagio_recesso' && (
          <div>
            <h3 className="text-2xl font-bold">Recesso Remunerado (Férias de 30 dias)</h3>
            <p className="text-muted-foreground mt-4">Após 12 meses de estágio na mesma empresa, o estagiário tem direito a 30 dias de recesso remunerado, preferencialmente coincidente com as férias escolares.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstagiarioView; 