import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ArePropertiesUnique } from 'src/strategies/validators/are-properties-unique.validator';
import { IsAbsoluteFilePath } from 'src/strategies/validators/is-absolute-file-path.validator';

export class UpdateLanguageBodyFilesDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(260)
  @IsAbsoluteFilePath()
  path: string;

  @IsString()
  @MaxLength(1024 * 1024)
  content: string;
}

export class UpdateLanguageBodyDTO {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(320)
  name?: string;

  @IsOptional()
  @IsString()
  monaco_identifier?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024 * 1024)
  compile_script?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024 * 1024)
  run_script?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(64)
  @ArePropertiesUnique('path')
  @ValidateNested({ each: true })
  @Type(() => UpdateLanguageBodyFilesDTO)
  files?: UpdateLanguageBodyFilesDTO[];
}
