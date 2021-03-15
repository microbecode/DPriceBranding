import * as React from 'react'
import styled from 'styled-components'

import shirt from './tshirt.png'

const GalleryFrame = styled.div`
  width: 100%;
  height: 80%;
  min-height: 258px;
  display: flex;
  align-items: center;
  flex-direction: center;
  /* background-color: ${props => props.theme.black}; */
  box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.05);
 
`

const ImgStyle = styled.img`
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  /* background-color: ${props => props.theme.black}; */
  background-color: ${props => props.theme.textColor};
`

export default function Gallery() {
  return (
    <GalleryFrame>
      <ImgStyle src={shirt} alt="Logo" />
    </GalleryFrame>
  )
}
