import { useState } from "react";
import { LOGIN } from "../../actions/Authentication";
import { GetServerSideProps } from "next";
import cookies from "next-cookies";
import { notAuth } from "../../components/checkAuth";
import { useRouter } from "next/router";
import Head from "next/head";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const login = await LOGIN({ email, password });
    setLoading(false);
    if (login) return setError(login.response && login.response.data.message);
    return router.push("/dashboard");
  };

  return (
    <div className="container">
      <Head>
        <title>Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <style jsx global>
        {`
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }

          .error {
            color: red;
            margin-bottom: 1rem;
          }

          input {
            width: 300px;
            height: 32px;
            border: 1px solid grey;
            outline: none;
            margin-bottom: 1rem;
            padding-left: 0.3rem;
          }

          input:active {
            border: 1px solid grey;
            outline: none;
          }

          button {
            width: 200px;
            height: 40px;
            cursor: pointer;
            background: #6216af;
            color: white;
            margin: 1rem 0;
            border: hidden;
          }

          .register {
            color: #6216af;
            cursor: pointer;
          }

          @media (max-width: 500px) {
            input {
              width: 80%;
            }

            button {
              width: 60%;
            }
          }
        `}
      </style>
      {loading && "loading"}
      <div className="error">{error}</div>
      <input
        placeholder="Email"
        value={email}
        type="email"
        required={true}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        required={true}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={onLogin}>Login</button>
      <div className="register" onClick={() => router.push("/register")}>
        Dont have account? Register
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = cookies(ctx).userToken;
  return notAuth(token);
};
export default Login;
