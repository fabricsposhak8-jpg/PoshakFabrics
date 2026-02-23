"use client";
import { useState } from "react";

const ContactUs = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                }),
            });

            if (response.ok) {
                setTimeout(() => {
                    setSuccessMessage("Message sent successfully!");
                }, 2000);
                setName("");
                setEmail("");
                setMessage("");
            } else {
                setTimeout(() => {
                    setErrorMessage("Failed to send message. Please try again.");
                }, 2000);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setTimeout(() => {
                setErrorMessage("An error occurred while sending the message.");
            }, 2000);
        }
    };

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
                        <p><span className="font-semibold">Email:</span> fabricsposhak8@gmail.com</p>
                        <p><span className="font-semibold">Phone:</span> +92 316 7986273</p>
                        <p><span className="font-semibold">Address:</span> Qadirabad, Pakistan</p>
                    </div>
                </div>

                {/* Right column - Contact Form */}
                <form onSubmit={handleSubmit} className="md:w-1/2 bg-white shadow-md rounded-lg p-8 space-y-6">
                    {/* Success & Error Messages */}
                    {successMessage && (
                        <p className="text-green-600 font-semibold">{successMessage}</p>
                    )}
                    {errorMessage && (
                        <p className="text-red-600 font-semibold">{errorMessage}</p>
                    )}

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="message">
                            Message
                        </label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Your message..."
                            className="w-full border border-gray-300 rounded-md px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
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