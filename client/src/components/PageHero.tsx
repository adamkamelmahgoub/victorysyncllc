
import React from "react";

type Props = {
  title: string;
  subtitle?: string;
};

export default function PageHero({ title, subtitle }: Props) {
  return (
    <section className="bg-vs-hero">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-16 sm:py-20 lg:py-24 text-center text-white">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
          {subtitle ? (
            <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg opacity-90">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
