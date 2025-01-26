import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="flex flex-col justify-between min-h-screen">
      <div className="flex flex-col justify-center items-center flex-grow">
        <h1>Steam Calculator</h1>
        <h2 className="text-xl md:text-lg sm:text-sm">Lookup a SteamID and calculate the value of any Steam account</h2>
        <SearchBar />
      </div>
    </main>
  );
}
