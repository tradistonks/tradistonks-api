import { Injectable } from '@nestjs/common';
import AdmZip from 'adm-zip';
import axios from 'axios';
import { SourceFiles } from 'src/schemas/strategy.schema';

export interface RunOptions {
  files: SourceFiles[];
  compileScript: string;
  runScript: string;
}

export interface RunResultPhase {
  name: string;
  status: number;
  stdout: string;
  stderr: string;
  time: number;
  time_wall: number;
  used_memory: number;
  sandbox_status?: string;
  csw_voluntary: number;
  csw_forced: number;
}

export interface RunResult {
  phases: RunResultPhase[];
}

export class RunnerFailedError extends Error {
  status: number;

  constructor(data: { status: number; message: string }) {
    super(data?.message ?? 'The runner failed');

    this.status = data?.status ?? 500;
  }

  toJson() {
    return {
      status: this.status,
      message: this.message,
    };
  }
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
          phases: [
            {
              name: 'Compilation',
              script: options.compileScript,
            },
            {
              name: 'Execution',
              script: options.runScript,
            },
          ],
        },
      });

      return data;
    } catch (e) {
      throw new RunnerFailedError({
        status: e.response?.status,
        message: e.response?.data?.message,
      });
    }
  }
}
