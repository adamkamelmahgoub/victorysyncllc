import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

// Create a minimal query client for testing
const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function PricingTest() {
  const { data: packages, isLoading, error } = useQuery({
    queryKey: ['/api/packages'],
    queryFn: async () => {
      const response = await fetch('/api/packages');
      if (!response.ok) {
        throw new Error('Failed to fetch packages');
      }
      return response.json();
    },
  });

  if (isLoading) return <div>Loading pricing...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!packages) return <div>No packages found</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>VictorySync Pricing Plans</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {packages.map((pkg: any) => (
          <div key={pkg.id} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '20px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3>{pkg.name}</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#5d5df2' }}>
              ${parseFloat(pkg.price).toLocaleString()}/month
            </div>
            <p>{pkg.description}</p>
            <ul>
              {pkg.features.map((feature: string, idx: number) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
            <button style={{
              backgroundColor: '#5d5df2',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '100%'
            }}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TestApp() {
  return (
    <QueryClientProvider client={testQueryClient}>
      <PricingTest />
    </QueryClientProvider>
  );
}