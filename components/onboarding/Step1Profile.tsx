import { Button } from "@/components/ui/button";

export default function Step1Profile({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full">
      <h2 className="text-2xl font-bold mb-4">Étape 1 : Profil</h2>
      <input className="border rounded px-4 py-2 mb-4" placeholder="Nom" />
      <input className="border rounded px-4 py-2 mb-4" placeholder="Prénom" />
      <Button className="w-full" onClick={onNext}>Sauvegarder et continuer</Button>
    </div>
  );
} 