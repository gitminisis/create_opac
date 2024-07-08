import React from 'react'

const PrintPage = () => {
  return (
    <button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 hover:bg-gray-200">Print this page</button>
  )
}

export default PrintPage
