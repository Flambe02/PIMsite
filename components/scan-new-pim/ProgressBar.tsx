/**
 * Composant ProgressBar avec animation fluide
 * Barre de progression moderne pour le scan
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ProgressBarProps {
  progress: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = ''
}) => {
  const steps = [
    { name: 'Upload', progress: 20, description: 'Arquivo carregado' },
    { name: 'Scan OCR', progress: 50, description: 'Extraindo texto...' },
    { name: 'Validação', progress: 70, description: 'Verificando documento...' },
    { name: 'Análise IA', progress: 90, description: 'Processando dados...' },
    { name: 'Concluído', progress: 100, description: 'Análise finalizada!' }
  ];

  // Fonction améliorée pour détecter l'étape actuelle
  const getCurrentStep = (progress: number) => {
    for (let i = steps.length - 1; i >= 0; i--) {
      if (progress >= steps[i].progress) {
        return steps[i];
      }
    }
    return steps[0];
  };

  const currentStep = getCurrentStep(progress);

  const getStepName = (progress: number) => {
    return currentStep.name;
  };

  const getStepDescription = (progress: number) => {
    return currentStep.description;
  };

  // Fonction pour déterminer si une étape est active
  const isStepActive = (stepIndex: number, progress: number) => {
    const step = steps[stepIndex];
    const nextStep = steps[stepIndex + 1];
    
    if (stepIndex === 0) {
      return progress > 0 && progress < (nextStep?.progress || 100);
    }
    
    return progress >= step.progress && progress < (nextStep?.progress || 100);
  };

  // Fonction pour déterminer si une étape est terminée
  const isStepCompleted = (stepIndex: number, progress: number) => {
    const step = steps[stepIndex];
    return progress >= step.progress;
  };

  return (
    <div className={`progress-bar ${className}`}>
      {/* Barre de progression principale */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-sm font-medium text-gray-700">
              {getStepName(progress)}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              {getStepDescription(progress)}
            </p>
          </div>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Étapes détaillées */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isActive = isStepActive(index, progress);
          const isCompleted = isStepCompleted(index, progress);
          
          return (
            <div key={step.name} className="flex flex-col items-center">
              <motion.div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                  ${isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: isActive ? [1, 1.1, 1] : 1,
                  boxShadow: isActive ? '0 0 0 3px rgba(59, 130, 246, 0.3)' : 'none'
                }}
                transition={{ 
                  delay: index * 0.1,
                  scale: isActive ? { duration: 1, repeat: Infinity } : {},
                  boxShadow: isActive ? { duration: 1, repeat: Infinity } : {}
                }}
              >
                {isCompleted ? '✓' : isActive ? '⟳' : index + 1}
              </motion.div>
              <span className={`text-xs mt-1 text-center ${
                isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 