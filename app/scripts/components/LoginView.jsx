import React from 'react'

export default ({children}) => {
  return <div className="pure-g yaca-vcenter">
    <div className="pure-u-1-3"></div>
    <div className="pure-u-1-3">
      {children}
    </div>
    <div className="pure-u-1-3"></div>
  </div>
}
