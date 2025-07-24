import AccountSectionAccount from "@/components/account/AccountSectionAccount";
import { useRequireSession } from "@/components/supabase-provider";

export default function ProfilePage() {
  useRequireSession(`/profile`);
  return (
    <div className="max-w-4xl mx-auto py-8">
      <AccountSectionAccount />
    </div>
  );
} 