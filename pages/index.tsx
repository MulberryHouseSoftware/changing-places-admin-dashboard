import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const people = [
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    role: "Admin",
    email: "jane.cooper@example.com",
  },
  {
    name: "Cody Fisher",
    title: "Product Directives Officer",
    role: "Owner",
    email: "cody.fisher@example.com",
  },
];

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Changing Places Admin Dashboard | Home</title>
        <meta name="description" content="Changing Places Admin Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>Down for maintenance</main>
    </div>
  );
};

export default Home;
