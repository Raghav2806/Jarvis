import { redirect, useNavigation } from 'react-router-dom';
import AuthForm from "../../components/authComponents/AuthForm";

function AuthenticationPage() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return <AuthForm isSubmitting={isSubmitting}/>;
}

export default AuthenticationPage;

export async function action({request}) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode')
  
  if(mode !== 'login' && mode !== 'register') {
    throw new Response(JSON.stringify({ message: 'Unsupported mode' }), {
    status: 422
    });
  }

  const data = await request.formData();
  const authData = {
    email: data.get('email'),
    password: data.get('password'),
    name: data.get('name'),
  };
  
  const response = await fetch('https://jarvis-qynk.onrender.com/' + mode, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(authData)
  })
  
  if(response.status === 422 || response.status === 401) {
    return response;
  }

  if(!response.ok) {
      const data = await response.json();
      throw new Response(JSON.stringify({ message: data.message }), {
          status: response.status
      });
  }

  //manage token
  const resData = await response.json();
  const token = resData.token;
  localStorage.setItem('token', token);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem('expiration', expiration.toISOString())
  return redirect('/manage') 
}