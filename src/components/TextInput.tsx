import { useId } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface TextInputProps {
    label: string;
    placeholder: string;
    className?: string;
    invalidMsg?: string | null;
    register: any;
    registerProps: { [x: string]: any };
    name: string;
}

export default function TextInput({ label, placeholder, className="", name, register, registerProps, invalidMsg=null}: TextInputProps) {
    const id = useId();

    return (
        <div className={className}>

            <label htmlFor={id} className="inline-block font-medium mb-2">
                {label}
            </label>

            <input name={name} {...register(name, registerProps)} id={id} type="text" className={
                invalidMsg ? 
                "block rounded-lg p-[12px] h-[40px] w-[400px] border-2 border-[#F87070] mb-2 focus:outline-[#4724C7] focus:border-[#D7D6DD]":
                "block border border-[#D7D6DD] rounded-lg p-[12px] h-[40px] w-[400px] focus:outline-[#4724C7] mb-2"
            } placeholder={placeholder} />
            
            {
                invalidMsg && (
                    <div className="text-[#F87070]">{invalidMsg}</div>
                )
            }
            
            {
                !invalidMsg && Boolean(registerProps.required) && (
                    <div className="text-[#9492A0]">This information is required</div>
                )
            }
        </div>
    );
}