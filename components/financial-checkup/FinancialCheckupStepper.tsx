"use client"

import { CheckupBlock } from "@/types/financial-checkup";

interface FinancialCheckupStepperProps {
  currentBlock: CheckupBlock;
  blocks: any;
  onBlockChange: (block: CheckupBlock) => void;
  language?: string;
}

const blockOrder: CheckupBlock[] = ['resilience', 'income', 'wellbeing', 'future', 'budget'];

export default function FinancialCheckupStepper({
  currentBlock,
  blocks,
  onBlockChange,
  language = 'pt',
}: FinancialCheckupStepperProps) {
  const currentIndex = blockOrder.indexOf(currentBlock);

  return (
    <div className="mb-8">
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / blockOrder.length) * 100}%` }}
        />
      </div>

      <div className="flex justify-between items-center">
        {blockOrder.map((block, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={block}
              className="flex flex-col items-center relative cursor-pointer"
              onClick={() => isCompleted && onBlockChange(block)}
            >
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : isCurrent 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-110' 
                    : 'bg-gray-200 text-gray-400'
                  }
                `}
              >
                {isCompleted ? (
                  <span className="text-white">✓</span>
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>

              <div className="mt-3 text-center">
                <p className={`
                  text-sm font-medium
                  ${isCompleted 
                    ? 'text-green-600' 
                    : isCurrent 
                    ? 'text-blue-600' 
                    : 'text-gray-400'
                  }
                `}>
                  {blocks[block]?.title?.split(' ')[0] || block}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {index + 1}/{blockOrder.length}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-bold">{currentIndex + 1}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {blocks[currentBlock]?.title || currentBlock}
            </h2>
            <p className="text-gray-600">
              {blocks[currentBlock]?.subtitle || (language === 'fr' ? 'Description du bloc' : 'Descrição do bloco')}
            </p>
          </div>
        </div>
        <p className="text-gray-700">
          {blocks[currentBlock]?.description || (language === 'fr' ? 'Description détaillée du bloc actuel.' : 'Descrição detalhada do bloco atual.')}
        </p>
      </div>
    </div>
  );
}