import { IsMongoId } from 'class-validator';

export class RunStrategyParamsDTO {
  @IsMongoId()
  strategy_id: string;
}
