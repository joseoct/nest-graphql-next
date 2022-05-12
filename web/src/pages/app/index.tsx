import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useMeQuery } from "../../graphql/generated/graphql";
import { getServerPageGetProducts, ssrGetProducts } from "../../graphql/generated/page";
import { withApollo } from "../../lib/withApollo";

function Home() {

  const { data: me } = useMeQuery();

  return (
    <div className="bg-gray-600">
      <pre>
        {JSON.stringify(me, null, 2)}
      </pre>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx) => {
    return await getServerPageGetProducts({}, ctx);
  }
});

export default withApollo(
  ssrGetProducts.withPage()(Home)
);