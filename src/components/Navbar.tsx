'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
       document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 py-6 px-4 md:px-12 flex justify-between items-center z-50 bg-gradient-to-b from-bg-primary to-transparent">
      <Link href="/" className="font-mono text-xl font-semibold text-accent tracking-tighter hover:text-white transition-colors">
        ade.dev
      </Link>

      <ul className="hidden md:flex gap-10 list-none">
        {['about', 'skills', 'projects', 'contact'].map((item) => (
          <li key={item}>
            <Link href={`#${item}`} className="font-mono text-sm text-text-secondary hover:text-accent transition-colors relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
        ))}
      </ul>

      <button
        className={`md:hidden p-2 z-[101] bg-transparent border-none cursor-pointer relative w-8 h-8 flex items-center justify-center`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-accent absolute transition-all duration-300
          ${isOpen ? 'bg-transparent' : ''}
          before:content-[''] before:absolute before:w-6 before:h-0.5 before:bg-accent before:transition-all before:duration-300 before:top-[-8px] before:left-0
          ${isOpen ? 'before:top-0 before:rotate-45' : ''}
          after:content-[''] after:absolute after:w-6 after:h-0.5 after:bg-accent after:transition-all after:duration-300 after:top-[8px] after:left-0
          ${isOpen ? 'after:top-0 after:-rotate-45' : ''}
        `}></span>
      </button>

      <div className={`fixed inset-0 bg-bg-primary flex flex-col justify-center items-center gap-8 z-[99] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {['about', 'skills', 'projects', 'contact'].map((item) => (
          <Link
            key={item}
            href={`#${item}`}
            onClick={closeMenu}
            className="font-mono text-2xl text-text-secondary hover:text-accent transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
