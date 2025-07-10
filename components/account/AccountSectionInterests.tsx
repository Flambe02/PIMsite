const interests = [
  "Avoiding scams", "Borrowing", "Budgeting", "Children & family", "Couple’s finances", "Credit", "Debt", "Disability", "Divorce & separation", "Everyday money", "Fintech", "Government support", "Housing", "In the home", "Inheritance", "Insurance", "Investing", "Life after work", "Mental health & wellbeing", "New to the US", "New to work", "Retirement", "Savings", "Senior support", "Students & grads", "Sustainability", "Tax", "Travel & leisure", "Vehicles & transport", "Work"
];

export default function AccountSectionInterests() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Interests</h2>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => (
            <span key={interest} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 border">
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
} 