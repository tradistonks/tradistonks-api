import { Rule } from 'src/quality/utils/rule';
import { CPP14ParserVisitor } from '../runtime/CPP14ParserVisitor';

export interface CppRule extends Rule<keyof CPP14ParserVisitor<unknown>> {}
