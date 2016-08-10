import React from 'react'
import {connect} from 'react-redux'

export default ({messages}) => {
  return <div>
    {
      messages?
      messages.map((msg) => {
        return <div>{msg.message}</div>
      }):''
    }
  </div>
}
