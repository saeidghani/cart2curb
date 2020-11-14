import React, { useState} from 'react';
import { Row, Col } from 'antd';
import {
    CarouselProvider, DotGroup, ImageWithZoom, Slide, Slider, Image
} from 'pure-react-carousel';
import './styles.less';

const ProductCarousel = ({slides, ...props}) => {
    const [slide, setSlide] = useState(0)
    const [bottomSlide, setBottomSlide] = useState(0);

    const changeSlideHandler = (index) => {
        setSlide(index)
        if(slides.length === 1) {
            setBottomSlide(index);
        } else if(slides.length === 2) {
            setBottomSlide(0);
        } else {
            if((index + 1 >= slides.length - 2)) {
                setBottomSlide(slides.length - 3);
            } else {
                setBottomSlide(index);
            }
        }
    }

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24}>
                <CarouselProvider
                    visibleSlides={1}
                    totalSlides={slides.length}
                    step={1}
                    currentSlide={slide}
                    naturalSlideWidth={396}
                    naturalSlideHeight={384}
                    hasMasterSpinner
                    isPlaying={false}
                >
                    <Slider>
                        {slides.map((item, index) => {
                            return (
                                <Slide key={item + index} index={index} onClick={changeSlideHandler.bind(this, index)} >
                                    <div className="w-full h-full" style={{ padding: '0 6px'}}>
                                        <ImageWithZoom src={item} className={' border border-overline'} style={{ backgroundPosition: 'center' }} />
                                    </div>
                                </Slide>
                            )
                        })}
                    </Slider>
                </CarouselProvider>
            </Col>
            <Col xs={24}>
                <CarouselProvider
                    visibleSlides={3}
                    totalSlides={slides.length}
                    step={1}
                    currentSlide={bottomSlide}
                    naturalSlideWidth={128}
                    naturalSlideHeight={120}
                    hasMasterSpinner
                    isPlaying={false}
                >
                    <Slider>
                        {slides.map((item, index) => {
                            return (
                                <Slide key={item + index + 'dots'} index={index} onClick={changeSlideHandler.bind(this, index)}>
                                    <div className="w-full h-full" style={{ padding: '0 6px'}}>
                                        <Image src={item} className={' border border-overline'}/>
                                    </div>
                                </Slide>
                            )
                        })}
                    </Slider>
                </CarouselProvider>
            </Col>
        </Row>
    );
}

export default ProductCarousel;