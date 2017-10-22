import Environment from 'environment';

export const isTest = () => Environment.name === 'test';
export const isDev = () => Environment.name === 'development' || Environment.name === 'local';



// WEBPACK FOOTER //
// ./src/js/app/helpers/environment.js