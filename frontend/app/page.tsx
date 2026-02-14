import ContactUs from "@/components/ContactUs";

const Page = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {/* Background Image */}
        <img
          src="/HomeImage.png"
          alt="Hero Image"
          className="w-full h-full object-cover object-top"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-opacity-40 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome to Poshak Fabrics
          </h1>
          <p className="text-lg md:text-2xl text-white mb-6 max-w-xl">
            Discover premium fabrics that inspire creativity and elegance.
          </p>
          <div className="flex gap-4">
            <button className="bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400 transition">
              Shop Now
            </button>
            <button className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-black transition">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about">
        <h2 className="text-4xl font-bold text-center mb-8 mt-8">About Us</h2>
        <p className="text-lg text-center max-w-2xl mx-auto">
          Poshak Fabrics is a premium ethnic wear brand that offers a unique blend of traditional and modern design. Our fabrics are handcrafted with care and attention to detail, ensuring that each piece is a work of art. We are committed to providing our customers with the best possible experience, and we are always striving to improve our products and services.
        </p>
      </div>
      <div id="contact">
        <ContactUs />
      </div>
    </div>
  );
};

export default Page;
