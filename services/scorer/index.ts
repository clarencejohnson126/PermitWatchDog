import { evaluateFiling } from '../../packages/doctrine/src/engine';

export async function scoreFiling(filing: any, project: any) {
  const output = await evaluateFiling({ filing, project });
  return output;
}
