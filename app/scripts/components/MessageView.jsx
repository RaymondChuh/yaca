import React from 'react'
import {connect} from 'react-redux'

export default ({messages}) => {
  return (
    <div>
      {
        messages?
        messages.map((msg) => {
          return (
            <div key={msg.id}>
              <div>
                <strong>
                {msg.user && msg.user.displayName}
                </strong>
              </div>
              <div>{msg.message}</div>
            </div>
          )
        }):''
      }
    </div>
  )
}
