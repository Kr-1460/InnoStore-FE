import { GeneratorConfig } from 'ng-openapi';

const config: GeneratorConfig = {
  input: 'http://localhost:5165/openapi/v1.json',
  output: './src/app/core/generated',
  clientName: 'InnoStore',
  options: {
    dateType: 'Date',
    enumStyle: 'enum',
  },
};
export default config;
