import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ArePropertiesUnique } from '../validators/are-properties-unique.validator';
import { IsAbsoluteFilePath } from '../validators/is-absolute-file-path.validator';
import { IsExistingLanguageId } from '../validators/is-existing-language-id.validator';

export class UpdateStrategyBodyFilesDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(260)
  @IsAbsoluteFilePath()
  path: string;

  @IsString()
  @MaxLength(512 * 1024)
  content: string;
}

export class UpdateStrategyBodyDTO {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(320)
  name?: string;

  @IsOptional()
  @IsExistingLanguageId()
  language?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(64)
  @ArePropertiesUnique('path')
  @ValidateNested({ each: true })
  @Type(() => UpdateStrategyBodyFilesDTO)
  files?: UpdateStrategyBodyFilesDTO[];
}
