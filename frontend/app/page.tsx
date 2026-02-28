import ContactUs from "@/components/ContactUs";
import Slider from "@/components/Slider";
import CollectionsPreview from "@/components/CollectionsPreview";

const Page = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[600px] lg:h-[700px] overflow-hidden">
        {/* Background Image */}
        <img
          src="/HomeImage.png"
          alt="Hero Image"
          className="w-full h-full object-cover object-center sm:object-top"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4 md:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Welcome to Poshak Fabrics
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-6 max-w-xl">
            Discover premium fabrics that inspire creativity and elegance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400 transition w-full sm:w-auto">
              Shop Now
            </button>
            <button className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-black transition w-full sm:w-auto">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Slider Section */}
      <div className="my-8 md:my-12 lg:my-16">
        <Slider />
      </div>

      {/* Collections Preview Section */}
      <CollectionsPreview />

      {/* About Section */}
      <section id="about" className="py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 md:mb-8">
          About Us
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-center max-w-3xl mx-auto leading-relaxed">
          Poshak Fabrics is a premium ethnic wear brand that offers a unique blend
          of traditional and modern design. Our fabrics are handcrafted with care
          and attention to detail, ensuring that each piece is a work of art. We
          are committed to providing our customers with the best possible
          experience, and we are always striving to improve our products and
          services.
        </p>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-2 md:py-4 lg:py-6 px-4 md:px-8 lg:px-16"
      >
        <ContactUs />
      </section>
    </div>
  );
};

export default Page;