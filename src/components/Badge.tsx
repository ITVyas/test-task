import { XMarkIcon } from "@heroicons/react/24/solid";

export default function Badge({text, closeHandler=() => {}}: {text: string, closeHandler?: () => void}) {
    return (
        <div className="flex justify-center items-center w-fit h-auto pl-[10px] pr-[5px] bg-[#F4F4F6] rounded-l-full rounded-r-full whitespace-nowrap">
            {text}
            <XMarkIcon className="size-4 ml-1 text-[#9CA2AE] cursor-pointer hover:text-[#777B85]" onClick={closeHandler}/>
        </div>
    );
}