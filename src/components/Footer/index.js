import React from 'react'
import moment from 'moment'
import Socials from '../Socials'
import { constants } from '../../utils/constants'

const Footer = ({ netId }) => {
  const footerClassName = netId in constants.NETWORKS && constants.NETWORKS[netId].TESTNET ? 'sokol' : ''

  return (
    <footer className={`footer ${footerClassName}`}>
      <div className="container">
        <a href="/">
          <i className="footer-logo" />
        </a>
        <p className="footer-rights">{moment().format('YYYY')} POA. All rights reserved.</p>
        <Socials />
      </div>
    </footer>
  )
}

export default Footer
