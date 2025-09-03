
import React from 'react';
import VARFormIntro from '../VARFormIntro';

export default {
    title: 'VolunteerActivityReporting/VARFormIntro',
    component: VARFormIntro,
    argTypes: {
        userFirstName: {
            control: 'text'
        }
    }
};




export const Default = () => <VARFormIntro userFirstName="Chris" />;

export const Interactive = {
    args: {
        userFirstName: ''
    }

}