import { Link } from "react-router-dom";

export default function TransactionsTable({ transactions }) {
  const len = transactions.length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 my-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">Recent Transactions</h1>
        <Link
          to="/transactions"
          className="mt-2 sm:mt-0 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Add Transaction
        </Link>
      </div>

      {len ? (
        <div className="overflow-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tran, index) => (
                <tr key={tran._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{tran.title}</td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap font-medium ${
                      tran.type === "Income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tran.amount.currency} {tran.amount.value}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{tran.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                    {new Date(tran.date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500 mt-4">No transactions found.</div>
      )}
    </div>
  );
}
