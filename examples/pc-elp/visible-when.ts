import { visibleWhen } from '@formflow/renderer';

const data = { agree: true };
const context = { role: 'admin' };

console.log(visibleWhen('data.agree && context.role === "admin"', data, context));
console.log(visibleWhen('data.agree && context.role === "user"', data, context));
