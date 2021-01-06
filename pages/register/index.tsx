import { GetServerSideProps } from "next";
import cookies from "next-cookies";
import { useState } from "react";
import { REGISTER } from "../../actions/Authentication";
import { notAuth } from "../../components/checkAuth";
import { useRouter } from "next/router";
import Head from "next/head";

const Register = () => {
  const router = useRouter();
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [profilepic, setProfilepic] = useState<File>();
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const onRegister = async (e) => {
    e.preventDefault();
    setError("false");
    setLoading(true);
    const formData = new FormData();
    formData.append("profilepic", profilepic);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("fullname", fullname);
    formData.append("username", username);
    formData.append("bio", bio);
    const register = await REGISTER(formData);
    if (register) return setError(register.response.data.message);
    setLoading(false);
    return router.push("/login");
  };

  const onChange = ({ target: { files } }) => {
    const file = files[0];
    setProfilepic(file);
  };

  return (
    <div className="container">
      <Head>
        <title>Register</title>
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

          input,
          label {
            width: 300px;
            height: 32px;
            border: 1px solid grey;
            outline: none;
            margin-bottom: 1rem;
            padding-left: 0.3rem;
          }

          label {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1rem;
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

          .login,
          label {
            color: #6216af;
            cursor: pointer;
          }

          #input {
            display: none;
          }

          @media (max-width: 500px) {
            input,
            label {
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
        placeholder="Fullname"
        name="fullname"
        value={fullname}
        onChange={(e) => setFullname(e.target.value)}
      />
      <input
        placeholder="Email"
        name="user[name]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <label htmlFor="input">
        {profilepic ? profilepic.name : "Select Profile Pic"}
      </label>
      <input type="file" id="input" accept="image/*" onChange={onChange} />
      <button type="submit" onClick={onRegister}>
        Register
      </button>
      <div className="login" onClick={() => router.push("/login")}>
        Already have account? Login
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = cookies(ctx).userToken;
  return notAuth(token);
};

export default Register;
