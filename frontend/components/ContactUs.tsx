const ContactUs = () => {
    return (
        <div className="min-h-screen flex flex-col items-center px-4 py-16">
            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
                Contact Us
            </h1>
            <p className="text-center text-lg text-gray-600 mb-12 max-w-2xl">
                We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.
            </p>

            {/* Two-column layout */}
            <div className="w-full max-w-6xl flex flex-col md:flex-row gap-10">
                {/* Left column - Contact Info */}
                <div className="md:w-1/2 bg-white shadow-md rounded-lg p-8 space-y-6">
                    <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                    <p className="text-gray-700">We are here to answer any questions you may have.</p>
                    <div className="space-y-4 text-gray-700">
                        <p>
                            <span className="font-semibold">Email:</span> fabricsposhak8@gmail.com
                        </p>
                        <p>
                            <span className="font-semibold">Phone:</span> +92 316 7986273
                        </p>
                        <p>
                            <span className="font-semibold">Address:</span> Qadirabad, Pakistan
                        </p>
                    </div>
                </div>

                {/* Right column - Contact Form */}
                <form className="md:w-1/2 bg-white shadow-md rounded-lg p-8 space-y-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Your Name"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="message">
                            Message
                        </label>
                        <textarea
                            id="message"
                            placeholder="Your message..."
                            className="w-full border border-gray-300 rounded-md px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400 transition w-full"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactUs;
