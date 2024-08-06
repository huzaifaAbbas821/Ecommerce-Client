import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (

    <div className="max-w-[100vw] bg-slate-900  p-4 md:flex md:items-center md:justify-between">
      <span className="text-sm text-gray-100 sm:text-center dark:text-gray-400">© 2023 Wish™. All Rights Reserved.
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-100 dark:text-gray-400 sm:mt-0">
        <li>
            <Link  className="hover:underline me-4 md:me-6">About</Link>
        </li>
        <li>
            <Link  className="hover:underline me-4 md:me-6">Privacy Policy</Link>
        </li>
        <li>
            <Link  className="hover:underline me-4 md:me-6">Licensing</Link>
        </li>
        <li>
            <Link  className="hover:underline">Contact</Link>
        </li>
    </ul>
    </div>
    );
}

export default Footer;
