import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-100 mt-16">
            <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-4 gap-6">

                <div>
                    <h3 className="font-semibold mb-3">Poshak Fabrics</h3>
                    <p>Premium ethnic wear for modern people.</p>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Shop</h4>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/user/collections/unstitched" className="hover:text-black transition duration-200 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
                                Unstitched
                            </Link>
                        </li>
                        <li>
                            <Link href="/user/collections/stitched" className="hover:text-black transition duration-200 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
                                Stitched
                            </Link>
                        </li>
                        <li>
                            New Arrivals
                        </li>
                        <li>
                            Sale
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Support</h4>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/#contact" className="hover:text-black transition duration-200 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
                                Contact Us
                            </Link>
                        </li>
                        <li>Shipping Policy</li>
                        <li>Return Policy</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Follow Us</h4>
                    <p>Instagram | Facebook</p>
                </div>

            </div>

            <div className="text-center py-4 border-t">
                © 2026 Poshak Fabrics. All rights reserved.
            </div>
        </footer>
    );
}
