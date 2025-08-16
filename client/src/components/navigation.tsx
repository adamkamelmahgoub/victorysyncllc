
import React from 'react';
import { NavLink } from "react-router-dom";
import SmartLink from "@/components/SmartLink";

export default function Navigation() {
  const link = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 ${isActive ? "underline" : "hover:underline"}`;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto h-14 px-4 flex items-center justify-between">
        {/* logo goes home */}
        <SmartLink to="/" className="font-bold text-black">VictorySync</SmartLink>

        <nav className="flex items-center gap-2">
          <NavLink to="/" end className={link}>Home</NavLink>
          <NavLink to="/services" className={link}>Services</NavLink>
          <NavLink to="/pricing" className={link}>Pricing</NavLink>
          <NavLink to="/about" className={link}>About</NavLink>
          <NavLink to="/contact" className={link}>Contact</NavLink>

          {/* outline style button; class names can be your Tailwind button system */}
          <NavLink to="/signin" className="ml-2 btn btn-md btn-secondary">Sign In</NavLink>
        </nav>
      </div>
    </header>
  );
}
