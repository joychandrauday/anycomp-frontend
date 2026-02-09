import FAQSection from "@/components/home/FaqSection";
import GetStartedSection from "@/components/home/GetStartedSection";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import ProductOverView from "@/components/home/ProductOverView";
import Services from "@/components/home/Services";
import Footer from "@/components/navigation/Footer";
import { secretaryService } from "@/services/secretaryService";
import { specialistService } from "@/services/specialistService";

export default async function HomePage() {
  const secretaryData = await secretaryService.getAll();
  const specialistData = await specialistService.getAll();
  console.log(secretaryData, specialistData);
  return (
    <>
      {/* <Navbar /> */}
      <Hero user={secretaryData.data} />
      <HowItWorks />
      <GetStartedSection data={specialistData.data} />
      <Services />
      <ProductOverView />
      <FAQSection />
      <Footer />
    </>
  );
}
