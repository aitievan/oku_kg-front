import Banner from "@/components/Banner";
import PopularBooks from "@/components/PopularBooks";
import BookStats from "@/components/BookStats";
import NewBooks from "@/components/NewBooks";
import Image from "next/image";
import TagCarousel from "@/components/TagCarousel";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Banner />
      
      <div className="container mx-auto px-4 py-8">
        <PopularBooks />
        
        <section className="my-12 w-full max-w-7xl mx-auto overflow-hidden rounded-lg shadow-md">
          <Image
            src="/20скидка.jpg"
            alt="Баннер"
            width={1200}
            height={400}
            className="object-cover w-full h-auto"
          />
        </section>
        
        <NewBooks />
        
        <TagCarousel />
      </div>
      
      <BookStats />
    </div>
  );
}
