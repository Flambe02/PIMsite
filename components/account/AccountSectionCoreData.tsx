export default function AccountSectionCoreData() {
  // Les données peuvent venir d’un hook ou d’un context utilisateur
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Core Data</h2>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <span className="font-semibold">Name:</span> Madeline Tamez
        </div>
        <div>
          <span className="font-semibold">Preferred name:</span> Maddie
        </div>
        <div>
          <span className="font-semibold">Date of birth:</span> 07/12/1982
        </div>
        <div>
          <span className="font-semibold">Gender:</span> Female
        </div>
        <div>
          <span className="font-semibold">Lives:</span> Texas
        </div>
        <div>
          <span className="font-semibold">Salary:</span> **********
        </div>
      </div>
    </div>
  );
} 