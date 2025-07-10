export default function AccountSectionShare() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Share</h2>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="mb-4 font-medium">Add up to 5 friends and family to share content with</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Send via</th>
                <th className="text-left">Contact</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map((i) => (
                <tr key={i}>
                  <td><input className="border rounded px-2 py-1" placeholder="Name" /></td>
                  <td>
                    <select className="border rounded px-2 py-1">
                      <option>Send via</option>
                      <option>WhatsApp</option>
                      <option>Email</option>
                      <option>SMS</option>
                    </select>
                  </td>
                  <td><input className="border rounded px-2 py-1" placeholder="Contact" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-4 bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold">Confirm</button>
      </div>
    </div>
  );
} 