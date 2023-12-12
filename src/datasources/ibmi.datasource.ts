import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'ibmi',
  connector: 'odbc',
  transportOptions: {
    host: 'PUB400.COM',
    username: process.env.IBM_I_USERNAME,
    password: process.env.IBM_I_PASSWORD,
  },
};



@lifeCycleObserver('datasource')
export class IbmiDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'ibmi';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.ibmi', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
