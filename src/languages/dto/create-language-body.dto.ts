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

export class CreateLanguageBodyFilesDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(260)
  @IsAbsoluteFilePath()
  path: string;

  @IsString()
  @MaxLength(512 * 1024)
  content: string;
}

export class CreateLanguageBodyDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(320)
  name: string;

  @IsString()
  monaco_identifier: string;

  @IsOptional()
  @IsString()
  @MaxLength(512 * 1024)
  compile_script: string;

  @IsString()
  @MaxLength(512 * 1024)
  run_script: string;

  @IsArray()
  @ArrayMaxSize(64)
  @ArePropertiesUnique('path')
  @ValidateNested({ each: true })
  @Type(() => CreateLanguageBodyFilesDTO)
  files: CreateLanguageBodyFilesDTO[];
}
