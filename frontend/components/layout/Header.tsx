import Link from "next/link";
import Image from "next/image";

const Header = () => {
    return (
        <header className="w-full border-b bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/Logo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                    />
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex">
                    <ul className="flex items-center space-x-8 text-gray-700 font-medium">
                        <li><Link href="/" className="hover:text-black">Home</Link></li>
                        <li><Link href="/shop" className="hover:text-black">Shop</Link></li>
                        <li><Link href="/collections" className="hover:text-black">Collections</Link></li>
                        <li><Link href="#about" className="hover:text-black">About</Link></li>
                        <li><Link href="#contact" className="hover:text-black">Contact</Link></li>
                    </ul>
                </nav>

                {/* Right Side Buttons */}
                <div className="flex items-center space-x-4">
                    <button className="text-gray-700 hover:text-black">
                        Search
                    </button>

                    <button className="text-gray-700 hover:text-black">
                        Cart
                    </button>

                    <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                        Login
                    </button>
                </div>

            </div>
        </header>
    );
};

export default Header;
