import { IsMongoId } from 'class-validator';

export class UpdateStrategyParamsDTO {
  @IsMongoId()
  strategy_id: string;
}
