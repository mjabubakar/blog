import { GetServerSideProps } from "next";
import { GET_POST } from "../../../actions/Post";
import ConvertToHTML, { returnDate } from "../../../components/convertToHtml";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useRouter } from "next/router";
import Head from "next/head";

export type Post = {
  title: string;
  body: string;
  created_at: string;
  url: string;
  fullname: string;
  profilepic: string;
  bio: string;
  prevPost: data;
  nextPost: data;
  featuredimage: string;
};
type data = {
  title: string;
  url: string;
};
export interface Props {
  post: Post;
}
export default function MyPost(props: Props) {
  const {
    body,
    title,
    fullname,
    profilepic,
    created_at,
    bio,
    nextPost,
    prevPost,
    featuredimage,
  } = props.post;
  const router = useRouter();
  return (
    <div className="pagecontainer">
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <div className="container">
        <style jsx global>{`
          .pagecontainer {
            width: 90%;
          }
          .container {
            display: flex;
            flex-direction: row;
            margin-left: 50px;
            margin-right: 50px;
          }

          .header {
            margin-left: 50px;
          }

          .body {
            width: 70%;
            padding-right: 50px;
          }

          .author .container {
            display: block;
            margin-top: 50px;
            margin-left: 10px;
          }

          .author {
            width: 20%;
          }

          .author img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }

          .author.mobile {
            display: none;
          }

          .body-container {
            min-height: 300px;
          }

          .body-container .title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 1rem;
          }

          .body .pagination {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          }

          .body .pagination .next,
          .body .pagination .prev {
            max-width: 45%;
            word-wrap: break-word;
          }

          .pagination .next {
            text-align: right;
            color: #663399;
            font-weight: bold;
            cursor: pointer;
          }

          .pagination .prev {
            text-align: left;
            color: #663399;
            font-weight: bold;
            cursor: pointer;
          }

          .featuredimage {
            height: 400px;
            width: 100%;
          }

          .link {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .link a {
            font-size: 1.2em;
            color: #663399;
            text-decoration: underline;
            font-weight: bold;
          }

          .socials {
            margin-top: 2.5rem;
          }

          @media (max-width: 1000px) {
            .container {
              flex-direction: column;
              width: 100%;
              overflow-x: hidden;
              margin-left: 0.8rem;
              margin-right: 0.5rem;
            }

            .body {
              width: 80%;
            }

            .author {
              width: 100%;
            }

            .author .container {
              margin-left: 0px;
            }

            .author.mobile {
              display: flex;
              flex-direction: row;
            }

            .author.mobile .text {
              margin-left: 15px;
              padding-top: 5px;
            }

            .author {
              display: none;
            }

            .featuredimage {
              height: 5%;
              width: 100%;
            }
          }
        `}</style>
        <div className="body">
          <div className="body-container">
            <div className="title">{title}</div>
            <img className="featuredimage" src={featuredimage} alt={title} />
            <div className="author mobile">
              <div className="profilepic">
                <img src={profilepic} alt={profilepic} />
              </div>
              <div className="text">
                <div>{fullname}</div>
                <div>{returnDate(created_at)}</div>
              </div>
            </div>
            <ConvertToHTML body={body} />
            <div className="author mobile">
              <div className="profilepic">
                <img src={profilepic} />
              </div>
              <div className="text">
                <div>Written by</div>
                <div>{fullname}</div>
                <div>{bio}</div>
              </div>
            </div>
          </div>

          <div className="pagination">
            <div className="prev">
              {prevPost && (
                <>
                  <div className="text">Previous</div>
                  <div
                    className="link"
                    onClick={() => {
                      router.push(`/post/${prevPost.url}`);
                    }}
                  >
                    {prevPost.title}
                  </div>
                </>
              )}
            </div>
            <div className="next">
              {nextPost && (
                <>
                  <div className="text">Next</div>
                  <div
                    className="link"
                    onClick={() => {
                      router.push(`/post/${nextPost.url}`);
                    }}
                  >
                    {nextPost.title}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="author">
          <div className="container">
            <img src={profilepic} />
            <div>{fullname}</div>
            <div>{returnDate(created_at)}</div>
            <br />
            <div>{bio}</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const url = ctx.params.url.toString();
    const post = await GET_POST(url);

    return {
      props: {
        post: post.data,
      },
    };
  } catch (e) {
    return {
      redirect: {
        destination: "/notfound",
        permanent: false,
      },
    };
  }
};
