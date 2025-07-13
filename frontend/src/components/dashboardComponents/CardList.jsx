export default function CardList({ list, type, title }) {
  if (!list.length) return null;

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-8 border-b pb-1">{title}</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((due) => (
          <div
            key={due._id}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {due.title}
              </h3>
              <span
                className={`text-sm font-semibold ${
                  type === "Expense" ? "text-red-600" : "text-green-600"
                }`}
              >
                {due.amount.currency} {due.amount.value}
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-1">
              {due.category} &middot; {due.frequency}
            </p>

            <p className="text-sm text-gray-400 mb-1">
              {new Date(due.date) > new Date() ? (
                <>
                  <span className="font-medium text-gray-600">Due:</span>{" "}
                  {new Date(due.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </>
              ) : due.nextDueDate ? (
                <>
                  <span className="font-medium text-gray-600">Next Due:</span>{" "}
                  {new Date(due.nextDueDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </>
              ) : (
                <>No Upcoming Due</>
              )}
            </p>

            {type === "Expense" && due.paymentMethod && (
              <p className="text-sm text-gray-400">
                <span className="font-medium text-gray-600">Method:</span>{" "}
                {due.paymentMethod.methodType?.toUpperCase()}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
