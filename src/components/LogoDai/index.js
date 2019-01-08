import React from 'react'
import logoSokol from './logo.svg'
import { NavLink } from 'react-router-dom'

export const LogoDai = ({ href = null, extraClass = '' }) => {
  return (
    <NavLink to={href} className={`sw-LogoDai ${extraClass}`}>
      <img className="sw-LogoDai_Image" src={logoSokol} alt="" />
    </NavLink>
  )
}
