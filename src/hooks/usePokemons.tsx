import { useEffect, useState } from "react";
import { getPokemonNames } from "../api/requests";

export default function usePokemons() {
    const [pokemons, setPokemons] = useState<string[]>([]);

    useEffect(() => {
        let ignoreResult = false;
        getPokemonNames().then(pokemons => {
            if(!ignoreResult) setPokemons(pokemons);
        }).catch(console.log);

        return () => { ignoreResult = true };
    }, []);
    return pokemons;
}