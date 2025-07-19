import BenefitComparatorClientWrapper from "@/components/comparator/BenefitComparatorClientWrapper";
import { UserProfile } from "@/hooks/useBenefitComparison";
// Temporairement désactivé pour éviter les erreurs next-intl
// import { useTranslations, useLocale } from 'next-intl';

const userProfile: UserProfile = {
  contractType: "CLT",
  sector: "Tech",
  level: "Pleno",
  benefits: {
    VR: 800,
    VA: 400,
    VT: 200,
    Saúde: 350,
    Previdência: 0,
  },
};

export default function ComparateurPage() {
  // Temporairement désactivé pour éviter les erreurs next-intl
  // const t = useTranslations();
  // const locale = useLocale();
  // const country = locale.toLowerCase();
  // let countrySection = null;
  // Section de pays temporairement désactivée
  
  return (
    <div className="py-10 px-4">
      <BenefitComparatorClientWrapper profile={userProfile} />
    </div>
  );
} 