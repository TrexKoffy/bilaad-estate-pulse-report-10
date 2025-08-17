import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard as the main page
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Redirecting to Dashboard...</h1>
          <p className="text-xl text-muted-foreground">Please wait...</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
