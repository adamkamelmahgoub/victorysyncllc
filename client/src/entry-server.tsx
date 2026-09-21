import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { Router } from 'wouter';
import App from './App';

export function render(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    const chunks: Buffer[] = [];
    output.on('data', (chunk: Buffer) => chunks.push(chunk));
    output.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    output.on('error', reject);
    let error: Error | undefined;
    const stream = renderToPipeableStream(<Router ssrPath={path}><App /></Router>, {
      onAllReady() {
        if (error) { reject(error); return; }
        stream.pipe(output);
      },
      onError(cause) { error = cause instanceof Error ? cause : new Error(String(cause)); },
    });
  });
}
