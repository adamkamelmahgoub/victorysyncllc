
import fetch from 'node-fetch';
export async function accountInfo(apiKey:string, accountSid:string){
  const r=await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`,{
    headers:{ Authorization:'Basic '+Buffer.from(`${accountSid}:${apiKey}`).toString('base64') }
  });
  return r.json();
}
