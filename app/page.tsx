
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureHighlights from "./components/FeatureHighlights"; // Platforms
import Features from "./components/Features"; // Services
import SiteReference from "./components/SiteReference"; // Success Stories
import Blog from "./components/Blog"; // Insights
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import ScrollToTop from "./components/ScrollToTop";

export default function Home() {
  return (
    <main className="min-h-screen relative bg-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <div>
        <Features />
      </div>
      <div id="platforms">
        <FeatureHighlights />
      </div>
      <SiteReference />
      <Blog />
      <Pricing />
      <Contact />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
