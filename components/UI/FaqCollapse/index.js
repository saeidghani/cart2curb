import React, {useRef, useEffect, useState} from 'react';
import { DownOutlined } from '@ant-design/icons';

import './styles.less';
import {Remarkable} from "remarkable";

const md = new Remarkable();

const FaqCollapse = ({question, answer, ...props}) => {
    const [active, setActive] = useState(false);
    const header = useRef(null)
    const collapse = useRef(null)
    const content = useRef(null);

    useEffect(() => {
        if(active) {
            const contentRect = content.current.getBoundingClientRect();
            collapse.current.style.maxHeight = `${contentRect.height}px`;
        } else {
            collapse.current.style.maxHeight = 0;
        }
    }, [active])

    const toggleCollapse = () => {
        setActive(active => !active);
    }

    const classes = ['faq-collapse'];
    if(active) {
        classes.push('active');
    }

    return (
        <div className={classes.join(" ")}>
            <div className="faq-collapse__header flex justify-between" ref={header} onClick={toggleCollapse}>
                <span className="text-type">{question}</span>
                <span className="text-faq">
                    <DownOutlined className={'faq-collapse__icon'}/>
                </span>
            </div>
            <div className="faq-collapse__content" ref={collapse}>
                <div className="faq-collapse__inner whitespace-pre-wrap text-cell text-xs" ref={content}
                     dangerouslySetInnerHTML={{ __html: md.render(answer) }} />
            </div>
        </div>
    )
}

export default FaqCollapse;