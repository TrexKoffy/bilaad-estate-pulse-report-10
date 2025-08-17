import { Card } from '@/components/ui/card';
import { MapPin, Mail, Phone, Facebook, Linkedin, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/bilaad-realty-nigeria-ltd/mycompany/',
      icon: Linkedin
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/share/kK5KXDXFec6KVmhu/?mibextid=qi2Omg',
      icon: Facebook
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/bilaadrealty?igsh=bTltbDh2Y2VpdmRz',
      icon: Instagram
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/BilaadRealty?t=AtexiTuf2OF_yZq1U6Ctcw&s=08',
      icon: Twitter
    }
  ];

  return (
    <footer className="relative bg-[#1a1a1a] text-white mt-16">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/src/assets/bilaad-header.jpg')`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Bilaad Realty Nigeria Ltd</h3>
            <p className="text-gray-300 leading-relaxed">
              Premier real estate development company delivering exceptional residential and commercial projects across Nigeria.
            </p>
            
            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-300">
                  No 47 ML Wushishi Crescent Utako Abuja,<br />
                  Adjacent CBN Quarters, Nigeria
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Contact Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a 
                  href="mailto:info@bilaadprojects.com"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  info@bilaadprojects.com
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a 
                  href="tel:07002222111"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  0700 222 2111
                </a>
              </div>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Follow Us</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-primary/20 transition-colors group"
                  >
                    <Icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                    <span className="text-gray-300 group-hover:text-white transition-colors text-sm">
                      {social.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2025 Bilaad Realty Nigeria Ltd. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm text-center md:text-right">
              Bilaad Projects Report • Project Management System
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}