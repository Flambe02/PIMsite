import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile-form";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!user) redirect("/login?redirectTo=/profile");

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", userId)
    .single();

  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Mon profil</h1>
      <ProfileForm
        initialFirst={profile?.first_name ?? ""}
        initialLast={profile?.last_name ?? ""}
        email={user.email ?? ""}
      />
    </main>
  );
} 