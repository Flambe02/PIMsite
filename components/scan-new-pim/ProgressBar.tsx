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
    if (progress <= 0) return steps[0];
    if (progress <= 20) return steps[0]; // Upload
    if (progress <= 40) return steps[1]; // Scan OCR
    if (progress <= 60) return steps[2]; // Validação
    if (progress <= 80) return steps[3]; // Análise IA
    return steps[4]; // Concluído
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
      return progress > 0 && progress <= 20;
    }
    if (stepIndex === 1) {
      return progress > 20 && progress <= 40;
    }
    if (stepIndex === 2) {
      return progress > 40 && progress <= 60;
    }
    if (stepIndex === 3) {
      return progress > 60 && progress <= 80;
    }
    return progress > 80;
  };

  // Fonction pour déterminer si une étape est terminée
  const isStepCompleted = (stepIndex: number, progress: number) => {
    const step = steps[stepIndex];
    if (stepIndex === 0) return progress > 20;
    if (stepIndex === 1) return progress > 40;
    if (stepIndex === 2) return progress > 60;
    if (stepIndex === 3) return progress > 80;
    return progress > 100;
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
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                  ${isCompleted 
                    ? 'bg-green-500 text-white scale-110' 
                    : isActive
                    ? 'bg-blue-500 text-white scale-110 shadow-lg shadow-blue-200'
                    : 'bg-gray-200 text-gray-500 scale-100'
                  }
                `}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: isActive ? [1, 1.1, 1] : isCompleted ? 1.1 : 1,
                  boxShadow: isActive ? '0 0 0 4px rgba(59, 130, 246, 0.3)' : 'none'
                }}
                transition={{ 
                  delay: index * 0.1,
                  scale: isActive ? { duration: 1, repeat: Infinity } : {},
                  boxShadow: isActive ? { duration: 1, repeat: Infinity } : {}
                }}
              >
                {isCompleted ? '✓' : isActive ? '⟳' : index + 1}
              </motion.div>
              <span className={`text-xs mt-2 text-center font-medium transition-colors duration-300 ${
                isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step.name}
              </span>
              {isActive && (
                <motion.p 
                  className="text-xs text-blue-500 mt-1 text-center max-w-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {step.description}
                </motion.p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}; 