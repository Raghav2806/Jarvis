import { useEffect } from "react";
import { useNavigate} from "react-router-dom";

function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);

      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1);
      localStorage.setItem("expiration", expiration.toISOString());

      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, []);

  return <h2>Signing you in...</h2>;
}

export default AuthSuccess;
