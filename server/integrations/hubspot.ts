
import fetch from 'node-fetch';
export async function exchangeToken(code:string, redirectUri:string, clientId:string, clientSecret:string){
  const r=await fetch('https://api.hubapi.com/oauth/v1/token',{ method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'},
  body:new URLSearchParams({ grant_type:'authorization_code', client_id:clientId, client_secret:clientSecret, redirect_uri:redirectUri, code })});
  return r.json() as any;
}
export async function listContacts(accessToken:string){
  const r=await fetch('https://api.hubapi.com/crm/v3/objects/contacts',{ headers:{ Authorization:`Bearer ${accessToken}` }});
  return r.json();
}
