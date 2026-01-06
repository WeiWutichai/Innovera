
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import SiteReference from "./components/SiteReference";
import Stats from "./components/Stats";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import ScrollToTop from "./components/ScrollToTop";

export default function Home() {
  return (
    <main className="min-h-screen relative bg-[#050505] overflow-x-hidden">
      <div className="fixed inset-0 z-0 select-none pointer-events-none">
        <img
          src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/af0a80bd-7501-40ee-990b-69ed1cfcde25_3840w.jpg"
          alt=""
          className="w-full h-full object-cover animate-wave opacity-90"
        />
      </div>
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <Stats />
        <SiteReference />
        <SiteReference />

        <Pricing />
        <FAQ />
        <Contact />
        <Footer />
        <ScrollToTop />
      </div>
    </main>
  );
}
