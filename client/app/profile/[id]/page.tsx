"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import PersonIcon from '@mui/icons-material/Person';
import SearchBar from "@/components/SearchBar";
import { useState, useEffect } from "react";

interface Account {
  avatar: string;
  name: string;
  visibility: number;
  accountAge: number;
}

interface AccountData {
  account: Account;
}

interface SearchResult {
  accountData: AccountData;
  accountVault: string;
}

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!data) {
      setLoading(false);
      return;
    }

    let parsedResult: SearchResult | null = null;
    try {
      parsedResult = JSON.parse(decodeURIComponent(data));
    } catch (error) {
      console.error("Failed to parse searchParams.data", error);
    }

    setResult(parsedResult);
    setLoading(false);
  }, [data]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!result) {
    return <p>Invalid data format or missing data.</p>;
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
      <div className="w-full px-4 py-2 absolute top-8 flex justify-center">
        <SearchBar />
      </div>
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-md md:max-w-lg lg:max-w-2xl mx-4 mt-16">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <Image
            src={result.accountData.account.avatar}
            alt="Avatar"
            width={100}
            height={100}
            className="rounded-full border-4 border-gray-700"
          />
          <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
            <h2 className="text-xl font-semibold">{result.accountData.account.name}</h2>
            <p className="text-sm text-gray-400">{result.accountData.account.visibility}</p>
            <p className="mt-2 text-gray-300 flex items-center justify-center md:justify-start">
              <PersonIcon className="text-9xl" /> <span className="font-medium ml-2">{result.accountData.account.accountAge} years</span>
            </p>
            <p className="mt-1 text-gray-300">
              Account Value: <span className="font-medium text-green-500">${result.accountVault}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
