export default function AccountSectionAdultDependants() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Adult Dependants</h2>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="mb-4 font-medium">Do you want to add an adult dependant?</div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="adult" value="yes" /> Yes
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="adult" value="no" /> No
          </label>
        </div>
      </div>
    </div>
  );
} 