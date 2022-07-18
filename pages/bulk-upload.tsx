import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRef } from "react";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, ExclamationIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { csvParse } from "d3-dsv";

const BulkUpload: NextPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<any | null>(null);
  const cancelButtonRef = useRef(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setSaving(true);

    const reader = new FileReader();

    reader.addEventListener(
      "load",
      async () => {
        const data = csvParse(reader.result as string);

        for (const location of data.slice(10)) {
          let filteredProperties: any = Object.fromEntries(
            Object.entries(location).filter(([key, value]) => value !== "")
          );

          if (filteredProperties.features) {
            let features = filteredProperties.features
              .split("\n")
              .map((feature: string) => {
                if (feature.startsWith("- ")) {
                  return feature.slice(2);
                } else {
                  return feature;
                }
              })
              .map((feature: string) => feature.trim());

            filteredProperties = {
              ...filteredProperties,
              features,
            };
          }

          console.log(filteredProperties);

          const res = await fetch("/.netlify/functions/add-changing-place/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "same-origin",
            cache: "no-cache",
            body: JSON.stringify(filteredProperties),
          });

          const json = await res.json();

          setSaving(false);

          if (res.ok) {
            setNotification({
              intent: "success",
              title: `${filteredProperties.name} successfully saved!`,
              subtitle: "Anyone can now view this location in the app",
            });
          } else {
            setNotification({
              intent: "error",
              title: `Failed to save ${filteredProperties.name}.`,
              subtitle: json.message,
            });
          }
        }
      },
      false
    );

    reader.readAsText(data.file[0]);

    /*  data = { ...data, features: data.features.split("\n") };

    const res = await fetch("/.netlify/functions/add-changing-place/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "same-origin",
      cache: "no-cache",
      body: JSON.stringify(data),
    });

    const json = await res.json();

    setSaving(false);

    if (res.ok) {
      setNotification({
        intent: "success",
        title: `${data.name} successfully saved!`,
        subtitle: "Anyone can now view this location in the app",
      });
    } else {
      setNotification({
        intent: "error",
        title: `Failed to save ${data.name}.`,
        subtitle: json.message,
      });
    } */
  };

  return (
    <div>
      <Head>
        <title>Changing Places Admin Dashboard | Bulk Upload</title>
        <meta name="description" content="Changing Places Admin Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Changing Place Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Please fill in as much information as you can.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)}>
                <p>{JSON.stringify(file?.size)}</p>
                <input {...register("file")} type="file" name="file" />
                <div className="pt-5">
                  <div className="flex justify-end">
                    <Link href="/">
                      <a className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Cancel
                      </a>
                    </Link>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={saving}
                    >
                      {saving && (
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                      {saving ? "Uploading" : "Upload"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Transition.Root show={notification !== null} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={() => {
            setNotification(null);
          }}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  {notification?.intent === "error" ? (
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                      <ExclamationIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                  ) : (
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <CheckIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      {notification?.title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {notification?.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  {notification?.intent === "error" ? (
                    <>
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                        onClick={() => setNotification(null)}
                      >
                        Edit and try again
                      </button>
                      <Link href="/places">
                        <a
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                          onClick={() => setNotification(null)}
                          ref={cancelButtonRef}
                        >
                          Manage Changing Places
                        </a>
                      </Link>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                        onClick={() => {
                          router.reload();
                        }}
                      >
                        Add another Changing Place
                      </button>
                      <Link href="/places">
                        <a
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                          onClick={() => setNotification(null)}
                          ref={cancelButtonRef}
                        >
                          Manage Changing Places
                        </a>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default BulkUpload;
