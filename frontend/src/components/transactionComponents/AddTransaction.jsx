import { useState, useEffect } from "react";
import { Form } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import Dropdown from "../commonComponents/Dropdown";

export default function AddTransaction({ user }) {
  const [frequency, setFrequency] = useState("Once");
  const [type, setType] = useState("Subscription");
  const [selectedCategory, setSelectedCategory] = useState("Uncategorized");
  const [method, setMethod] = useState("cash");
  const [id, setId] = useState("");
  const methodOptions = ["cash", "upi", "card","bank"];
  const categories = [
    "Entertainment",
    "Software Subscription",
    "Groceries",
    "Rent",
    "Transport",
    "Fuel",
    "Medical",
    "Dining",
    "Shopping",
    "Travel",
    "Education",
    "Salary",
    "Miscellaneous",
    "Uncategorized",
  ];
  const freqOptions = ["Once", "Monthly", "Yearly"];
  const typeOptions = ["Subscription", "Expense", "Income", "Bill", "Reminder"];
  function handleChange(e) {
    setId(e.target.value);
  }
  useEffect(() => {
    if (method == "cash") {
      setId("");
    }
  }, [method]);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-1/2">
        <Form method="POST">
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="street-address"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Title
                  </label>
                  <div className="mt-2">
                    <input
                      id="title"
                      name="title"
                      type="text"
                      autoComplete="title"
                      placeholder="Spotify/Netflix/Groceries"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="street-address"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Frequency
                  </label>
                  <div className="mt-2">
                    <Dropdown
                      name="frequency"
                      options={freqOptions}
                      selected={frequency}
                      setSelected={setFrequency}
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="street-address"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Type
                  </label>
                  <div className="mt-2">
                    <Dropdown
                      name="type"
                      options={typeOptions}
                      selected={type}
                      setSelected={setType}
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="amount"
                    className="block text-sm/6 font-semibold text-gray-900"
                  >
                    Amount
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                      <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                        <select
                          id="currency"
                          name="currency"
                          autoComplete="currency"
                          aria-label="Curency"
                          className="col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pr-7 pl-3.5 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        >
                          <option>INR</option>
                          <option>USD</option>
                          <option>EUR</option>
                        </select>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        />
                      </div>
                      <input
                        id="amount"
                        name="amount"
                        type="text"
                        placeholder=""
                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="date"
                    className="block text-sm/6 font-semibold text-gray-900"
                  >
                    Date
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      name="date"
                      id="date"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="category"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Category
                  </label>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <button
                        type="button"
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`text-sm px-3 py-2 rounded-full border ${
                          selectedCategory === category
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-indigo-50 text-indigo-700 border-indigo-200"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  <input
                    type="hidden"
                    name="category"
                    value={selectedCategory}
                  />
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="street-address"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Method Mode
                  </label>
                  <div className="mt-2">
                    <Dropdown
                      name="method"
                      options={methodOptions}
                      selected={method}
                      setSelected={setMethod}
                    />
                  </div>
                </div>
                {method == "cash" ? (
                  <></>
                ) : (
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="id"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Choose {method}
                    </label>
                    <div className="mt-2">
                      <div className="mt-2.5 grid grid-cols-1">
                        <select
                          value={id}
                          onChange={handleChange}
                          name="id"
                          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        >
                          {method == "card"
                            ? user.creditCards.map((card) => (
                                <option
                                  value={card._id}
                                  key={card._id}
                                >{`${card.name}/${card.lastFour}`}</option>
                              ))
                            : method == "bank"
                            ? user.bankAccounts.map((bank) => (
                                <option
                                  value={bank._id}
                                  key={bank._id}
                                >{`${bank.bankName}/${bank.bankMethod}`}</option>
                              ))
                            : user.upiIds.map((upi) => (
                                <option
                                  value={upi._id}
                                  key={upi._id}
                                >{`${upi.name}/${upi.upi}`}</option>
                              ))}
                        </select>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="col-span-full">
                  <label
                    htmlFor="notes"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Notes
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      defaultValue={""}
                    />
                  </div>
                  <p className="mt-3 text-sm/6 text-gray-600">
                    Write a note for additional information.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <a
              href="/dashboard"
              className="text-sm/6 font-semibold text-gray-900"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
