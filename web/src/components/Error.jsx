import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

const Error = ({ children }) => {
  return (
    <>
      <div className="flex items-center text-sm font-semibold text-red-500">
        <ExclamationCircleIcon className="mr-2 h-5 w-5" />
        {children}
      </div>
    </>
  )
}

export default Error
