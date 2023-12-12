import {BindingScope, inject, injectable} from '@loopback/core';
import {XMLParser} from 'fast-xml-parser';
import {IbmiDataSource} from '../datasources';
import {IbmiDataDao} from '../models';
const {Connection, ProgramCall} = require('itoolkit');



@injectable({scope: BindingScope.TRANSIENT})
export class IbmiService {
  private dataSource: IbmiDataSource;
  constructor(
    @inject('datasources.ibmi')
    dataSource: IbmiDataSource
  ) {
    this.dataSource = dataSource;
  }


  async IBMI_Call_Prgm(): Promise<IbmiDataDao> {
    return new Promise<IbmiDataDao>((resolve, reject) => {
      const connector = IbmiDataSource.defaultConfig.connector;
      console.log(connector);
      const transportOptions = IbmiDataSource.defaultConfig.transportOptions;
      const conn = new Connection({
        transport: connector,
        transportOptions: transportOptions
      });

      const receiver = {
        name: 'receiver',
        type: 'ds', //data struture
        io: 'out',
        len: 'rec1',  //len:length or size of a data structure or array | rec1: variable
        fields: [
          {name: 'bytes_returned', type: '10i0', value: '0'},
          {name: 'bytes_available', type: '10i0', value: '0'},
          {name: 'object_name', type: '10A', value: ''},
          {name: 'object_library_name', type: '10A', value: ''},
          {name: 'object_type', type: '10A', value: ''},
          {name: 'return_library', type: '10A', value: '0'},
          {name: 'storage_pool_number', type: '10i0', value: '0'},
          {name: 'object_owner', type: '10A', value: ''},
          {name: 'object_domain', type: '2A', value: ''},
          {name: 'creation_datetime', type: '13A', value: ''},
          {name: 'object_change_datetime', type: '13A', value: ''},
        ],
      };

      const errno = {
        name: 'error_code',
        type: 'ds',
        io: 'both',
        len: 'rec2',
        fields: [
          {
            name: 'bytes_provided',
            type: '10i0',
            value: 0,
            setlen: 'rec2',
          },
          {name: 'bytes_available', type: '10i0', value: 0},
          {name: 'msgid', type: '7A', value: ''},
          {type: '1A', value: ''},
        ],
      };

      const objectAndLibrary = {
        type: 'ds',
        fields: [
          {name: 'object', type: '10A', value: 'QCSRC'},
          {name: 'lib', type: '10A', value: '*LIBL'},
        ],
      };

      const program = new ProgramCall('QUSROBJD', {lib: 'QSYS'});
      program.addParam(receiver);
      program.addParam({
        name: 'length_of_receiver',
        type: '10i0',
        setlen: 'rec1',
        value: '0',
      });
      program.addParam({name: 'format_name', type: '8A', value: 'OBJD0100'});
      program.addParam(objectAndLibrary);
      program.addParam({name: 'object_type', type: '10A', value: '*FILE'});
      program.addParam(errno);

      conn.add(program);
      conn.run((error: Error | null, xmlOutput: string) => {
        if (error) {
          reject(error); // Reject the Promise with an error if there's an error
        } else {
          const options = {
            attributeNamePrefix: '',
            ignoreAttributes: false,
            parseAttributeValue: true,
            arrayMode: true, // Enable array mode
            tagValueProcessor: (val: string, tagName: string) => tagName, // Use the tag name as is
          };
          const Parser = new XMLParser(options);
          const result = Parser.parse(xmlOutput,);
          const ibmiDataDao = new IbmiDataDao(result);
          resolve(ibmiDataDao); // Resolve the Promise with the value of ibmiDataDto
        }
      });
    });
  }


  async IBMI_Call_cosine(num: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const connector = IbmiDataSource.defaultConfig.connector;
      const transportOptions = IbmiDataSource.defaultConfig.transportOptions;
      const conn = new Connection({
        transport: connector,
        transportOptions: transportOptions
      });
      const program = new ProgramCall('QC2UTIL2', {lib: 'QSYS', func: 'cos'});

      program.addParam({name: 'angle', type: '8f', value: num, by: 'val'});
      program.addReturn({name: 'cos', type: '8f', value: ''});
      conn.add(program);

      conn.run((error: any, xmlOutput: string) => {
        if (error) {
          throw error;
        }


        // parse XML into JSON
        const XmlToJsonParser = new XMLParser();
        const result = XmlToJsonParser.parse(xmlOutput);
        resolve(result);
      });
    });
  }
}
