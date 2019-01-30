import React from 'react'

export const IconSet = ({ networkBranch }) => {
  return (
    <svg className={`nl-IconSet`} xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <path
        className={`nl-IconSet_Path nl-IconSet_Path-${networkBranch}`}
        d="M17 18H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1zM16 2H2v14h14V2zM5 4h4a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2zm0 4h8a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2zm0 4h1a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2zm4 0h4a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2zm4-6h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2z"
        fillRule="evenodd"
      />
    </svg>
  )
}
