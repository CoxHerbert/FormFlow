export interface EvalContext {
  data?: Record<string, any>;
  context?: Record<string, any>;
}

type Token =
  | { type: 'and' | 'or' | 'eq' | 'neq' | 'lparen' | 'rparen' | 'dot' }
  | { type: 'identifier'; value: string }
  | { type: 'string'; value: string }
  | { type: 'number'; value: number };

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (input.startsWith('&&', i)) {
      tokens.push({ type: 'and' });
      i += 2;
      continue;
    }
    if (input.startsWith('||', i)) {
      tokens.push({ type: 'or' });
      i += 2;
      continue;
    }
    if (input.startsWith('===', i)) {
      tokens.push({ type: 'eq' });
      i += 3;
      continue;
    }
    if (input.startsWith('!==', i)) {
      tokens.push({ type: 'neq' });
      i += 3;
      continue;
    }
    if (ch === '(') {
      tokens.push({ type: 'lparen' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'rparen' });
      i++;
      continue;
    }
    if (ch === '.') {
      tokens.push({ type: 'dot' });
      i++;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const quote = ch;
      i++;
      let str = '';
      while (i < input.length && input[i] !== quote) {
        str += input[i];
        i++;
      }
      if (input[i] !== quote) throw new Error('Unterminated string');
      i++;
      tokens.push({ type: 'string', value: str });
      continue;
    }
    if (/[0-9]/.test(ch)) {
      let start = i;
      while (i < input.length && /[0-9]/.test(input[i])) i++;
      tokens.push({ type: 'number', value: Number(input.slice(start, i)) });
      continue;
    }
    if (/[a-zA-Z_]/.test(ch)) {
      let start = i;
      while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) i++;
      tokens.push({ type: 'identifier', value: input.slice(start, i) });
      continue;
    }
    throw new Error(`Unexpected token: ${ch}`);
  }
  return tokens;
}

type ASTNode =
  | { type: 'literal'; value: any }
  | { type: 'identifier'; root: 'data' | 'context'; path: string[] }
  | { type: 'and' | 'or' | 'eq' | 'neq'; left: ASTNode; right: ASTNode };

class Parser {
  private pos = 0;
  constructor(private tokens: Token[]) {}

  parse(): ASTNode {
    return this.parseOr();
  }

  private parseOr(): ASTNode {
    let node = this.parseAnd();
    while (this.match('or')) {
      node = { type: 'or', left: node, right: this.parseAnd() };
    }
    return node;
  }

  private parseAnd(): ASTNode {
    let node = this.parseEquality();
    while (this.match('and')) {
      node = { type: 'and', left: node, right: this.parseEquality() };
    }
    return node;
  }

  private parseEquality(): ASTNode {
    let node = this.parsePrimary();
    while (true) {
      if (this.match('eq')) {
        node = { type: 'eq', left: node, right: this.parsePrimary() };
      } else if (this.match('neq')) {
        node = { type: 'neq', left: node, right: this.parsePrimary() };
      } else {
        break;
      }
    }
    return node;
  }

  private parsePrimary(): ASTNode {
    if (this.match('lparen')) {
      const expr = this.parseOr();
      this.expect('rparen');
      return expr;
    }
    if (this.peek('identifier')) {
      return this.parseIdentifier();
    }
    if (this.peek('string')) {
      return { type: 'literal', value: this.consume('string').value };
    }
    if (this.peek('number')) {
      return { type: 'literal', value: this.consume('number').value };
    }
    throw new Error('Unexpected token');
  }

  private parseIdentifier(): ASTNode {
    const id = this.consume('identifier').value as string;
    if (id !== 'data' && id !== 'context') {
      throw new Error(`Unknown identifier: ${id}`);
    }
    const path: string[] = [];
    while (this.match('dot')) {
      const prop = this.consume('identifier').value as string;
      path.push(prop);
    }
    return { type: 'identifier', root: id as 'data' | 'context', path };
  }

  private peek(type: Token['type']) {
    return this.tokens[this.pos]?.type === type;
  }
  private match(type: Token['type']) {
    if (this.peek(type)) {
      this.pos++;
      return true;
    }
    return false;
  }
  private consume(type: Token['type']) {
    if (!this.peek(type)) throw new Error(`Expected ${type}`);
    return this.tokens[this.pos++];
  }
  private expect(type: Token['type']) {
    if (!this.match(type)) throw new Error(`Expected ${type}`);
  }
}

function evaluate(node: ASTNode, ctx: EvalContext): any {
  switch (node.type) {
    case 'literal':
      return node.value;
    case 'identifier': {
      let value = node.root === 'data' ? ctx.data : ctx.context;
      for (const p of node.path) {
        if (value == null) return undefined;
        value = (value as any)[p];
      }
      return value;
    }
    case 'and':
      return evaluate(node.left, ctx) && evaluate(node.right, ctx);
    case 'or':
      return evaluate(node.left, ctx) || evaluate(node.right, ctx);
    case 'eq':
      return evaluate(node.left, ctx) === evaluate(node.right, ctx);
    case 'neq':
      return evaluate(node.left, ctx) !== evaluate(node.right, ctx);
  }
}

export function evalExpr(expression: string, ctx: EvalContext = {}): any {
  const tokens = tokenize(expression);
  const ast = new Parser(tokens).parse();
  return evaluate(ast, ctx);
}
