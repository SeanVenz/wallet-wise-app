import React from 'react'
import './NoInternetError.scss'
import gif from '../../images/no-internet.gif'

function NoInternetError() {
    return (
      <div className='no-internet-error'>
        <p>No Internet Connection</p>
        <img src={gif}></img>
        <p>Wild Connect Wifi ain't Wifi-ing</p>
      </div>
    );
  }

export default NoInternetError