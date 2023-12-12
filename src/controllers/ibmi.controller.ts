import {inject} from '@loopback/core';
import {get, param} from '@loopback/rest';
import {IbmiDataDto} from '../models';
import {IbmiService} from '../services';

export class IbmiController {
  constructor(
    @inject('services.IbmiService')
    private ibmiService: IbmiService,
  ) { }

  @get('/ibmi/call-prgm/')
  async callPrgm(): Promise<IbmiDataDto> {
    const ibmiDataDao = await this.ibmiService.IBMI_Call_Prgm();
    const ibmiDataDto = new IbmiDataDto(ibmiDataDao);
    return ibmiDataDto;
  }

  @get('/ibmi/call-cosine/{number}')
  async callPrgmCosine(@param.path.number('number') number: number,): Promise<any> {
    const result = await this.ibmiService.IBMI_Call_cosine(number);
    return result;
  }

  @get('/test-call/')
  async call(): Promise<any> {
    const result = await this.ibmiService.IBMI_Call_cosine(10);
    return result;
  }
}

