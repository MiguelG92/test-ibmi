import {Model, model, property} from '@loopback/repository';
import { IbmiDataDao } from './ibmi-data-dao.model';

@model()
export class IbmiDataDto extends Model {
  

  @property({
    type: 'object',
    required: false,
  })
      response: Array<{
      info?: {
        data: Array<{
          "value": any
          type: string
          name?: string
          setlen?: string
        }>
        name?: string
        len?: string
      }
      name?: string
      io?: string
      data?: {
        "#text": any
        type: string
        name: string
        setlen?: string
      }
    }>
  
  

  constructor(data?: Partial<IbmiDataDao>) {
    super(data);  
  // Check if data has pgm and assign it if available
  if (data?.myscript?.pgm) {
   
      this.response = data.myscript.pgm.parm;
  }
  }
}  
export interface IbmiDataDtoRelations {
  // describe navigational properties here
}

export type IbmiDataDtoWithRelations = IbmiDataDto & IbmiDataDtoRelations;
