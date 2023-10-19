import type { NextPage } from "next";
import dynamic from "next/dynamic";

const DynamicTerminal = dynamic(
  () => import("../components/Terminal"),
  { ssr: false }
);

interface HomeProps { }

const Home: NextPage<HomeProps> = ({ }) => (
  <>
    <DynamicTerminal />
  </>
);

export default Home;
