import { useLoaderData } from "react-router-dom";
import authLoader from "../util/authLoader.js";
import NavBar from "../components/commonComponents/NavBar.jsx";
import Wrapper from "../components/commonComponents/Wrapper.jsx";
import Stats from "../components/dashboardComponents/Stats.jsx";
import DoughnutChart from "../components/dashboardComponents/DoughnutChart.jsx";
function Dashboard() {
  const data = useLoaderData();
  const statistics = data.stats;
  console.log(statistics);
  
  const {
    thisMonthIncomeRecieved,
    thisMonthIncomeDue,
    futureThisMonthIncomeDue,
    monthIncomeBreakdown,
    thisMonthExpensePaid,
    thisMonthExpenseDue,
    futureThisMonthExpenseDue,
    monthExpenseBreakdown,
    monthlySubscriptionDue,
    monthlySubscriptionPaid,
    paymentMethodBreakdown,
    recentTransactions
  } = statistics;

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

  const incomeDueThisMonth =
    (thisMonthIncomeDue[0]?.total || 0) +
    (futureThisMonthIncomeDue[0]?.total || 0);
  
    const expenseDueThisMonth =
    (thisMonthExpenseDue[0]?.total || 0) +
    (futureThisMonthExpenseDue[0]?.total || 0);

  return (
    <>
      <NavBar user={data.user} />
      <Wrapper title="Dashboard">
        <Stats stats={monthlyPaid} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
    <DoughnutChart data={monthExpenseBreakdown} chartTitle="Expense Breakdown" />
    <DoughnutChart data={monthIncomeBreakdown} chartTitle="Income Breakdown" />
    <DoughnutChart data={paymentMethodBreakdown} chartTitle="Payment Method Breakdown" />
  </div>
      </Wrapper>
    </>
  );
}
export default Dashboard;

export async function loader() {
  const userData = await authLoader();
  const response = await fetch(
    `http://localhost:3000/tran/data/${userData.user._id}`,
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
