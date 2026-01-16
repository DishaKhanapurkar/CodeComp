import { parse } from '@typescript-eslint/typescript-estree';

export function parseCode(code: string) {
  return parse(code, {
    loc: true,
    range: true,
    comment: false,
  });
}
