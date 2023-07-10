import type { GetStaticProps, NextPage } from "next";

import Terminal from "../components/Terminal";

interface HomeProps { }

const Home: NextPage<HomeProps> = ({ }) => (
  <Terminal />
);

export default Home;
