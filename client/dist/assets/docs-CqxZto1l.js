import{r as i,L as r}from"./index-CmkGXX3K.js";function m(){var c,l;const[t,n]=i.useState("getting-started"),s=[{id:"getting-started",title:"Getting Started",icon:"🚀"},{id:"api-reference",title:"API Reference",icon:"📚"},{id:"webhooks",title:"Webhooks",icon:"🔗"},{id:"authentication",title:"Authentication",icon:"🔐"},{id:"integrations",title:"Integrations",icon:"⚡"},{id:"examples",title:"Code Examples",icon:"💻"}],a={"getting-started":{title:"Getting Started",content:React.createElement("div",{className:"space-y-8"},React.createElement("div",null,React.createElement("h3",{className:"text-xl font-semibold text-gray-900 mb-4"},"Quick Start Guide"),React.createElement("p",{className:"text-gray-600 mb-4"},"Welcome to the VictorySync API documentation. This guide will help you integrate our call center services into your application quickly and efficiently."),React.createElement("div",{className:"bg-gray-50 p-4 rounded-lg"},React.createElement("h4",{className:"font-semibold text-gray-900 mb-2"},"Base URL"),React.createElement("code",{className:"text-sm bg-gray-200 px-2 py-1 rounded"},"https://api.victorysync.com/v1"))),React.createElement("div",null,React.createElement("h3",{className:"text-xl font-semibold text-gray-900 mb-4"},"Authentication"),React.createElement("p",{className:"text-gray-600 mb-4"},"All API requests require authentication using your API key. Include it in the Authorization header:"),React.createElement("div",{className:"bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"},React.createElement("pre",null,React.createElement("code",null,`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://api.victorysync.com/v1/calls`)))),React.createElement("div",null,React.createElement("h3",{className:"text-xl font-semibold text-gray-900 mb-4"},"Making Your First Call"),React.createElement("p",{className:"text-gray-600 mb-4"},"Here's how to create a new support ticket via API:"),React.createElement("div",{className:"bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"},React.createElement("pre",null,React.createElement("code",null,`{
  "customer_id": "cust_123",
  "subject": "Account inquiry",
  "priority": "medium",
  "description": "Customer needs help with billing",
  "callback_url": "https://yourapp.com/webhooks/ticket"
}`)))))},"api-reference":{title:"API Reference",content:React.createElement("div",{className:"space-y-8"},React.createElement("div",null,React.createElement("h3",{className:"text-xl font-semibold text-gray-900 mb-4"},"Tickets"),React.createElement("div",{className:"space-y-6"},React.createElement("div",{className:"border border-gray-200 rounded-lg p-4"},React.createElement("div",{className:"flex items-center space-x-2 mb-2"},React.createElement("span",{className:"bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium"},"POST"),React.createElement("code",{className:"text-sm"},"/tickets")),React.createElement("p",{className:"text-gray-600 mb-3"},"Create a new support ticket"),React.createElement("h5",{className:"font-medium text-gray-900 mb-2"},"Parameters:"),React.createElement("ul",{className:"space-y-1 text-sm text-gray-600"},React.createElement("li",null,React.createElement("code",null,"customer_id")," (string, required) - Customer identifier"),React.createElement("li",null,React.createElement("code",null,"subject")," (string, required) - Ticket subject"),React.createElement("li",null,React.createElement("code",null,"priority")," (string) - Priority level (low, medium, high)"),React.createElement("li",null,React.createElement("code",null,"description")," (string) - Detailed description"))),React.createElement("div",{className:"border border-gray-200 rounded-lg p-4"},React.createElement("div",{className:"flex items-center space-x-2 mb-2"},React.createElement("span",{className:"bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium"},"GET"),React.createElement("code",{className:"text-sm"},"/tickets/:id")),React.createElement("p",{className:"text-gray-600 mb-3"},"Retrieve a specific ticket"),React.createElement("h5",{className:"font-medium text-gray-900 mb-2"},"Response:"),React.createElement("div",{className:"bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto"},React.createElement("pre",null,React.createElement("code",null,`{
  "id": "ticket_123",
  "status": "open",
  "priority": "medium",
  "created_at": "2024-01-15T10:30:00Z",
  "assigned_agent": "agent_456"
}`)))))),React.createElement("div",null,React.createElement("h3",{className:"text-xl font-semibold text-gray-900 mb-4"},"Agents"),React.createElement("div",{className:"border border-gray-200 rounded-lg p-4"},React.createElement("div",{className:"flex items-center space-x-2 mb-2"},React.createElement("span",{className:"bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium"},"GET"),React.createElement("code",{className:"text-sm"},"/agents")),React.createElement("p",{className:"text-gray-600"},"List all available agents and their current status"))))},webhooks:{title:"Webhooks",content:React.createElement("div",{className:"space-y-8"},React.createElement("div",null,React.createElement("h3",{className:"text-xl font-semibold text-gray-900 mb-4"},"Setting Up Webhooks"),React.createElement("p",{className:"text-gray-600 mb-4"},"Webhooks allow VictorySync to notify your application when important events occur, such as ticket updates or call completions."),React.createElement("div",{className:"bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4"},React.createElement("p",{className:"text-yellow-800"},React.createElement("strong",null,"Important:")," Webhook endpoints must respond with a 200 status code within 10 seconds."))),React.createElement("div",null,React.createElement("h3",{className:"text-xl font-semibold text-gray-900 mb-4"},"Event Types"),React.createElement("div",{className:"space-y-4"},React.createElement("div",{className:"border border-gray-200 rounded-lg p-4"},React.createElement("h4",{className:"font-semibold text-gray-900 mb-2"},"ticket.created"),React.createElement("p",{className:"text-gray-600 mb-2"},"Fired when a new support ticket is created"),React.createElement("div",{className:"bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto"},React.createElement("pre",null,React.createElement("code",null,`{
  "event": "ticket.created",
  "data": {
    "id": "ticket_123",
    "customer_id": "cust_456",
    "subject": "Account issue",
    "created_at": "2024-01-15T10:30:00Z"
  }
}`)))),React.createElement("div",{className:"border border-gray-200 rounded-lg p-4"},React.createElement("h4",{className:"font-semibold text-gray-900 mb-2"},"call.completed"),React.createElement("p",{className:"text-gray-600 mb-2"},"Fired when a customer call is completed"),React.createElement("div",{className:"bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto"},React.createElement("pre",null,React.createElement("code",null,`{
  "event": "call.completed",
  "data": {
    "call_id": "call_789",
    "duration": 180,
    "resolution": "resolved",
    "agent_id": "agent_123"
  }
}`)))))))},authentication:{title:"Authentication",content:React.createElement("div",{className:"space-y-8"},React.createElement("div",null,React.createElement("h3",{className:"text-xl font-semibold text-gray-900 mb-4"},"API Keys"),React.createElement("p",{className:"text-gray-600 mb-4"},"VictorySync uses API keys to authenticate requests. You can obtain your API key from your dashboard."),React.createElement("div",{className:"bg-red-50 border border-red-200 rounded-lg p-4 mb-4"},React.createElement("p",{className:"text-red-800"},React.createElement("strong",null,"Security:")," Keep your API keys secure. Never expose them in client-side code."))),React.createElement("div",null,React.createElement("h3",{className:"text-xl font-semibold text-gray-900 mb-4"},"Request Headers"),React.createElement("p",{className:"text-gray-600 mb-4"},"Include these headers with every API request:"),React.createElement("div",{className:"bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"},React.createElement("pre",null,React.createElement("code",null,`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
User-Agent: YourApp/1.0`)))),React.createElement("div",null,React.createElement("h3",{className:"text-xl font-semibold text-gray-900 mb-4"},"Rate Limiting"),React.createElement("p",{className:"text-gray-600 mb-4"},"API requests are limited to 1000 requests per hour per API key. Rate limit information is included in response headers:"),React.createElement("div",{className:"bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"},React.createElement("pre",null,React.createElement("code",null,`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200`)))))},integrations:{title:"Integrations",content:React.createElement("div",{className:"space-y-8"},React.createElement("div",null,React.createElement("h3",{className:"text-xl font-semibold text-gray-900 mb-4"},"Supported Platforms"),React.createElement("p",{className:"text-gray-600 mb-6"},"VictorySync integrates with 200+ platforms. Here are some popular integrations:"),React.createElement("div",{className:"grid md:grid-cols-2 gap-6"},React.createElement("div",{className:"border border-gray-200 rounded-lg p-4"},React.createElement("h4",{className:"font-semibold text-gray-900 mb-2"},"CRM Systems"),React.createElement("ul",{className:"space-y-1 text-gray-600"},React.createElement("li",null,"• Salesforce"),React.createElement("li",null,"• HubSpot"),React.createElement("li",null,"• Pipedrive"),React.createElement("li",null,"• Zoho CRM"))),React.createElement("div",{className:"border border-gray-200 rounded-lg p-4"},React.createElement("h4",{className:"font-semibold text-gray-900 mb-2"},"Help Desk"),React.createElement("ul",{className:"space-y-1 text-gray-600"},React.createElement("li",null,"• Zendesk"),React.createElement("li",null,"• Freshdesk"),React.createElement("li",null,"• Intercom"),React.createElement("li",null,"• Help Scout"))))),React.createElement("div",null,React.createElement("h3",{className:"text-xl font-semibold text-gray-900 mb-4"},"Custom Integrations"),React.createElement("p",{className:"text-gray-600 mb-4"},"For custom integrations, use our REST API or contact our technical team for assistance with complex setups."),React.createElement(r,{href:"/contact"},React.createElement("button",{className:"bg-victory-purple hover:bg-victory-purple/90 text-white px-6 py-2 rounded-lg font-semibold transition-colors"},"Contact Technical Team"))))},examples:{title:"Code Examples",content:React.createElement("div",{className:"space-y-8"},React.createElement("div",null,React.createElement("h3",{className:"text-xl font-semibold text-gray-900 mb-4"},"JavaScript/Node.js"),React.createElement("div",{className:"bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"},React.createElement("pre",null,React.createElement("code",null,`const fetch = require('node-fetch');

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
}).then(console.log);`)))),React.createElement("div",null,React.createElement("h3",{className:"text-xl font-semibold text-gray-900 mb-4"},"Python"),React.createElement("div",{className:"bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"},React.createElement("pre",null,React.createElement("code",null,`import requests

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
print(ticket)`)))),React.createElement("div",null,React.createElement("h3",{className:"text-xl font-semibold text-gray-900 mb-4"},"PHP"),React.createElement("div",{className:"bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"},React.createElement("pre",null,React.createElement("code",null,`<?php

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
?>`)))))}};return React.createElement("div",{className:"min-h-screen bg-gray-50"},React.createElement("div",{className:"bg-victory-dark text-white py-20"},React.createElement("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"},React.createElement("div",{className:"text-center"},React.createElement("h1",{className:"text-4xl md:text-5xl font-bold mb-6"},"API Documentation"),React.createElement("p",{className:"text-xl text-gray-300 max-w-3xl mx-auto"},"Complete developer documentation for integrating VictorySync services into your applications.")))),React.createElement("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"},React.createElement("div",{className:"grid lg:grid-cols-4 gap-8"},React.createElement("div",{className:"lg:col-span-1"},React.createElement("div",{className:"sticky top-8"},React.createElement("h3",{className:"text-lg font-semibold text-gray-900 mb-4"},"Documentation"),React.createElement("nav",{className:"space-y-2"},s.map(e=>React.createElement("button",{key:e.id,onClick:()=>n(e.id),className:`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${t===e.id?"bg-victory-purple text-white":"bg-white text-gray-700 hover:bg-gray-50"}`},React.createElement("span",{className:"text-lg"},e.icon),React.createElement("span",null,e.title)))),React.createElement("div",{className:"mt-8 bg-white rounded-lg shadow-lg p-6"},React.createElement("h4",{className:"font-semibold text-gray-900 mb-3"},"Need Help?"),React.createElement("p",{className:"text-gray-600 text-sm mb-4"},"Our technical team is available to help with integration questions."),React.createElement(r,{href:"/contact"},React.createElement("button",{className:"w-full bg-victory-purple hover:bg-victory-purple/90 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"},"Contact Support"))))),React.createElement("div",{className:"lg:col-span-3"},React.createElement("div",{className:"bg-white rounded-lg shadow-lg p-8"},React.createElement("h2",{className:"text-3xl font-bold text-gray-900 mb-8"},(c=a[t])==null?void 0:c.title),(l=a[t])==null?void 0:l.content)))))}export{m as default};
