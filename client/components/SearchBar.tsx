'use client';

import React, { FormEvent, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [id, setId] = useState<string>('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const account = await fetch(`/api/fetchAccount?id=${id}`);
      if (!account.ok) {
        router.push("/not-found");
      }

      const accountData = await account.json();
      
      const games = await fetch(`/api/fetchGames?id=${id}`);
      const gamesData = await games.json();
      const result = { accountData, accountVault: gamesData.gamesValue };

      console.log(result);
      router.push(`/profile/${id}?data=${encodeURIComponent(JSON.stringify(result))}`);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const extractSteamID = async (url: string): Promise<string> => {
    const profileRegex = /https?:\/\/steamcommunity\.com\/profiles\/(\d+)/;
    const customIdRegex = /https?:\/\/steamcommunity\.com\/id\/([a-zA-Z0-9_\-]+)/;

    const profileMatch = url.match(profileRegex);
    if (profileMatch) {
      return profileMatch[1];
    }

    const customIdMatch = url.match(customIdRegex);
    if (customIdMatch) {
      try {
        const response = await fetch(`/api/resolveVanityURL?vanityurl=${customIdMatch[1]}`);
        const data = await response.json();

        if (data.response?.success !== 1) {
          throw new Error("Failed to resolve Vanity URL");
        }

        return data.response.steamid;
      } catch (error) {
        console.error("Error resolving Vanity URL", error);
      }
    }

    return url;
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim();

    if (input) {
      const extractedID = await extractSteamID(input);
      setId(extractedID);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='mt-2 relative lg:w-[700px] md:w-[500px] sm:w-[400px] flex items-center'>
      <Input 
        type='search' 
        placeholder='SteamID'
        className='text-slate-200 placeholder-slate-50 rounded-r-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
        onChange={handleInputChange}
      />
      <Button 
        type='submit' 
        size='icon' 
        variant='secondary' 
        className='rounded-l-none' 
        disabled={isLoading}>
        {isLoading ? 'Loading...' : <SearchIcon className='h-5 w-5 text-muted-foreground' />}
      </Button>
    </form>
  );
}
