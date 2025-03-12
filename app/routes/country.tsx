import type { Route } from "./+types/country";
import type { Country } from "./countries";


export async function clientLoader({ params }: Route.LoaderArgs): Promise<Country[]> {
    const countryName = params.countryName;

    try {
        const res = await fetch(
            `https://restcountries.com/v3.1/name/${countryName}?fullText=true`
        );
        const rawData = await res.json();

        const data: Country[] = rawData.map((country: any) => ({
            name: country.name,
            officialName: country.name.official,
            cca2: country.cca2,
            cca3: country.cca3,
            ccn3: country.ccn3,
            independent: country.independent,
            status: country.status,
            unMember: country.unMember,
            region: country.region,
            subregion: country.subregion,
            capital: country.capital,
            languages: country.languages,
            population: country.population,
            flag: country.flag,
            flagUrl: country.flags?.png || "",
        }));

        return data;
    } catch (error) {
        console.error("Failed to fetch country", error);
        return [];
    }
}


export default function Country({ loaderData }: Route.ComponentProps) {
    const country: Country | undefined = loaderData[0];

    if (!country) {
        return <p>Country not found</p>;
    }

    return (
        <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold text-gray-900">{country.name.common}</h2>
                <div className="space-y-2 text-gray-700">
                    <p>
                        <span className="font-semibold">Official Name:</span>{" "}
                        {country.officialName}
                    </p>
                    <p>
                        <span className="font-semibold">Capital:</span> {country.capital}
                    </p>
                    <p>
                        <span className="font-semibold">Region:</span> {country.region}
                    </p>
                    <p>
                        <span className="font-semibold">Subregion:</span>{" "}
                        {country.subregion}
                    </p>
                    <p>
                        <span className="font-semibold">Population:</span>{" "}
                        {country.population.toLocaleString()}
                    </p>
                </div>
            </div>
            {
                country.flagUrl && (
                    <div className="flex justify-center items-center">
                        <img
                            src={country.flagUrl}
                            alt="Country Flag"
                            className="w-60 h-auto border rounded shadow-lg"
                        />
                    </div>
                )
            }
        </div >
    );
}