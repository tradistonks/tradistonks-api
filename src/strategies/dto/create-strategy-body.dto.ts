import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  IsMomentValid,
  TransformToDate,
} from 'src/validators/is-moment-valid.validator';
import { ArePropertiesUnique } from '../validators/are-properties-unique.validator';
import { IsAbsoluteFilePath } from '../validators/is-absolute-file-path.validator';
import { IsExistingLanguageId } from '../validators/is-existing-language-id.validator';

export class CreateStrategyBodyFilesDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(260)
  @IsAbsoluteFilePath()
  path: string;

  @IsString()
  @MaxLength(512 * 1024)
  content: string;
}

export class CreateStrategyBodySymbolDTO {
  @IsString()
  name: string;

  @IsString()
  ticker: string;

  @IsString()
  type: string;
}

export class CreateStrategyBodyDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(320)
  name: string;

  @IsExistingLanguageId()
  language: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(64)
  @ArePropertiesUnique('path')
  @ValidateNested({ each: true })
  @Type(() => CreateStrategyBodyFilesDTO)
  files: CreateStrategyBodyFilesDTO[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateStrategyBodySymbolDTO)
  symbols: CreateStrategyBodySymbolDTO[];

  @IsString()
  @IsIn(['1', '5', '15', '30', '60', 'D', 'W', 'M'])
  symbols_candles_granularity: string;

  @IsMomentValid()
  @TransformToDate()
  from: Date;

  @IsOptional()
  @IsMomentValid()
  @TransformToDate()
  to?: Date;
}
