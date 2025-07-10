import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// L'action serveur minimale
async function testInsertAction() {
  "use server";
  
  console.log("--- DÉBUT TEST MINIMAL ---");
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.log("TEST MINIMAL: Utilisateur non trouvé !");
    return;
  }
  
  console.log("TEST MINIMAL: Utilisateur trouvé:", user.id);
  
  const { error } = await supabase
    .from("holerites")
    .insert({ user_id: user.id, nome: "Test minimal" }); // Insérer juste le minimum
    
  if (error) {
    console.error("ERREUR DANS LE TEST MINIMAL:", error);
  } else {
    console.log("SUCCÈS DU TEST MINIMAL ! Ligne insérée.");
  }
  
  revalidatePath("/test-insert");
}

// Le composant de la page
export default function TestInsertPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Page de Test d&apos;Insertion</h1>
      <p>Ce bouton appelle une action serveur qui tente d&apos;insérer une ligne dans la table &apos;holerites&apos; avec seulement votre user_id.</p>
      <form action={testInsertAction}>
        <button type="submit">Lancer le Test d&apos;Insertion</button>
      </form>
    </div>
  );
} 