import React from 'react';
import routes from "../../constants/routes";
import Link from "next/link";
import {ArrowUpOutlined} from '@ant-design/icons';

const Footer = props => {


    const [offset, setOffset] = React.useState(false);

    React.useEffect(() => {
      window.onscroll = () => {
          if( window.pageYOffset > 50 ){
              setOffset(true)
            } else{
              setOffset(false)
          }
      }
    }, []);
  
    return (
        <>
            {(offset) ? 
            <a className='fixed  bg-secondary text-white rounded' style={{right: "15px", bottom: "15px" , padding: "2px 7px 7px", zIndex: "2"}} href='#top'>
                {/* <span className='mr-2'>Back To Top</span> */}
                <ArrowUpOutlined title="Back To Top" style={{fontSize: 20}}/>
            </a>
            : ' '}
            <footer className="bg-secondary w-full px-6 md:px-30 pt-15 text-white relative">
                <div className="flex items-stretch md:items-start flex-col md:flex-row mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-y-4 pb-4 flex-grow">
                        <Link href={routes.contact}>
                            <span className="col-span-2 md:col-span-1 cursor-pointer text-base">Contact Us</span>
                        </Link>

                        <Link href={routes.faq}>
                            <span className="col-span-2 md:col-span-1 text-base cursor-pointer"> FAQ(s) </span>
                        </Link>

                        <Link href={routes.vendors.auth.register.index}>
                            <span className="col-span-2 text-base cursor-pointer">Ask Us to Host Your Local Products</span>
                        </Link>

                        <Link href={routes.about}>
                            <span className="col-span-2 md:col-span-1 text-base cursor-pointer">About Us</span>
                        </Link>
                        <Link href={routes.vendors.auth.login}>
                            <span className="col-span-2 md:col-span-1 text-base cursor-pointer">Vendor Login </span>
                        </Link>
                        <Link href={routes.driver.auth.login}><span className="col-span-2 text-base cursor-pointer">Driver For Us / Driver login</span></Link>
                    </div>
                    <div>
                        <ul className={'flex items-center flex-row pb-8 md:pb-4'}>
                            <li>
                                <a href="https://www.instagram.com/cart2curb" target={'_blank'} rel={'noreferrer noopener'}>
                                    <img src={'/images/instagram.svg'} alt={'Instagram'}/>
                                </a>
                            </li>
                            <li className={'pl-3'}>
                                <a href="https://www.facebook.com/Cart2Curb" target={'_blank'} rel={'noreferrer noopener'}>
                                    <img src={'/images/facebook.svg'} alt={'Facebook'}/>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 pb-12 border-t border-paragraph flex flex-row justify-between items-center">
                    <span className="col-span-1  text-xs"> 2021 Cart2Curb Copyright</span>
                    <img src="/images/logo-footer.png" alt="logo" className="cursor-pointer"
                        style={{width: 60, height: 48}}/>
                </div>
            </footer>
        </>
    )
}

export default Footer;
