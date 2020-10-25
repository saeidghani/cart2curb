import React from 'react';
import Link from "next/link";
import { EyeOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  max-height: 280px;
  position: relative;
  overflow: hidden;
  
  &:hover div {
    opacity: 1;
    visibility: visible;
  }
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255,75,69, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  cursor: pointer;
  transition: all ease .3s;
  will-change: opacity, visibility;
`

const ProductCard = props => {
    return (
        <Wrapper className={'border border-overline'}>
            <Image src={'/images/temp/product1.jpg'} alt={'image title'}/>
            <Link href={'/stores'}>
                <Overlay>
                    <EyeOutlined className={'text-white text-3xl'}/>
                </Overlay>
            </Link>

        </Wrapper>
    )
}

export default ProductCard;