import {Link, Form} from 'react-router-dom'
import { useState } from 'react';

export default function CardTable({cards}) {
  const len=cards.length;
  const [isSubmitting, setIsSubmitting]=useState(false);
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-4 mb-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Cards</h1>
          <p className={`mt-2 text-sm ${len?'text-gray-700':'text-red-700'}`}>
            {len?'A list of all your cards.':'Please add your cards'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="card"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Card
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
                      Card Name
                    </th>
                    <th scope="col" className="w-4/14 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Last Four Digits
                    </th>
                    <th scope="col" className="w-3/14 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Provider
                    </th>
                    <th scope="col" className="w-1/14 relative py-3.5 pr-4 pl-3 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {cards.map((card, index) => (
                    <tr key={card.lastFour}>
                      <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">{index+1}</td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {card.name}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{card.lastFour}</td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{card.provider}</td>
                      <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                        <Link to={`edit/${card._id}`} className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only">, {card.name}</span>
                        </Link>
                      </td>
                      <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                      <Form method='post'>
                        <input name='id' hidden={true} value={card._id} onChange={() => {}}/>
                        <button type='submit' className={`text-red-600 hover:text-red-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSubmitting} onClick={() => setIsSubmitting(true)}>
                          {isSubmitting? 'Deleting...': 'Delete'}<span className="sr-only">, {card.name}</span>
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