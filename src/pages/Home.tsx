
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Shield, Users, LineChart, FileText } from 'lucide-react';
import { useCreateAdmin } from '@/hooks/useCreateAdmin';

const Home = () => {
  const { createAdmin, isLoading, adminCreated } = useCreateAdmin();

  const handleCreateAdmin = async () => {
    try {
      await createAdmin();
    } catch (error) {
      console.error("Failed to create admin:", error);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          Business Advisory Platform
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Manage your business operations efficiently with our comprehensive advisory platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/login">
            <Button size="lg" className="w-full sm:w-auto">
              Log In <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Register Now
            </Button>
          </Link>
          <Button 
            onClick={handleCreateAdmin} 
            disabled={isLoading || adminCreated} 
            size="lg" 
            variant="secondary" 
            className="w-full sm:w-auto"
          >
            <Shield className="mr-2 h-4 w-4" />
            {isLoading ? "Creating Admin..." : adminCreated ? "Admin Created" : "Create Admin"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <Users className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Client Management</h3>
          <p className="text-muted-foreground">
            Efficiently manage your clients, their information, and services in one place.
          </p>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <FileText className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Invoice Processing</h3>
          <p className="text-muted-foreground">
            Streamline your invoice processing, both incoming and outgoing.
          </p>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <LineChart className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Financial Reports</h3>
          <p className="text-muted-foreground">
            Generate comprehensive financial reports and gain insights into your business.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
