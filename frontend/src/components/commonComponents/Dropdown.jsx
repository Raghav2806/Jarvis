import { ChevronDownIcon } from '@heroicons/react/16/solid'
export default function Dropdown({name, options, selected, setSelected}) {
    function handleChange(e){
        setSelected(e.target.value);
    }
    function formatTitle(method) {
        if (method == "upi") return "UPI";
        return method.charAt(0).toUpperCase() + method.slice(1);
    }
  return (
    <div className="sm:col-span-3">
          <div className="mt-2.5 grid grid-cols-1">
            <select value={selected} onChange={handleChange} name={name} className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
              {options.map((option) => <option value={option} key={option}>{formatTitle(option)}</option>)}
            </select>
            <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
          </div>
        </div>
  )
}
