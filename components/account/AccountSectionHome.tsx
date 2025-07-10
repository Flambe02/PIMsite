const homeStatuses = [
  { label: "Renting", icon: "🏠" },
  { label: "Living with family", icon: "👨‍👩‍👧" },
  { label: "Looking to own", icon: "🔑" },
  { label: "Homeowner", icon: "🏡" },
  { label: "Buy-to-rent property owner", icon: "🏢" },
  { label: "Holiday homeowner", icon: "🏖️" },
];

export default function AccountSectionHome() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Home</h2>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-wrap gap-4">
          {homeStatuses.map((status) => (
            <div key={status.label} className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg w-32">
              <span className="text-3xl">{status.icon}</span>
              <span className="text-sm text-gray-700 text-center">{status.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 