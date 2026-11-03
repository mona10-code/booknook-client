import Banner from "../components/Banner";
import NewArrivals from "../components/NewArrivals";
import HowItWorks from "../components/HowItWorks";
import TopCategories from "../components/TopCategories"; // নতুন যুক্ত হলো

export default function Home() {
  return (
    <main>
      <Banner />
      <NewArrivals /> 
      <HowItWorks />
      <TopCategories />
    </main>
  );
}