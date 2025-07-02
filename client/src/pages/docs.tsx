import { Link } from 'wouter';
import { useState } from 'react';

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
    { id: 'api-reference', title: 'API Reference', icon: '📚' },
    { id: 'webhooks', title: 'Webhooks', icon: '🔗' },
    { id: 'authentication', title: 'Authentication', icon: '🔐' },
    { id: 'integrations', title: 'Integrations', icon: '⚡' },
    { id: 'examples', title: 'Code Examples', icon: '💻' }
  ];

  const content = {
    'getting-started': {
      title: 'Getting Started',
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Start Guide</h3>
            <p className="text-gray-600 mb-4">
              Welcome to the VictorySync API documentation. This guide will help you integrate our call center services 
              into your application quickly and efficiently.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Base URL</h4>
              <code className="text-sm bg-gray-200 px-2 py-1 rounded">https://api.victorysync.com/v1</code>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Authentication</h3>
            <p className="text-gray-600 mb-4">
              All API requests require authentication using your API key. Include it in the Authorization header:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre><code>{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://api.victorysync.com/v1/calls`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Making Your First Call</h3>
            <p className="text-gray-600 mb-4">
              Here's how to create a new support ticket via API:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre><code>{`{
  "customer_id": "cust_123",
  "subject": "Account inquiry",
  "priority": "medium",
  "description": "Customer needs help with billing",
  "callback_url": "https://yourapp.com/webhooks/ticket"
}`}</code></pre>
            </div>
          </div>
        </div>
      )
    },
    'api-reference': {
      title: 'API Reference',
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Tickets</h3>
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">POST</span>
                  <code className="text-sm">/tickets</code>
                </div>
                <p className="text-gray-600 mb-3">Create a new support ticket</p>
                <h5 className="font-medium text-gray-900 mb-2">Parameters:</h5>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li><code>customer_id</code> (string, required) - Customer identifier</li>
                  <li><code>subject</code> (string, required) - Ticket subject</li>
                  <li><code>priority</code> (string) - Priority level (low, medium, high)</li>
                  <li><code>description</code> (string) - Detailed description</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">GET</span>
                  <code className="text-sm">/tickets/:id</code>
                </div>
                <p className="text-gray-600 mb-3">Retrieve a specific ticket</p>
                <h5 className="font-medium text-gray-900 mb-2">Response:</h5>
                <div className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                  <pre><code>{`{
  "id": "ticket_123",
  "status": "open",
  "priority": "medium",
  "created_at": "2024-01-15T10:30:00Z",
  "assigned_agent": "agent_456"
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Agents</h3>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">GET</span>
                <code className="text-sm">/agents</code>
              </div>
              <p className="text-gray-600">List all available agents and their current status</p>
            </div>
          </div>
        </div>
      )
    },
    'webhooks': {
      title: 'Webhooks',
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Setting Up Webhooks</h3>
            <p className="text-gray-600 mb-4">
              Webhooks allow VictorySync to notify your application when important events occur, 
              such as ticket updates or call completions.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800">
                <strong>Important:</strong> Webhook endpoints must respond with a 200 status code within 10 seconds.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Types</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">ticket.created</h4>
                <p className="text-gray-600 mb-2">Fired when a new support ticket is created</p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                  <pre><code>{`{
  "event": "ticket.created",
  "data": {
    "id": "ticket_123",
    "customer_id": "cust_456",
    "subject": "Account issue",
    "created_at": "2024-01-15T10:30:00Z"
  }
}`}</code></pre>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">call.completed</h4>
                <p className="text-gray-600 mb-2">Fired when a customer call is completed</p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                  <pre><code>{`{
  "event": "call.completed",
  "data": {
    "call_id": "call_789",
    "duration": 180,
    "resolution": "resolved",
    "agent_id": "agent_123"
  }
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    'authentication': {
      title: 'Authentication',
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">API Keys</h3>
            <p className="text-gray-600 mb-4">
              VictorySync uses API keys to authenticate requests. You can obtain your API key from your dashboard.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800">
                <strong>Security:</strong> Keep your API keys secure. Never expose them in client-side code.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Request Headers</h3>
            <p className="text-gray-600 mb-4">Include these headers with every API request:</p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre><code>{`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
User-Agent: YourApp/1.0`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Rate Limiting</h3>
            <p className="text-gray-600 mb-4">
              API requests are limited to 1000 requests per hour per API key. Rate limit information is included in response headers:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre><code>{`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200`}</code></pre>
            </div>
          </div>
        </div>
      )
    },
    'integrations': {
      title: 'Integrations',
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Supported Platforms</h3>
            <p className="text-gray-600 mb-6">
              VictorySync integrates with 200+ platforms. Here are some popular integrations:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">CRM Systems</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Salesforce</li>
                  <li>• HubSpot</li>
                  <li>• Pipedrive</li>
                  <li>• Zoho CRM</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Help Desk</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Zendesk</li>
                  <li>• Freshdesk</li>
                  <li>• Intercom</li>
                  <li>• Help Scout</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Custom Integrations</h3>
            <p className="text-gray-600 mb-4">
              For custom integrations, use our REST API or contact our technical team for assistance with complex setups.
            </p>
            <Link href="/contact">
              <button className="bg-victory-purple hover:bg-victory-purple/90 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                Contact Technical Team
              </button>
            </Link>
          </div>
        </div>
      )
    },
    'examples': {
      title: 'Code Examples',
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">JavaScript/Node.js</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre><code>{`const fetch = require('node-fetch');

const apiKey = 'your_api_key_here';
const baseUrl = 'https://api.victorysync.com/v1';

async function createTicket(ticketData) {
  const response = await fetch(\`\${baseUrl}/tickets\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${apiKey}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ticketData)
  });
  
  return response.json();
}

// Usage
createTicket({
  customer_id: 'cust_123',
  subject: 'Account inquiry',
  priority: 'medium'
}).then(console.log);`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Python</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre><code>{`import requests

class VictorySyncAPI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://api.victorysync.com/v1'
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def create_ticket(self, ticket_data):
        response = requests.post(
            f'{self.base_url}/tickets',
            headers=self.headers,
            json=ticket_data
        )
        return response.json()

# Usage
api = VictorySyncAPI('your_api_key_here')
ticket = api.create_ticket({
    'customer_id': 'cust_123',
    'subject': 'Account inquiry',
    'priority': 'medium'
})
print(ticket)`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">PHP</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre><code>{`<?php

class VictorySyncAPI {
    private $apiKey;
    private $baseUrl = 'https://api.victorysync.com/v1';
    
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }
    
    public function createTicket($ticketData) {
        $ch = curl_init();
        
        curl_setopt($ch, CURLOPT_URL, $this->baseUrl . '/tickets');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($ticketData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->apiKey,
            'Content-Type: application/json'
        ]);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
}

// Usage
$api = new VictorySyncAPI('your_api_key_here');
$ticket = $api->createTicket([
    'customer_id' => 'cust_123',
    'subject' => 'Account inquiry',
    'priority' => 'medium'
]);
?>`}</code></pre>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-victory-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">API Documentation</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Complete developer documentation for integrating VictorySync services into your applications.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentation</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-victory-purple text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span>{section.title}</span>
                  </button>
                ))}
              </nav>
              
              <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Need Help?</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Our technical team is available to help with integration questions.
                </p>
                <Link href="/contact">
                  <button className="w-full bg-victory-purple hover:bg-victory-purple/90 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                    Contact Support
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {(content as any)[activeSection]?.title}
              </h2>
              {(content as any)[activeSection]?.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}