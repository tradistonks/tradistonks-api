import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ArePropertiesUnique } from '../validators/are-properties-unique.validator';
import { IsAbsoluteFilePath } from '../validators/is-absolute-file-path.validator';

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

export class CreateStrategyBodyDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(320)
  name: string;

  @IsString()
  language: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(64)
  @ArePropertiesUnique('path')
  @ValidateNested({ each: true })
  @Type(() => CreateStrategyBodyFilesDTO)
  files: CreateStrategyBodyFilesDTO[];
}
