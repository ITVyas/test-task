import { useEffect, useState } from "react";
import { getPokemonSprites } from "../api/requests";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface PokemonModalProps {
    pokemonNames: Array<string>;
    cancelHandler?: () => void;
    saveHandler?: () => void;
};

export default function PokemonModal({ pokemonNames, cancelHandler=() => {}, saveHandler=() => {} } : PokemonModalProps) {

    const [pokemonSpriteUrls, setPokemonSpriteUrls] = useState<Array<string | null>>(pokemonNames.map(() => null));

    useEffect(() => {
        Promise.all(pokemonNames.map((name: string) => getPokemonSprites(name)))
            .then(
                pokemonSprites => setPokemonSpriteUrls(pokemonSprites.map(sprites => sprites.front_default))
            )
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-[#00000033] flex justify-center items-center">
            <div className="bg-white rounded-md shadow-md p-5 relative">
                <XMarkIcon onClick={cancelHandler} className="absolute size-7 top-5 right-5 cursor-pointer hover:text-[#424242]" />
                <h1 className="text-xl font-medium">Pokemon Team</h1>
                <div className="grid grid-cols-2 gap-2">
                    {
                        pokemonSpriteUrls.map((url: string | null, i: number) => {
                            if(!url) 
                                return <div className="w-[150px] aspect-square bg-gray-100 rounded-md" key={`front-sprite-${pokemonNames[i]}`}></div>;
                            return (
                                <img src={url || ""} key={`front-sprite-${pokemonNames[i]}`} className="w-[150px] aspect-square bg-transparent"/>
                            );
                        })
                    }
                </div>
                <div className="flex gap-4 justify-end mt-2">
                    <button onClick={cancelHandler} type="button" className="px-3 rounded-[4px] pb-[2px] hover:bg-[#EEF2FF] active:bg-[#ECF0FC]">Cancel</button>
                    <button onClick={saveHandler} type="button" className="text-white bg-[#4724C7] px-3 rounded-[4px] pb-[2px] hover:bg-[#4322BD]">Save</button>
                </div>
            </div>
        </div>
    );
}