import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SearchWidget from "@/components/SearchWidget";
import LatestNews from "@/components/LatestNews";
import Collections from "@/components/Collections";
import ImageNav from "@/components/ImageNav";
import Testimonials from "@/components/Testimonials";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <SearchWidget />
      <LatestNews />
      <Collections />
      <ImageNav />
      <Testimonials />
      <CTABanner />
      <Footer />
    </main>
  );
}
