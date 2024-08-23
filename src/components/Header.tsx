// import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.header`
  background: black;
  margin: 0;
`

const Title = styled.span`
    color: white;
`

const Header = () => {
  return (
    <Wrapper>
      <Title>Routin Checker</Title>
    </Wrapper>
  )
}

export default Header