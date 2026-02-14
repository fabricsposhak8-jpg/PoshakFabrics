export default function Footer() {
    return (
        <footer className="bg-gray-100 mt-16">
            <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-4 gap-6">

                <div>
                    <h3 className="font-semibold mb-3">Poshak Fabrics</h3>
                    <p>Premium ethnic wear for modern women.</p>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Shop</h4>
                    <ul className="space-y-2">
                        <li>Unstitched</li>
                        <li>Stitched</li>
                        <li>New Arrivals</li>
                        <li>Sale</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Support</h4>
                    <ul className="space-y-2">
                        <li>Contact Us</li>
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
