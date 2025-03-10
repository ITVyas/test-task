import TextInput from "./TextInput";
import SelectComponent from "./SelectComponent";
import usePokemons from "../hooks/usePokemons";
import PokemonModal from "./PokemonModal";
import { useRef, useState } from "react";
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { StarIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import lunaLogo from '../assets/logos/LunaEdgeLogo.svg';

type PokemonFormFields = {
    name: string;
    lastName: string;
    pokemonTeam: string[]
};

const nameRegisterProps = { 
    required: "This information is required.",
    minLength: {
        value: 2,
        message: 'Enter at least 2 symbols.'
    },
    maxLength: {
        value: 12,
        message: 'Enter maximum 12 symbols.'
    },
    pattern: {
        value: /^[A-Za-z]+$/,
        message: 'Please enter valid field value.'
    }
};

export default function PokemonForm() {
    const pokemons = usePokemons();

    const [isPokemonModalShown, setIsPokemonModalShown] = useState(false);
    const { register, handleSubmit, control, formState: { errors } } = useForm<PokemonFormFields>();


    const selectedPokemonsRef = useRef<string[]>([]);


    const submitHandler: SubmitHandler<PokemonFormFields> = (data) => {
        selectedPokemonsRef.current = data.pokemonTeam;
        setIsPokemonModalShown(true);
    };

    return (
        <form className="p-4 w-fit mx-auto my-2 mt-10 border-2 border-[#4D4D4D] rounded-md bg-white shadow-md" onSubmit={handleSubmit(submitHandler)}>
            <img src={lunaLogo} className='flex justify-self-center invert' />

            <TextInput register={register} registerProps={nameRegisterProps} name="name" 
                    placeholder="Enter the name..." label="Name" className="mb-2"
                    invalidMsg={errors.name?.message} />
            <TextInput register={register} registerProps={nameRegisterProps} name="lastName" 
                    placeholder="Enter the last name..." label="Last name" className="mb-2"
                    invalidMsg={errors.lastName?.message} />

            <Controller 
                control={control}
                name="pokemonTeam"
                defaultValue={[]}
                rules={{
                    validate: (value) => {
                        if(value.length === 4) return true;
                        return "Pick exactly 4 Pokemon.";
                    }
                }}
                render={({ field }) => (
                    <SelectComponent label="Your Pokemon team" helpText="Select 4 Pokemon" 
                        options={pokemons} onChange={field.onChange} maxN={4} 
                        invalidMsg={errors.pokemonTeam?.message}
                        emptyPlaceholder="Empty team"
                        searchPlaceholder="Start entering name"
                        />
                )}
            />
            

            <button type="submit" className="flex items-center gap-[4px] mt-[15px] border border-[#4724C7] rounded-md px-[8px] py-[2px] text-[#4724C7] hover:bg-[#EEF2FF] active:bg-[#ECF0FC]">
                <StarIcon className="inline-block size-4" />
                Assemble
                <ChevronDownIcon className="inline-block size-4" />
            </button>

            { isPokemonModalShown && 
                <PokemonModal cancelHandler={() => setIsPokemonModalShown(false)} 
                pokemonNames={selectedPokemonsRef.current} 
                /> }
        </form>
    );
}