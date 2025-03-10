import axios from "axios";

const GET_POKEMONS_URL = "https://pokeapi.co/api/v2/pokemon";
const GET_POKEMON_FORM_BASE_URL = "https://pokeapi.co/api/v2/pokemon-form";

export async function getPokemonNames(): Promise<string[]> {
    return axios.get(GET_POKEMONS_URL, {
        params: {
            limit: 10000
        }
    }).then(result => {
        return result.data.results.map((val: {name: string, url: string}) => val.name)
    });
}

interface PokemonSpritesResponse {
    data: {
        sprites: {
            front_default: string | null;
            back_default: string | null;
            front_shiny: string | null;
            back_shiny: string | null;
        };
    }
}

export async function getPokemonSprites(pokemonName: string) {
    return axios.get(`${GET_POKEMON_FORM_BASE_URL}/${pokemonName}`).then((result: PokemonSpritesResponse) => {
        return result.data.sprites;
    });
}