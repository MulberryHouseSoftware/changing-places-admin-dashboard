import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Changing Places Admin Dashboard | Home</title>
        <meta name="description" content="Changing Places Admin Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="bg-white">
          <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">
                Add, view, update and remove Changing Places
              </span>
              <span className="block">What would you like to do?</span>
            </h2>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link legacyBehavior href="/places/add">
                  <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Add Changing Place
                  </a>
                </Link>
              </div>
              <div className="ml-3 inline-flex">
                <Link legacyBehavior href="/places">
                  <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                    Manage Changing Places
                  </a>
                </Link>
              </div>
{/*               <div className="ml-3 inline-flex">
                <Link legacyBehavior href="/bulk-upload">
                  <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                    Bulk upload
                  </a>
                </Link>
              </div> */}
              <div className="ml-3 inline-flex">
                <a
                  href="/api/download-changing-places"
                  download="backup.csv"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Download all Changing Places
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
