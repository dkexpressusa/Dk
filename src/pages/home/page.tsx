import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import HeroBanner from './components/HeroBanner';
import ServiceSummary from './components/ServiceSummary';
import WhyUs from './components/WhyUs';
import CompanyIntro from './components/CompanyIntro';
import HowItWorks from './components/HowItWorks';
import HomeReviews from './components/HomeReviews';
import HomeFAQ from './components/HomeFAQ';
import HomeCTA from './components/HomeCTA';

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroBanner />
      <ServiceSummary />
      <WhyUs />
      <CompanyIntro />
      <HowItWorks />
      <HomeReviews />
      <HomeFAQ />
      <HomeCTA />
      <Footer />
    </div>
  );
}
