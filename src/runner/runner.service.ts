import { Injectable } from '@nestjs/common';
import AdmZip from 'adm-zip';
import axios from 'axios';
import { SourceFiles } from 'src/schemas/strategy.schema';

export interface RunOptions {
  files: SourceFiles[];
  compileScript: string;
  runScript: string;
}

export interface RunResult {
  compile_status: number;
  compile_stdout: string;
  compile_stderr: string;

  run_status: number;
  run_stdout: string;
  run_stderr: string;
}

@Injectable()
export class RunnerService {
  async run(options: RunOptions) {
    const zip = new AdmZip();

    for (const file of options.files) {
      // Remove leading "/"
      const filepath = file.path.slice(1);

      zip.addFile(filepath, Buffer.from(file.content));
    }

    const filesBuffer = zip.toBuffer().toString('base64');

    try {
      const { data } = await axios.request<RunResult>({
        method: 'POST',
        url: `${process.env.GODBOX_URL}/run`,
        data: {
          files: filesBuffer,
          compile_script: options.compileScript,
          run_script: options.runScript,
        },
      });

      return data;
    } catch (e) {
      console.error(e);
    }
  }
}
