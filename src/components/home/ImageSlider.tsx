"use client";

import { Box } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
    "/bannerbg1.png",
    "/bannerbg2.png",
];

export default function ImageSlider() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    return (
        <Box
            position="relative"
            height={320}
            borderRadius={3}
            overflow="hidden"
            boxShadow={3}
        >
            <Image
                src={images[index]}
                alt="Hero image"
                fill
                style={{ objectFit: "cover" }}
                priority
            />
        </Box>
    );
}
