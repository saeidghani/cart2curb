import React, { useState} from 'react';
import { Row, Col } from 'antd';
import {
    CarouselProvider, DotGroup, ImageWithZoom, Slide, Slider, Image
} from 'pure-react-carousel';
import './styles.scss';

const ProductCarousel = ({slides, ...props}) => {
    const [slide, setSlide] = useState(0)
    return (
        <Row gutter={[16, 16]}>
            <Col xs={24}>
                <CarouselProvider
                    visibleSlides={1}
                    totalSlides={slides.length}
                    step={1}
                    currentSlide={slide}
                    naturalSlideWidth={400}
                    naturalSlideHeight={450}
                    hasMasterSpinner
                    isPlaying={false}
                >
                    <Slider>
                        {slides.map((item, index) => {
                            return (
                                <Slide key={item + index} index={index}>
                                    <div className="px-2 w-full h-full">
                                        <ImageWithZoom src={item} className={' border border-overline'} />
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
                    currentSlide={slide}
                    naturalSlideWidth={128}
                    naturalSlideHeight={120}
                    hasMasterSpinner
                    isPlaying={false}
                >
                    <Slider>
                        {slides.map((item, index) => {
                            return (
                                <Slide key={item + index + 'dots'} index={index} onClick={setSlide.bind(this, index)}>
                                    <div className="px-2 w-full h-full">
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