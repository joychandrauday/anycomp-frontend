import { Facebook, Instagram, Twitter } from '@mui/icons-material';
import { Linkedin } from 'lucide-react';
import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            {/* Upper Footer */}
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Clients */}
                <div>
                    <h3 className="font-bold mb-4">Clients</h3>
                    <p>Clients</p>
                </div>

                {/* Navigation Links */}
                <div>
                    <h3 className="font-bold mb-4">Navigation</h3>
                    <ul className="space-y-2">
                        <li><a href="/register-company" className="hover:underline">Register Company</a></li>
                        <li><a href="/appoint-company-secretary" className="hover:underline">Appoint a Company Secretary</a></li>
                        <li><a href="/how-anycomp-works" className="hover:underline">How Anycomp Works</a></li>
                        <li><a href="/sign-up" className="hover:underline">Sign up</a></li>
                        <li><a href="/company-secretary" className="hover:underline">Company Secretary</a></li>
                        <li><a target="_blank" rel="noopener noreferrer" href="https://www.cosec.anycomp.com" className="hover:underline">Partner with Anycomp</a></li>
                        <li><a href="/payment-terms" className="hover:underline">Payment Terms</a></li>
                    </ul>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-bold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><a href="/pricing" className="hover:underline">Pricing</a></li>
                        <li><a href="/faq" className="hover:underline">FAQ</a></li>
                        <li><a href="/contact" className="hover:underline">Contact Us</a></li>
                        <li><a href="/blog" className="hover:underline">Blog</a></li>
                    </ul>
                </div>

                {/* Follow Us / Social */}
                <div>
                    <h3 className="font-bold mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                            <Facebook />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                            <Instagram />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
                            <Linkedin />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                            <Twitter />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-700 mt-6">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm">
                    <span>ST Comp Holding Sdn Bhd</span>
                    <div className="flex space-x-4 mt-2 md:mt-0">
                        <a href="/terms-of-service" className="hover:underline">Terms of Service</a>
                        <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
                        <a href="/payment-policy" className="hover:underline">Payment Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
