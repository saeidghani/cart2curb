import React from 'react';

import DriverPage from '../../../components/DriverPage';
import DriverAuth from '../../../components/Driver/DriverAuth';

const CurrentOrders = () => {

const DetailInfo = ({title, description, borderLess}) => (
    <div className={`grid grid-cols-5 gap-x-1 ${borderLess ? 'px-4 pt-4' : 'p-4'}`} style={borderLess ? {} : {borderBottom: '1px solid #D9D9D9'}}>
        <div className="text-muted col-span-2">{title}</div>
        <div className="col-start-3 col-span-3">{description}</div>
    </div>
);

    return (
        <DriverAuth>
            <DriverPage title="Customer Orders">
                <div className="w-full bg-muted py-3" style={{backgroundColor: 'rgba(114, 122, 139, 0.05)'}}>
                    <div className="flex space-x-2 p-4" style={{borderBottom: '1px solid #D9D9D9'}}>
                        <img src="" alt="" width={56}/>
                        <div className="ml-3">Choice Beef Brisket Chunk</div>
                    </div>
                    <DetailInfo title={"Quantity/Weight"} description={"1"} borderLess/>
                    <DetailInfo title={"Substitutions"} description={"I explained that in the note"}/>
                    <DetailInfo
                        title="Store Address"
                        description={"Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.\n" +
                        "Velit officia consequat duis enim velit mollit. Exercitation veniam consequat\n" +
                        "sunt nostrud amet."}
                        borderLess
                    />
                </div>
            </DriverPage>
        </DriverAuth>
    )
};

export default CurrentOrders;