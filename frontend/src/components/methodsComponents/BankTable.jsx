import {Link, Form} from 'react-router-dom'

export default function BankTable({banks}) {
    const len=banks.length;
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-4 mb-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Banks</h1>
          <p className={`mt-2 text-sm ${len?'text-gray-700':'text-red-700'}`}>
            {len?'A list of all your banks.':'Please add yours banks'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="bank"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Bank
          </Link>
        </div>
      </div>
      {len?<div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="w-2/14 py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      S.No
                    </th>
                    <th scope="col" className="w-4/14 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Bank Name
                    </th>
                    <th scope="col" className="w-4/14 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Method Name
                    </th>
                    <th scope="col" className="w-3/14 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Account Type
                    </th>
                    <th scope="col" className="w-1/14 relative py-3.5 pr-4 pl-3 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {banks.map((bank, index) => (
                    <tr key={index}>
                      <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">{index+1}</td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {bank.bankName}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{bank.bankMethod}</td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{bank.accountType}</td>
                      <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                        <Link to={`edit/${bank._id}`} className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only">, {bank.bankName}</span>
                        </Link>
                      </td>
                      <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                      <Form method="POST">
                        <input name='id' hidden={true} value={bank._id}/>
                        <button type='submit' className="text-red-600 hover:text-red-900">
                          Delete<span className="sr-only">, {bank.name}</span>
                        </button>
                        </Form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>:<></>}
    </div>
  )
}