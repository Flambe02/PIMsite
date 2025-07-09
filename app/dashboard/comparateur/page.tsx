import { BenefitComparator } from "@/components/comparator/BenefitComparator";
import { UserProfile } from "@/hooks/useBenefitComparison";

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
  return (
    <div className="py-10 px-4">
      <BenefitComparator profile={userProfile} />
    </div>
  );
} 