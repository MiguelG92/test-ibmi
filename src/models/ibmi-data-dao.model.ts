import {Model, model, property} from '@loopback/repository';

@model()
export class IbmiDataDao extends Model {
  [key: string]: any;

  @property({
    type: 'object',
    required: true,
  })
  "?xml": {
    version: number
  }
  myscript: {
    pgm: {
      parm: Array<{
        ds?: {
          data: Array<{
            "#text": any
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
      success: string
      name: string
      lib: string
      error: string
    }
  }

  constructor(data?: Partial<IbmiDataDao>) {
    super(data);
  }
}

export interface IbmiDataDaoRelations {
}

export type IbmiDataDaoWithRelations = IbmiDataDao & IbmiDataDaoRelations;
