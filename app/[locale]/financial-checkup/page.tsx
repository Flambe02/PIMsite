"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  TrendingUp, 
  Heart, 
  Target, 
  CreditCard, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Circle,
  BarChart3,
  Star,
  MessageCircle,
  Globe,
  Flag
} from "lucide-react";
import FinancialCheckupLanding from "@/components/financial-checkup/FinancialCheckupLanding";
import FinancialCheckupStepper from "@/components/financial-checkup/FinancialCheckupStepper";
import FinancialCheckupQuestions from "@/components/financial-checkup/FinancialCheckupQuestions";
import FinancialCheckupSummary from "@/components/financial-checkup/FinancialCheckupSummary";
import { useSupabase } from "@/components/supabase-provider";
import { financialCheckupData } from "@/lib/financial-checkup/data";
import { CheckupStep, CheckupBlock, CheckupAnswer, CheckupScore, CheckupResult } from "@/types/financial-checkup";

export default function FinancialCheckupPage() {
  const params = useParams();
  const locale = typeof params?.locale === 'string' ? params.locale : 'br';
  const { supabase, session } = useSupabase();
  
  const [currentStep, setCurrentStep] = useState<CheckupStep>('hero');
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<CheckupBlock>('resilience');
  const [answers, setAnswers] = useState<CheckupAnswer[]>([]);
  const [scores, setScores] = useState<CheckupScore[]>([]);
  const [globalScore, setGlobalScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState(locale === 'pt' ? 'BR' : 'FR');
  const [language, setLanguage] = useState(locale === 'br' ? 'pt' : locale);

  // Load saved progress on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('financialCheckupProgress');
    if (saved) {
      setHasSavedProgress(true);
    }
  }, []);

  // Get localized data
  const data = financialCheckupData[language as keyof typeof financialCheckupData] || financialCheckupData.fr;

  const resumeProgress = () => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('financialCheckupProgress');
    if (!saved) return;
    try {
      const p = JSON.parse(saved);
      setCurrentStep(p.currentStep as CheckupStep);
      setCurrentBlock(p.currentBlock as CheckupBlock);
      setAnswers(p.answers || []);
    } catch {}
  };

  const saveProgress = () => {
    if (typeof window === 'undefined') return;
    const payload = {
      currentStep,
      currentBlock,
      answers,
    };
    localStorage.setItem('financialCheckupProgress', JSON.stringify(payload));
  };

  const clearProgress = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('financialCheckupProgress');
  };

  const handleStartCheckup = () => {
    setCurrentStep('questions');
  };

  const handleAnswerQuestion = (questionId: string, answer: string | number, block: CheckupBlock) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { questionId, answer, block };
    } else {
      newAnswers.push({ questionId, answer, block });
    }
    
    setAnswers(newAnswers);
  };

  const handleNextBlock = () => {
    const blocks: CheckupBlock[] = ['resilience', 'income', 'wellbeing', 'future', 'budget'];
    const currentIndex = blocks.indexOf(currentBlock);
    
    if (currentIndex < blocks.length - 1) {
      setCurrentBlock(blocks[currentIndex + 1]);
    } else {
      calculateScores();
      setCurrentStep('summary');
    }
  };

  const handlePreviousBlock = () => {
    const blocks: CheckupBlock[] = ['resilience', 'income', 'wellbeing', 'future', 'budget'];
    const currentIndex = blocks.indexOf(currentBlock);
    
    if (currentIndex > 0) {
      setCurrentBlock(blocks[currentIndex - 1]);
    }
  };

  const calculateScores = () => {
    const blockScores: CheckupScore[] = [];
    let totalScore = 0;
    let totalMaxScore = 0;

    const blocks: CheckupBlock[] = ['resilience', 'income', 'wellbeing', 'future', 'budget'];
    
    blocks.forEach(block => {
      const blockAnswers = answers.filter(a => a.block === block);
      const blockData = data.blocks[block];
      
      let blockScore = 0;
      let blockMaxScore = 0;
      
      blockData.questions.forEach(question => {
        const answer = blockAnswers.find(a => a.questionId === question.id);
        if (answer) {
          const questionScore = calculateQuestionScore(question, answer.answer);
          blockScore += questionScore;
          blockMaxScore += question.maxScore || 20;
        }
      });
      
      const percentage = blockMaxScore > 0 ? Math.round((blockScore / blockMaxScore) * 100) : 0;
      
      blockScores.push({
        block,
        score: blockScore,
        maxScore: blockMaxScore,
        percentage
      });
      
      totalScore += blockScore;
      totalMaxScore += blockMaxScore;
    });

    setScores(blockScores);
    setGlobalScore(totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0);
  };

  const calculateQuestionScore = (question: any, answer: string | number): number => {
    if (question.type === 'multiple_choice') {
      const option = question.options.find((opt: any) => opt.value === answer);
      return option?.score || 0;
    } else if (question.type === 'slider') {
      const numericAnswer = Number(answer);
      if (question.scoring === 'linear') {
        return Math.round((numericAnswer / question.max) * (question.maxScore || 20));
      } else if (question.scoring === 'inverse') {
        return Math.round(((question.max - numericAnswer) / question.max) * (question.maxScore || 20));
      }
    }
    return 0;
  };

  const saveCheckupResult = async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    try {
      const result: CheckupResult = {
        userId: session.user.id,
        checkupDate: new Date(),
        answers,
        scores,
        globalScore,
        comments: {},
        country,
        language,
        version: '1.0'
      };

      const { data, error } = await supabase
        .from('financial_checkups')
        .insert([result])
        .select()
        .single();

      if (error) throw error;
      
      console.log('Checkup result saved:', data);
    } catch (error) {
      console.error('Error saving checkup result:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentStep === 'summary') {
      saveCheckupResult();
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-white">
      <div className={`max-w-4xl mx-auto ${currentStep === 'questions' ? '' : 'px-4 py-8'}`}>
        <AnimatePresence mode="wait">
          {currentStep === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <FinancialCheckupLanding
                language={language as "fr" | "pt"}
                onStart={() => { clearProgress(); handleStartCheckup(); }}
              />
            </motion.div>
          )}

          {currentStep === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="h-screen"
            >
              <FinancialCheckupQuestions
                block={currentBlock}
                data={data.blocks[currentBlock]}
                answers={answers}
                onAnswer={handleAnswerQuestion}
                onNext={handleNextBlock}
                onPrevious={handlePreviousBlock}
                isFirstBlock={currentBlock === 'resilience'}
                isLastBlock={currentBlock === 'budget'}
              />
            </motion.div>
          )}

          {currentStep === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <FinancialCheckupSummary
                scores={scores}
                globalScore={globalScore}
                answers={answers}
                data={data}
                language={language}
                onRestart={() => {
                  setCurrentStep('hero');
                  setCurrentBlock('resilience');
                  setAnswers([]);
                  setScores([]);
                  setGlobalScore(0);
                }}
                isLoading={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 