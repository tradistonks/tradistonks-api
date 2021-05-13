#!/bin/bash

set -xe

current_directory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
grammars_directory="$current_directory/src/quality/grammars"

for grammar_directory in $grammars_directory/*; do
    parser_name=`find $grammar_directory -name *Parser.g4`
    lexer_name=`find $grammar_directory -name *Lexer.g4`
    
    npm run antlr4ts -- -no-listener -visitor -o "$grammar_directory/runtime" "$lexer_name" "$parser_name"
    
    for file in $grammar_directory/runtime/*.ts; do
        sed -i.bak '1,2d' "$file"
        rm "$file.bak"
    done
done

npm run prettier -- --write "$current_directory/src/quality/grammars/**/runtime/*.ts"
npm run eslint -- --no-ignore "$current_directory/src/quality/grammars/**/runtime/*.ts" --fix
