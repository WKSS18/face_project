import useSWR from "swr";
function Profile({}) {
  const fetcher = (...args) => fetch(args).then((res) => res.json());
  const { data, error, isLoading } = useSWR("test", () =>
    fetch("http://jsonplaceholder.typicode.com/posts/1").then((res) =>
      res.json(),
    ),
  );
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  // render data
  console.log(data, "==========d============");
  return <div>hello {data?.title || "---"}!</div>;
}

export default Profile;
