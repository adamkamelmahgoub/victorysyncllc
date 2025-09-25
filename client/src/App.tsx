import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/LOGO VS.png";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="w-full border-b shadow-sm sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <img src={logo} alt="Victory Sync" className="h-10" />
          <nav className="space-x-6 hidden md:flex">
            <a href="#" className="text-sm hover:text-blue-600 font-medium">
              Solutions
            </a>
            <a href="#" className="text-sm hover:text-blue-600 font-medium">
              Industries
            </a>
            <a href="#" className="text-sm hover:text-blue-600 font-medium">
              Resources
            </a>
            <a href="#" className="text-sm hover:text-blue-600 font-medium">
              Pricing
            </a>
          </nav>
          <div className="space-x-4 hidden md:flex">
            <Button variant="ghost" className="text-sm">
              Log In
            </Button>
            <Button className="text-sm">Get a Demo</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Outsourced CX, Done Better
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Victory Sync helps U.S. businesses extend hours, cut costs, and
            deliver exceptional support through our Cairo-based CX teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="text-sm px-6 py-3">
              Book a Free Strategy Call
            </Button>
            <Button variant="outline" className="text-sm px-6 py-3">
              See Pricing
            </Button>
          </div>
        </div>
        <div>
          <img
            src="/vs_avatar_400.png"
            alt="Victory Sync Agents"
            className="w-full rounded-xl shadow-md"
          />
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-blue-600 py-10 text-white text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Ready to scale support for less?
        </h2>
        <Button variant="secondary" className="text-sm">
          Get Started with Victory Sync{" "}
          <ArrowRight className="inline ml-2 w-4 h-4" />
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 text-sm text-gray-500 text-center">
        © 2025 Victory Sync. All rights reserved.
      </footer>
    </div>
  );
}
