import Head from "next/head";
import { GetServerSideProps } from "next";
import cookies from "next-cookies";
import Cookie from "universal-cookie";
import { DELETE_POST, MY_POSTS } from "../../actions/Post";
import { Props } from "..";
import { useState } from "react";
import { Post } from "../post/[url]";
import { redirectToLogin } from "../../components/checkAuth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";
import Link from "next/link";
import Pagination from "../../components/pagination";

export const cookie = new Cookie();

export default function Dashboard(props: Props) {
  const [posts, setPosts] = useState<Post[]>(props.posts);
  const router = useRouter();
  const token = cookie.get("userToken");

  const onDelete = async (url: string, idx: number) => {
    try {
      await DELETE_POST(token, url);
      const arr = [...posts];
      if (idx !== -1) {
        arr.splice(idx, 1);
        setPosts(arr);
      }
    } catch (e) {}
  };

  let renderPosts = posts.map((post, id) => {
    return (
      <div className="post" key={id}>
        <div className="title" onClick={() => router.push(`/post/${post.url}`)}>
          {post.title}
        </div>
        <div className="btn edit">
          <button
            onClick={() => {
              router.push(`/post/${post.url}/edit`);
            }}
          >
            Edit Post
          </button>
        </div>
        <div className="btn delete">
          <button onClick={() => onDelete(post.url, id)}>Delete Post</button>
        </div>
        <br />
      </div>
    );
  });

  const onChange = async (num) => {
    const { data } = await MY_POSTS(token, num);
    setPosts(data.posts);
  };

  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <style jsx global>{`
        .container {
          background: #cdbcde;
          color: white;
          font-weight: bold;
          overflow: auto;
          max-height: 450px;
          border: 1px solid #6216af;
          padding: 10px;
          margin-top: 20px;
        }

        .title {
          cursor: pointer;
        }

        button {
          cursor: normal;
          background: white;
          outline: none;
          border: none;
          cursor: pointer;
          padding: 0.5em;
        }

        button:active {
          outline: none;
          border: none;
        }

        .post {
          display: flex;
          flex-direction: row;
          padding: 10px 0;
          border-bottom: 1px solid white;
        }

        .post .title {
          flex: 3;
        }

        .post .btn.delete {
          flex: 1;
        }

        .post .btn.edit {
          flex: 1;
        }

        .link {
          background: #cdbcde;
          display: inline;
          padding: 10px;
          border: 1px solid grey;
        }

        .link a {
          color: white;
        }

        .pagination {
          display: flex;
          justify-content: flex-end;
          margin-top: 1em;
        }
      `}</style>
      <h2>Dashboard</h2>
      <div className="link">
        <Link href="/post/create">Create new post</Link>
      </div>

      <div className="container">
        <div>
          <div>Title</div>
        </div>
        {renderPosts}
      </div>
      <div className="pagination">
        <Pagination range={5} numOfPages={props.total} onChange={onChange} />
      </div>
      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = cookies(ctx).userToken;
  try {
    const { data } = await MY_POSTS(token);
    return {
      props: { auth: true, posts: data.posts, total: data.total },
    };
  } catch (e) {
    if (e.response.data.message === "Authentication error.") {
      return redirectToLogin();
    }
  }
};
