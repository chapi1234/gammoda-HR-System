import { Link } from "react-router-dom";
import { Linkedin, Twitter, Facebook, Mail, Phone, MapPin } from "lucide-react";
import Logo from "./Logo";
import { siteConfig } from "../config/siteConfig";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Logo className="mb-4" />
            <p className="mb-4 text-gray-600">{siteConfig.description}</p>
            <div className="flex gap-4">
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to={siteConfig.links.about} className="text-gray-600 hover:text-blue-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link to={siteConfig.links.portfolio} className="text-gray-600 hover:text-blue-600">
                  Our Projects
                </Link>
              </li>
              <li>
                <Link to={siteConfig.links.careers} className="text-gray-600 hover:text-blue-600">
                  Careers
                </Link>
              </li>
              <li>
                <Link to={siteConfig.links.contact} className="text-gray-600 hover:text-blue-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-gray-900">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-600">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-blue-600 text-sm">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-blue-600 text-sm">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-gray-600 text-sm">
              © {currentYear} {siteConfig.companyName}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-gray-600 hover:text-blue-600">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-600 hover:text-blue-600">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
