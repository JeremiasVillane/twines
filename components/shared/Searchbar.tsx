"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { Input } from "../ui/input";

interface Props {
  routeType: string;
}

function Searchbar({ routeType }: Props) {
  const router = useRouter();

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    router.push(`/${routeType}?q=${event.target.value}`);
  };

  return (
    <section className="searchbar">
      <div className="flex items-center justify-center gap-1">
        <Search color="rgb(92 92 123)" />
        <Input
          id="text"
          onChange={handleSearch}
          placeholder={`${
            routeType === "search"
              ? "Buscar usuarios..."
              : "Buscar comunidades..."
          }`}
          className="no-focus searchbar_input"
        />
      </div>
    </section>
  );
}

export default Searchbar;
