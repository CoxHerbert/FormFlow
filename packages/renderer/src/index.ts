import { evalExpr } from '@formflow/core';

export function visibleWhen(expr: string | undefined, data: any, context: any) {
  if (!expr) return true;
  return !!evalExpr(expr, { data, context });
}
