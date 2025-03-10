import type { Meta, StoryObj } from '@storybook/react';

import SelectComponent from '../components/SelectComponent';
import { useEffect, useState } from 'react';


const meta: Meta<typeof SelectComponent> = {
    title: 'Select Component',
    component: SelectComponent,
    argTypes: {
        onChange: { action: 'Selected changed' } 
    },
    render: (args, { loaded: { options } }) => <SelectComponent {...args} options={options} />,
};
 
export default meta;
type Story = StoryObj<typeof SelectComponent>;
 
export const Default: Story = {
    args: {
        label: 'Label',
        helpText: 'Help text',
        searchPlaceholder: 'Start entering...',
        emptyPlaceholder: 'Empty'
    },
};

export const MaximumElements: Story = {
    args: {
        label: 'Label',
        helpText: 'Select 4 elements',
        maxN: 4,
        searchPlaceholder: 'Start entering...',
        emptyPlaceholder: 'Empty'
    },
};

export const InvalidMessage: Story = {
    args: {
        label: 'Label',
        helpText: 'Select 3 elements',
        invalidMsg: 'Select exactly 3 elements',
        searchPlaceholder: 'Start entering...',
        emptyPlaceholder: 'Empty',
        maxN: 3
    },

    render: (args, { loaded: { options } }) => {
        const [msg, setMsg] = useState<string | undefined>(args.invalidMsg);
        const [selected, setSelected] = useState<string[]>([]);

        useEffect(() => {
            setMsg(selected.length === 3 ? undefined : args.invalidMsg);
        }, [selected]);

        return <SelectComponent {...args} options={options} invalidMsg={msg} onChange={setSelected} />
    }
};