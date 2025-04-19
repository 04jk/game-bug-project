
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const InfoLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { path: '/info/getting-started', label: 'Getting Started' },
    { path: '/info/faq', label: 'FAQ' },
    { path: '/info/contact', label: 'Contact Support' },
    { path: '/info/privacy', label: 'Privacy Policy' },
    { path: '/info/terms', label: 'Terms of Service' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-[250px_1fr] gap-6">
          <aside className="space-y-4">
            <div className="font-semibold text-lg">Help Center</div>
            <Separator />
            <nav className="space-y-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm",
                    location.pathname === link.path 
                      ? "bg-primary text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>

          <main className="bg-white rounded-lg shadow p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default InfoLayout;
