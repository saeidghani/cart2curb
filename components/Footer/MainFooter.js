import React from 'react';
import routes from "../../constants/routes";
import Link from "next/link";

const Footer = props => {
    return (
        <footer className="bg-secondary w-full px-6 md:px-30 pt-15 text-white relative">
            <div className="flex items-stretch md:items-start flex-col md:flex-row">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-y-11 pb-8 flex-grow">
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
            <div className="pt-13 pb-20 border-t border-paragraph flex flex-row justify-between items-center">
                <span className="col-span-1  text-xs"> 2021 Cart2Curb Copyright </span>
                <img src="/images/logo-footer.png" alt="logo" className="cursor-pointer" style={{ width: 60, height: 48 }} />
            </div>
        </footer>
    )
}

export default Footer;