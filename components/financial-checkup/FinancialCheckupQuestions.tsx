"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Circle,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { CheckupBlock, CheckupAnswer } from "@/types/financial-checkup";

interface FinancialCheckupQuestionsProps {
  block: CheckupBlock;
  data: any;
  answers: CheckupAnswer[];
  onAnswer: (questionId: string, answer: string | number, block: CheckupBlock) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstBlock: boolean;
  isLastBlock: boolean;
}

export default function FinancialCheckupQuestions({
  block,
  data,
  answers,
  onAnswer,
  onNext,
  onPrevious,
  isFirstBlock,
  isLastBlock,
}: FinancialCheckupQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [blockScore, setBlockScore] = useState(0);
  const [blockMaxScore, setBlockMaxScore] = useState(0);

  const questions = data.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Calculate block score
  useEffect(() => {
    let score = 0;
    let maxScore = 0;
    
    questions.forEach((question: any) => {
      const answer = answers.find(a => a.questionId === question.id);
      if (answer) {
        const option = question.options?.find((opt: any) => opt.value === answer.answer);
        score += option?.score || 0;
      }
      maxScore += question.maxScore || 20;
    });
    
    setBlockScore(score);
    setBlockMaxScore(maxScore);
  }, [answers, questions]);

  const handleAnswer = (value: string | number) => {
    onAnswer(currentQuestion.id, value, block);
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }, 500);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      onPrevious();
    }
  };

  const getCurrentAnswer = () => {
    return answers.find(a => a.questionId === currentQuestion?.id)?.answer;
  };

  const getScorePercentage = () => {
    return blockMaxScore > 0 ? Math.round((blockScore / blockMaxScore) * 100) : 0;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    if (percentage >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreIcon = (percentage: number) => {
    if (percentage >= 80) return <Smile className="w-5 h-5 text-green-600" />;
    if (percentage >= 60) return <Meh className="w-5 h-5 text-yellow-600" />;
    if (percentage >= 40) return <Frown className="w-5 h-5 text-orange-600" />;
    return <Frown className="w-5 h-5 text-red-600" />;
  };

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune question disponible pour ce bloc.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header - Compact Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">
              Question {currentQuestionIndex + 1}/{questions.length}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-600">{data.title}</span>
          </div>
          <div className="flex items-center gap-1">
            {getScoreIcon(getScorePercentage())}
            <span className={`text-xs font-semibold ${getScoreColor(getScorePercentage())}`}>
              {getScorePercentage()}%
            </span>
          </div>
        </div>
        
        {/* Compact progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Main Content - Question and Options */}
      <div className="flex-1 flex flex-col px-4 py-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
                         {/* Question */}
             <div className="mb-4">
               <h2 className="text-base font-semibold text-gray-900 leading-tight">
                 {currentQuestion.question}
               </h2>
             </div>

                         {/* Answer options - Large touch targets */}
             <div className="flex-1 flex flex-col gap-2">
              {currentQuestion.options?.map((option: any, index: number) => {
                const isSelected = getCurrentAnswer() === option.value;
                const isAnswered = getCurrentAnswer() !== undefined;
                
                return (
                  <motion.button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                                         className={`
                       flex-1 min-h-[70px] p-3 rounded-lg border-2 transition-all duration-300
                       ${isSelected 
                         ? 'border-blue-500 bg-blue-50 shadow-md' 
                         : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                       }
                     `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between h-full">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                          }
                        `}>
                          {isSelected ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900 text-left">
                          {option.label}
                        </span>
                      </div>
                      
                      {/* Score indicator */}
                      {isAnswered && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-sm font-semibold ${
                            option.score >= 15 ? 'text-green-600' :
                            option.score >= 10 ? 'text-yellow-600' :
                            option.score >= 5 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {option.score}
                          </span>
                          {option.score >= 15 ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : option.score <= 5 ? (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

                         {/* Feedback message */}
             {getCurrentAnswer() && (
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200"
               >
                 <div className="flex items-center gap-2">
                   <CheckCircle className="w-4 h-4 text-blue-600" />
                   <span className="text-blue-800 text-sm font-medium">
                     Resposta registrada! 
                     {currentQuestionIndex < questions.length - 1 && " Passando para a próxima pergunta..."}
                   </span>
                 </div>
               </motion.div>
             )}
          </motion.div>
        </AnimatePresence>
      </div>

             {/* Bottom Navigation */}
       <div className="bg-white border-t border-gray-200 px-4 py-3">
         <div className="flex flex-col gap-3">
           {/* Save and continue later button */}
           <div className="flex justify-center">
             <button
               onClick={() => {
                 // Save progress and redirect to dashboard
                 if (typeof window !== 'undefined') {
                   const payload = {
                     currentStep: 'questions',
                     currentBlock: block,
                     currentQuestionIndex,
                     answers,
                   };
                   localStorage.setItem('financialCheckupProgress', JSON.stringify(payload));
                   window.location.href = '/br/dashboard';
                 }
               }}
               className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-gray-800 transition-all duration-300"
             >
               <span className="text-sm">Salvar e continuar depois</span>
             </button>
           </div>
           
           {/* Main navigation */}
           <div className="flex justify-between items-center">
             <button
               onClick={handlePrevious}
               disabled={isFirstBlock && currentQuestionIndex === 0}
               className={`
                 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                 ${isFirstBlock && currentQuestionIndex === 0
                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                   : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                 }
               `}
             >
               <ArrowLeft className="w-4 h-4" />
               <span className="hidden sm:inline">{isFirstBlock && currentQuestionIndex === 0 ? 'Anterior' : 'Voltar'}</span>
             </button>

             {/* Question dots */}
             <div className="flex gap-1">
               {questions.map((_: any, index: number) => (
                 <button
                   key={index}
                   onClick={() => setCurrentQuestionIndex(index)}
                   className={`
                     w-2 h-2 rounded-full transition-all duration-300
                     ${index === currentQuestionIndex 
                       ? 'bg-blue-500 scale-125' 
                       : 'bg-gray-300 hover:bg-gray-400'
                     }
                   `}
                 />
               ))}
             </div>

             <button
               onClick={handleNext}
               disabled={!getCurrentAnswer()}
               className={`
                 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                 ${getCurrentAnswer()
                   ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                   : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                 }
               `}
             >
               <span className="hidden sm:inline">
                 {currentQuestionIndex < questions.length - 1 ? 'Próximo' : (isLastBlock ? 'Finalizar' : 'Próximo bloco')}
               </span>
               <ArrowRight className="w-4 h-4" />
             </button>
           </div>
         </div>
       </div>
    </div>
  );
} 