import React, { useRef } from 'react'
import { FAB } from '../../components';

const withSample = WrappedComponent => props => {
  const buttonControls = useRef()
  return (
    <>
      <WrappedComponent {...props} />
      <FAB
        ref={buttonControls}
      />
    </>
  )
}
