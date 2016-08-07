import React from 'react'

export default ({children}) => {
  return <div className="pure-g">
    <div className="pure-u-2-24"></div>
    <div className="pure-u-20-24">
      {children}
    </div>
    <div className="pure-u-2-24"></div>
  </div>
}
