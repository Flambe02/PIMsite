export default function AccountSectionChildDependants() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Child Dependants</h2>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="mb-4 font-medium">Do you want to add a child dependant?</div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="child" value="yes" /> Yes
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="child" value="no" /> No
          </label>
        </div>
      </div>
    </div>
  );
} 