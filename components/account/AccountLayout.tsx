'use client';
import { useState } from "react";
import AccountSidebar from "./AccountSidebar";
import AccountSectionCoreData from "./AccountSectionCoreData";
import AccountSectionCommunication from "./AccountSectionCommunication";
import AccountSectionInterests from "./AccountSectionInterests";
import AccountSectionHome from "./AccountSectionHome";
import AccountSectionPartner from "./AccountSectionPartner";
import AccountSectionChildDependants from "./AccountSectionChildDependants";
import AccountSectionAdultDependants from "./AccountSectionAdultDependants";
import AccountSectionShare from "./AccountSectionShare";
import { User, Mail, Heart, Home, Users, UserPlus, UserMinus, Share2 } from "lucide-react";

const sections = [
  { key: "core", label: "Core data", icon: <User className="w-5 h-5" /> },
  { key: "communication", label: "Preferred communication", icon: <Mail className="w-5 h-5" /> },
  { key: "interests", label: "Interests", icon: <Heart className="w-5 h-5" /> },
  { key: "home", label: "Home", icon: <Home className="w-5 h-5" /> },
  { key: "partner", label: "Partner", icon: <Users className="w-5 h-5" /> },
  { key: "child", label: "Child dependants", icon: <UserPlus className="w-5 h-5" /> },
  { key: "adult", label: "Adult dependants", icon: <UserMinus className="w-5 h-5" /> },
  { key: "share", label: "Share", icon: <Share2 className="w-5 h-5" /> },
];

export default function AccountLayout() {
  const [selected, setSelected] = useState("core");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AccountSidebar selected={selected} onSelect={setSelected} sections={sections} />
      <main className="flex-1 p-8">
        {selected === "core" && <AccountSectionCoreData />}
        {selected === "communication" && <AccountSectionCommunication />}
        {selected === "interests" && <AccountSectionInterests />}
        {selected === "home" && <AccountSectionHome />}
        {selected === "partner" && <AccountSectionPartner />}
        {selected === "child" && <AccountSectionChildDependants />}
        {selected === "adult" && <AccountSectionAdultDependants />}
        {selected === "share" && <AccountSectionShare />}
      </main>
    </div>
  );
} 