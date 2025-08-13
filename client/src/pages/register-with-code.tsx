
import { useState } from 'react';
import { apiRequest } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

export default function RegisterWithCode() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', orgName:'', password:'', accessCode:'' });
  const [err, setErr] = useState<string|undefined>();
  const nav = useNavigate();

  async function submit(e:any){
    e.preventDefault();
    try{
      const data = await apiRequest<{token:string}>('POST','/api/auth/register-with-code', form);
      localStorage.setItem('vs_token', data.token);
      nav('/customer-dashboard');
    }catch(e:any){ setErr(e.message);}
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">Sign up with access code</h1>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={submit} className="space-y-6">
            {err && <div className="text-red-600 text-sm">{err}</div>}
            {[
              { key: 'name', label: 'Full Name', type: 'text' },
              { key: 'email', label: 'Email', type: 'email' },
              { key: 'phone', label: 'Phone', type: 'tel' },
              { key: 'orgName', label: 'Organization Name', type: 'text' },
              { key: 'password', label: 'Password', type: 'password' },
              { key: 'accessCode', label: 'Access Code', type: 'text' }
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  type={type}
                  value={(form as any)[key]}
                  onChange={e=>setForm({...form,[key]:e.target.value})}
                />
              </div>
            ))}
            <button 
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
