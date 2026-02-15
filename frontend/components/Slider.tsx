"use client"

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Slider = () => {

    const containerRef = useRef(null);
    const rowRef = useRef(null);

    const images = [
        "Slider (1).jpeg",
        "Slider (2).jpeg",
        "Slider (3).jpeg",
        "Slider (4).jpeg",
        "Slider (5).jpeg",
        "Slider (6).jpeg",
        "Slider (7).jpeg",
        "Slider (8).jpeg",
    ];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {

            const t1 = gsap.timeline({
                repeat: -1,
                defaults: { ease: "none" }
            });

            t1.to(rowRef.current, {
                xPercent: -50,
                duration: 20
            });


            ScrollTrigger.create({
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",

                onUpdate: (self) => {
                    const velocity = Math.abs(self.getVelocity());

                    const timeScale = 1 + velocity / 500;

                    gsap.to(t1, {
                        timeScale: timeScale,
                        duration: 0.5,
                        overwrite: true
                    });


                    gsap.to(t1, {
                        timeScale: 1,
                        duration: 1.5,
                        ease: "power1.inOut",
                        overwrite: "auto",
                        delay: 0.1
                    })

                }

            })

        }, containerRef)

        return () => ctx.revert();

    }, []);


    return (
        <div ref={containerRef} className="w-full h-[400px] overflow-hidden mt-10">
            <div ref={rowRef} className="flex gap-4 w-max h-full">
                {[...images, ...images].map((image, index) => (
                    <img key={index} src={image} alt="Slider" className="w-full h-full object-cover rounded-lg" />
                ))}

            </div>
        </div>
    );
};

export default Slider;