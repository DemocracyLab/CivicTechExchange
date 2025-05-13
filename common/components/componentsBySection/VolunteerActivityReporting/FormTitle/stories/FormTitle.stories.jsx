import React from 'react';
import VARFormTitle from '../FormTitle';


export default {
    title: 'VolunteerActivityReporting/FormTitle',
    component: VARFormTitle,
    argTypes: {
        formTitle: {
            control: 'text',
        },
    },
};

const Template = (args) => <VARFormTitle {...args} />

export const Default = Template.bind({});
Default.args = {
    formTitle: 'Weekly Activity Report'
};
