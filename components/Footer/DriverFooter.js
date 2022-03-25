import React from 'react';
import routes from "../../constants/routes";
import Link from "next/link";

const Footer = props => {

    return (
        <footer className="bg-secondary w-full px-6 pt-12">
            <div className="flex flex-col space-y-6 pb-8">
                <Link href={routes.contact}>
                    <span className="cursor-pointer text-base" style={{color: '#CAD5E9'}}>Contact Us</span>
                </Link>
                <Link href={routes.about}>
                    <span className="text-base cursor-pointer" style={{color: '#CAD5E9'}}>About Us</span>
                </Link>
                <Link href={routes.faq}>
                    <span className="text-base cursor-pointer" style={{color: '#CAD5E9'}}> FAQ(s) </span>
                </Link>
                <Link href={routes.vendors.auth.login}>
                    <span className="text-base cursor-pointer" style={{color: '#CAD5E9'}}> Ask Us to Host Your Local Products </span>
                </Link>
                <Link href={routes.driver.auth.register}><span className="col-span-2 text-base" style={{color: '#CAD5E9'}}> Drive For Us </span></Link>
            </div>
            <div className="pt-12 pb-10 border-t border-paragraph flex flex-row justify-center items-center">
                <span className="text-xs text-center" style={{color: '#CAD5E9'}}> 2021 Cart2Curb Copyright </span>
            </div>
        </footer>
    )
}

export default Footer;