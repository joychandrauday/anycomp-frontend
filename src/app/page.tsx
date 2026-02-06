import GetStartedSection from "@/components/home/GetStartedSection";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Services from "@/components/home/Services";
import Footer from "@/components/navigation/Footer";
import Navbar from "@/components/navigation/Navbar";
import { secretaryService } from "@/services/secretaryService";

export default async function HomePage() {
  const secretaryData = await secretaryService.getAll();

  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <GetStartedSection data={secretaryData.data} />
      <Services />
      <Footer />
    </>
  );
}
