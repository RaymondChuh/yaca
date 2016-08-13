import React from 'react'
import {connect} from 'react-redux'

export default ({messages}) => {
  return <div>
    {
      messages?
      messages.map((msg) => {
        return <div key={msg.id}>{msg.message}</div>
      }):''
    }
  </div>
}
