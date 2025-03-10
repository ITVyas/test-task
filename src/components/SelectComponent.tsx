import { useEffect, useId, useRef, useState } from "react";
import Badge from "./Badge";
import { ChevronDownIcon, ChevronUpIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

export type SelectComponentProps = {
    label: string;
    helpText?: string;
    options: string[];
    onChange?: (newValue: string[]) => void;
    maxN?: number | null;
    invalidMsg?: undefined | string;
    emptyPlaceholder?: string;
    searchPlaceholder?: string;
};

export default function SelectComponent({ label, helpText, emptyPlaceholder="", searchPlaceholder="", onChange, maxN=null, options=[], invalidMsg } : SelectComponentProps) {
    const id = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const inputBlockRef = useRef<HTMLDivElement>(null);

    const [isListShown, setIsListShown] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    useEffect(() => {
        if (isListShown && inputBlockRef.current) {
            if(inputRef.current) inputRef.current.focus();

            const unfocusEvent = () => {
                if(!inputBlockRef.current || !inputBlockRef.current.matches(':hover')) {
                    setIsListShown(false);
                    document.removeEventListener('mousedown', unfocusEvent);
                }
            };

            setTimeout(() => {
                document.addEventListener('mousedown', unfocusEvent);
            }, 0);
            
            return () => document.removeEventListener('mousedown', unfocusEvent);
        }
      }, [isListShown]);

    useEffect(() => {
        if(onChange) onChange(selectedOptions);
    }, [selectedOptions]);


    const addOptionToSelected = (option: string) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions.push(option);
        setSelectedOptions(newSelectedOptions);
    };

    const removeOptionFromSelectedByIndex = (index: number) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions.splice(index, 1);
        setSelectedOptions(newSelectedOptions);

        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const clearSelectedOptions = () => {
        setSelectedOptions([]);
    };

    const checkIfMaxSelected = () => {
        return maxN !== null && selectedOptions.length >= maxN;
    };

    const mapOptionsToListElements = (options: string[]) => {
        return options.map(option => {
            const optionIndex = selectedOptions.findIndex(item => item === option);
            const included = optionIndex !== -1;
            return <div key={option} className={
                "relative cursor-pointer p-2 hover:bg-[#E0E0E0] border-b-[1px] border-b-[#F0F0F0] whitespace-nowrap " +
                (included ? "bg-[#EEF7F7] " : "")
            } onClick={
                included ? () => removeOptionFromSelectedByIndex(optionIndex) : () => addOptionToSelected(option)
            }>
                {option}
                {included && <CheckIcon className="flex h-full absolute top-0 right-[5px] size-5"/>}
            </div>;
        });
    }


    return (
        <div>
            <label htmlFor={id} className="inline-block font-medium mb-2">
                {label} 
            </label>

            <div ref={inputBlockRef} 
                className={
                    `flex relative w-[400px] h-[32px] p-1 items-center px-[10px] rounded-md gap-[4px] mb-2 hover:cursor-text overflow-x-clip overflow-y-visible select-none border border-[#D7D6DD]` +
                    (isListShown ? " outline outline-2 outline-[#4724C7] border-transparent" : "") +
                    (Boolean(invalidMsg) ? " outline outline-2 outline-[#F87070] border-transparent" : "")
                }
                onClick={(e) => {
                    const isEmptySelected = selectedOptions.length === 0;
                    const isListRefHovered = listRef.current?.matches(':hover') || false;

                    const switchIfEmptySelectedCondition = isEmptySelected && (!listRef.current || !isListRefHovered);
                    const switchIfNotEmptySelectedCondition = !isEmptySelected && e.currentTarget === e.target;

                    if(switchIfEmptySelectedCondition || switchIfNotEmptySelectedCondition)
                        setIsListShown(!isListShown);
                 }}>

                {
                    selectedOptions.length === 0 ?
                    (
                        <div className="inline-block text-[#9CA3AF]">{emptyPlaceholder}</div>
                    ) : (
                        <>
                            {
                                selectedOptions.map(option => (
                                    <Badge text={option} closeHandler={() => {
                                        const optionIndex = selectedOptions.findIndex(item => item === option);
                                        if(optionIndex === -1) return;
                                        const newSelectedOptions = [...selectedOptions];
                                        newSelectedOptions.splice(optionIndex, 1);
                                        setSelectedOptions(newSelectedOptions);
                                    }} key={`badge-${option}`}/>
                                ))
                            }
                        </>
                    )
                }

                <div id="side-buttons" className="flex absolute h-full w-fit right-0 top-0 rounded-r-md overflow-hidden">
                    {selectedOptions.length > 0 && (
                        <div onClick={clearSelectedOptions} 
                            className="flex justify-center items-center h-full aspect-square hover:cursor-pointer bg-white hover:bg-[#E6E6E6] select-none">
                            <XMarkIcon className="size-4 font-bold"/>
                        </div>
                    )}
                    
                    <div onClick={() => setIsListShown(!isListShown)} 
                        className="flex justify-center items-center h-full aspect-square hover:cursor-pointer bg-white hover:bg-[#E6E6E6] select-none">
                        {isListShown ? <ChevronUpIcon className="size-4 font-bold"/> : <ChevronDownIcon className="size-4 font-bold"/>}
                    </div>
                </div>
                

                { isListShown && (
                    <div ref={listRef} className="absolute top-[100%] translate-y-[4px] left-0 border w-full rounded-md overflow-hidden bg-white">
                        {
                            checkIfMaxSelected() ? (
                                <div className="p-2 text-[#025202]">You selected the maximum number</div>
                            ) : (
                                <input onInput={(event) => {
                                    const value = event.currentTarget.value.toLowerCase();
                                    event.currentTarget.value = value;
                                    setFilteredOptions(options.filter(item => item.startsWith(value)));
                                }} 
                                placeholder={searchPlaceholder}
                                id={id} ref={inputRef} type="text" 
                                className="block w-full border-b-[1px] p-[5px] px-[10px] outline-0"
                                 />
                            )
                        }


                        <div className="max-h-[300px] overflow-y-auto">
                            {
                                (() => {
                                    if(!inputRef.current?.value || checkIfMaxSelected()) {
                                        if(selectedOptions.length === 0)
                                            return (<div className="p-2 bg-[#F2F2F2]">You haven't chosen anything yet</div>);
                                        return mapOptionsToListElements(selectedOptions);
                                    } else {
                                        if(filteredOptions.length === 0)
                                            return (<div className="p-2 bg-[#F2F2F2]">Nothing is found</div>);
                                        return mapOptionsToListElements(filteredOptions);
                                    }
                                })()
                            }
                        </div>
                    </div>
                ) } 
            </div>

            {
                Boolean(invalidMsg) && (
                    <span className="text-[#F87070]">{invalidMsg}</span>
                )
            }
            
            {
                Boolean(!invalidMsg) && Boolean(helpText) && (
                    <span className="text-[#9492A0]">{helpText}</span>
                ) 
            }
        </div>
    );
}