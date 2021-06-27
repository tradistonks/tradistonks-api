import { GoRule } from './go-rule';

import { goFuncnameRule } from './funcname.go-rule';
import { goNoBoolConstCompRule } from './no-bool-const-comp.go-rule';
import { goVarnameRule } from './varname.go-rule';
import { goTooManyLoopsRule } from './too-many-loops.go-rule';

export { GoRule } from './go-rule';

export const GO_RULES: GoRule[] = [
  goFuncnameRule,
  goNoBoolConstCompRule,
  goVarnameRule,
  goTooManyLoopsRule,
];
