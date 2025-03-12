import { Link } from "react-router";
import type { Route } from "./+types/countries";
import { useState } from "react";

interface Country {
    name: {
        common: string;
        official: string;
        nativeName?: Record<string, { official: string; common: string }>;
    };
    cca2: string;
    cca3: string;
    ccn3?: string;
    independent: boolean;
    status: string;
    unMember: boolean;
    region: string;
    subregion?: string;
    capital?: string[];
    languages: Record<string, string>;
    population: number;
    flag: string;
};

export async function clientLoader() {
    try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        const data = await res.json();
        return { countries: data };
    } catch (error) {
        console.error("Failed to fetch countries", error);
        return { countries: [] }
    }
}

export default function Countries({ loaderData }: Route.ComponentProps) {
    console.log(loaderData);
    const [search, setSearch] = useState<string>("");
    const [region, setRegion] = useState<string>("");

    const filteredCountries = (loaderData?.countries ?? []).filter((country: Country) => {
        const matchesRegion =
            !region || country.region.toLowerCase() === region.toLowerCase();
        const matchesSearch =
            !search ||
            country.name.common.toLowerCase().includes(search.toLowerCase());
        return matchesSearch && matchesRegion;
    });

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Countries</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/2 focus:outline-none focus:border-indigo-500"
                />
                <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/2 focus:outline-none focus:border-indigo-500"
                >
                    <option value="">All Regions</option>
                    <option value="africa">Africa</option>
                    <option value="americas">Americas</option>
                    <option value="asia">Asia</option>
                    <option value="europe">Europe</option>
                    <option value="oceania">Oceania</option>
                </select>
            </div>

            {filteredCountries.length === 0 ? (
                <div> No countries match your filters. </div>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredCountries.map((country: Country) => (
                        <li
                            key={country.cca3}
                            className="bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition"
                        >
                            <Link
                                to={`/countries/${country.name.common}`}
                                className="text-indigo-600 hover:underline text-lg font-semibold"
                            >
                                {country.name.common}
                            </Link>
                            <div className="text-gray-600 text-sm mt-1">
                                Region: {country.region} <br />
                                Population: {country.population.toLocaleString()}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}