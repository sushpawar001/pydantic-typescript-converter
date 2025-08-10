import React from "react";
import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { ConversionClient } from "./ConversionClient";
import { FeaturesSection } from "./FeaturesSection";
import { Footer } from "./Footer";

export default function AppShell() {
    return (
        <div>
            <div className="page">
                <Header />
                <HeroSection />
                <ConversionClient />
                <FeaturesSection />
                <Footer />
            </div>
        </div>
    );
}
