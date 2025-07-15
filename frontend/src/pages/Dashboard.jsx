import { useLoaderData } from "react-router-dom";
import authLoader from "../util/authLoader.js";
import NavBar from "../components/commonComponents/NavBar.jsx";
import Wrapper from "../components/commonComponents/Wrapper.jsx";
import Stats from "../components/dashboardComponents/Stats.jsx";
import DoughnutChart from "../components/dashboardComponents/DoughnutChart.jsx";
import CardList from "../components/dashboardComponents/CardList.jsx";
import TransactionsTable from "../components/dashboardComponents/TransactionsTable.jsx";
function Dashboard() {
  const data = useLoaderData();
  const statistics = data.stats;
  console.log(statistics);

  const {
    totalNumberOfTransactions,
    thisMonthIncomeRecieved,
    monthIncomeBreakdown,
    incomeDueDetails,
    futureIncome,
    thisMonthExpensePaid,
    expenseDueDetails,
    futureExpense,
    monthExpenseBreakdown,
    subscriptionsDueDetails,
    paymentMethodBreakdown,
    recentTransaction,
  } = statistics;

  const userTransactions = totalNumberOfTransactions[0]?.total || 0;
  const incomeReceived = thisMonthIncomeRecieved[0]?.total || 0;
  const expensePaid = thisMonthExpensePaid[0]?.total || 0;
  const netBalance = incomeReceived - expensePaid;
  const netBalanceColor = netBalance > 0 ? "text-green-400" : "text-red-400";

  const monthlyPaid = [
    {
      id: 1,
      name: "Total Income Received This Month",
      value: `${incomeReceived}`,
      color: "text-green-400",
    },
    {
      id: 2,
      name: "Total Expenses Paid This Month",
      value: `${expensePaid}`,
      color: "text-red-400",
    },
    {
      id: 3,
      name: "Net Balance This Month",
      value: `${netBalance}`,
      color: netBalanceColor,
    },
  ];
  return (
    <>
      <NavBar user={data.user} />
      {userTransactions ? (
        <Wrapper title="Dashboard">
          <Stats stats={monthlyPaid} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {monthExpenseBreakdown[0]?<DoughnutChart
              data={monthExpenseBreakdown}
              chartTitle="Expense Breakdown This Month"
            />:<></>}
            {monthIncomeBreakdown[0]?<DoughnutChart
              data={monthIncomeBreakdown}
              chartTitle="Income Breakdown This Month"
            />:<></>}
            {paymentMethodBreakdown[0]?<DoughnutChart
              data={paymentMethodBreakdown}
              chartTitle="Payment Method Breakdown"
            />:<></>}
          </div>
{incomeDueDetails.length > 0 && (
  <>
    <CardList list={incomeDueDetails} type="Income" title='Recurring Income Due This Month'/>
  </>
)}

{futureIncome.length > 0 && (
  <>
    <h2 className="text-xl font-semibold text-gray-800 mb-2 mt-6"></h2>
    <CardList list={futureIncome} type="Income" title='Upcoming Planned Income'/>
  </>
)}
{subscriptionsDueDetails.length > 0 && (
  <>
    <CardList list={subscriptionsDueDetails} type="Expense" title='Subscriptions Due This Month'/>
  </>
)}

{expenseDueDetails.length > 0 && (
  <>
    <h2 className="text-xl font-semibold text-gray-800 mb-2 mt-6"></h2>
    <CardList list={expenseDueDetails} type="Expense" title='Recurring Expenses Due This Month'/>
  </>
)} 

{futureExpense.length > 0 && (
  <>
    
    <CardList list={futureExpense} type="Expense" title='Upcoming Planned Expenses'/>
  </>
)}

{recentTransaction.length > 0 && (
  <>
    <div className="flex items-center my-8">
    <div className="flex-grow border-t border-gray-300" />
    <span className="mx-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
      Recent Transactions
    </span>
    <div className="flex-grow border-t border-gray-300" />
  </div>
    <TransactionsTable transactions={recentTransaction}/>
  </>
)}
        </Wrapper>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-lg font-medium text-gray-700 mb-4">
            No transactions found. Please add some to get started.
          </p>
          <a
            href="/transactions"
            className="inline-block rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Go to Transactions
          </a>
        </div>
      )}
    </>
  );
}
export default Dashboard;

export async function loader() {
  const userData = await authLoader();
  const response = await fetch(
    `https://jarvis-qynk.onrender.com/tran/data/${userData.user._id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Response(JSON.stringify({ message: data.message }), {
      status: response.status,
    });
  }
  const resData = await response.json();

  return resData;
}
