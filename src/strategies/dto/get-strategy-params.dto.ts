import { IsMongoId } from 'class-validator';

export class GetStrategyParamsDTO {
  @IsMongoId()
  strategy_id: string;
}
