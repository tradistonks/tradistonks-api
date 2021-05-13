import { IsMongoId } from 'class-validator';

export class QualityStrategyParamsDTO {
  @IsMongoId()
  strategy_id: string;
}
