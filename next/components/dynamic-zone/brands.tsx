"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import { AnimatePresence, motion } from "framer-motion";
import { strapiImage } from "@/lib/strapi/strapiImage";

export const Brands = ({ heading, sub_heading, logos }: { heading: string, sub_heading: string, logos: any[] }) => {
  
  // 1. Initial Logic to split logos
  const safeLogos = Array.isArray(logos) ? logos : [];
  const middleIndex = Math.floor(safeLogos.length / 2);
  const firstHalf = safeLogos.slice(0, middleIndex);
  const secondHalf = safeLogos.slice(middleIndex);
  
  // 2. State setup
  const [stateLogos, setLogos] = useState([firstHalf, secondHalf]);
  const [activeLogoSet, setActiveLogoSet] = useState(firstHalf);

  // 3. CRITICAL FIX: Update state when 'logos' prop changes (e.g. after API load)
  useEffect(() => {
    const mid = Math.floor(safeLogos.length / 2);
    const first = safeLogos.slice(0, mid);
    const second = safeLogos.slice(mid);
    setLogos([first, second]);
    setActiveLogoSet(first);
  }, [logos]); // Runs whenever Strapi data updates

  // 4. The Flip Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogos((currentLogos) => {
        const newLogos = [...currentLogos.slice(1), currentLogos[0]];
        setActiveLogoSet(newLogos[0]);
        return newLogos;
      });
    }, 3000); // 3 seconds flip time

    return () => clearTimeout(timer);
  }, [activeLogoSet]);

  return (
    <div className="relative z-20 py-10 md:py-40 bg-charcoal">
      <Heading className="pt-4 font-primary text-white">
        {heading}
      </Heading>
      <Subheading className="max-w-3xl mx-auto text-neutral-300 font-secondary">
        {sub_heading}
      </Subheading>

      <div className="flex gap-10 flex-wrap justify-center md:gap-40 relative h-full w-full mt-20 min-h-[120px]">
        <AnimatePresence mode="popLayout">
          {activeLogoSet.map((logo, idx) => (
            <motion.div
              /* THE SMOOTH TRANSITION YOU LIKED */
              initial={{
                y: 40,              // Start below
                opacity: 0,
                filter: "blur(10px)", // Start blurry
              }}
              animate={{
                y: 0,               // Slide to center
                opacity: 1,
                filter: "blur(0px)",  // Become clear
              }}
              exit={{
                y: -40,             // Slide up
                opacity: 0,
                filter: "blur(10px)", // Blur out
              }}
              transition={{
                duration: 0.8,
                delay: 0.1 * idx,   // Stagger for "wave" effect
                ease: [0.4, 0, 0.2, 1],
              }}
              key={logo.id || idx} // Use ID if available, else Index
              className="relative"
            >
              <Image
                src={strapiImage(logo.image.url)}
                alt={logo.image.alternativeText || "Brand"}
                width={400}
                height={400}
                /* Original Sizes & Colors */
                className="md:h-20 md:w-60 h-10 w-40 object-contain filter"
                draggable={false}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};