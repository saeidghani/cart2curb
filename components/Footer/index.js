import React from 'react';
import routes from "../../constants/routes";
import Link from "next/link";

const Footer = props => {
    return (
        <footer className="bg-secondary w-full px-6 md:px-30 pt-15 text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-y-11 pb-8">
                <Link href={routes.contact}>
                    <span className="col-span-1 cursor-pointer text-base">Contact Us</span>
                </Link>
                <span className="col-span-1 text-base"> FAQ(s) </span>
                <span className="col-span-2 text-base"> Ask Us to Host Your Local Products </span>

                <Link href={routes.contact}>
                    <span className="col-span-1 text-base cursor-pointer">About Us</span>
                </Link>
                <span className="col-span-1 text-base"> Report Page </span>
                <span className="col-span-2 text-base"> Drive For Us </span>
            </div>
            <div className="pt-13 pb-20 border-t border-paragraph flex flex-row justify-between items-center">
                <span className="col-span-1  text-xs"> 2020 Cart2Curb Copyright </span>
                <img src="/images/logo-footer.png" alt="logo" className="cursor-pointer" />
            </div>
        </footer>
    )
}

export default Footer;