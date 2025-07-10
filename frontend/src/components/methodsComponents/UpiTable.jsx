import {Link} from 'react-router-dom'

export default function UpiTable({upis}) {
    const len=upis.length;
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-4 mb-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">UPI Accounts</h1>
          <p className={`mt-2 text-sm ${len?'text-gray-700':'text-red-700'}`}>
            {len?'A list of all the upi accounts.':'Please add your upi accounts'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="upi"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add upi
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
                    <th scope="col" className="w-4/14 py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      S.No
                    </th>
                    <th scope="col" className="w-5/14 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Platform Name
                    </th>
                    <th scope="col" className="w-4/14 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      UPI ID
                    </th>
                    <th scope="col" className="w-1/14 relative py-3.5 pr-4 pl-3 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {upis.map((upi, index) => (
                    <tr key={upi.upi}>
                      <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">{index+1}</td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {upi.name}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{upi.upi}</td>
                      <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only">, {upi.name}</span>
                        </a>
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