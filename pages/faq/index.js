import React from 'react';
import { Row, Col } from 'antd';

import Page from '../../components/Page';
import FaqCollapse from "../../components/UI/FaqCollapse";
import faqQuestions from '../../constants/faq.json';
import './styles.scss';

const FAQ = props => {
    return (
        <Page title={false} headTitle={'FAQs'} breadcrumb={[{ title: 'FAQs'}]}>
            <Row className={'faq'} gutter={[24, 40]}>
                <Col xs={24} md={12} className={'order-last md:order-first'}>
                    <Row gutter={[24, 24]}>
                        <Col xs={24}>
                            <h1 className={'text-type text-2xl font-medium mt-0 mb-4'}>FAQs</h1>
                        </Col>
                        {Array.from(faqQuestions).map((item, index) => {
                            return (
                                <Col xs={24} key={`question-${index}`}>
                                    <FaqCollapse
                                        question={item.question}
                                        answer={item.answer}
                                    />
                                </Col>
                            )
                        })}

                    </Row>
                </Col>
                <Col xs={24} md={12}>
                    <div className="faq__visual mb-16 mt-0 md:mt-12 md:mb-0">
                        <img src={'/images/faq.png'} alt={'FAQs'} className={'faq__image'}/>
                    </div>
                </Col>
            </Row>
        </Page>
    )
}

export default FAQ;