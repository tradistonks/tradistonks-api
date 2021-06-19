import { GoRule } from './go-rule';

import { goFuncnameRule } from './funcname.go-rule';
import { goNoBoolConstCompRule } from './no-bool-const-comp.go-rule';

export { GoRule } from './go-rule';

export const GO_RULES: GoRule[] = [goFuncnameRule, goNoBoolConstCompRule];
