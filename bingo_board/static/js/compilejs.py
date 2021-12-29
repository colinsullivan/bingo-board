#! /usr/bin/env python

import re, os

###
# 2021-12-28
# brew install closure-compiler
#
# $ which closure-compiler
# /usr/local/bin/closure-compiler

# The root to chop off of the paths of the js files (where the script is run from)
JS_ROOT = '/static/js/'

# Path to the base template (where all js files are defined)
BASE_TEMPLATE = '../../templates/base.html'

# path to closure compiler
COMPILER_PATH = 'closure-compiler'

# The output file name
OUTPUT_FILE = 'compiled.js'



print('Beginning to compile JavaScript...')

print('Opening '+BASE_TEMPLATE+' template to get all JS files')

f = open(BASE_TEMPLATE, 'r')

jsFilePaths = []

# For each line in the template
line = f.readline()
while line:
    # If the line has a <script src="" tag in it 
    if re.search('<script src="', line):
        # Extract src=""
        jsfile = line.split('<script src="')[1].split('"')[0]
        # Ignore paths that are external, or if it is the compiled src
        if not re.search('http://', line) and not re.search(OUTPUT_FILE, line):
            jsFilePaths.append(jsfile.split(JS_ROOT)[1])
        
    line = f.readline()
f.close()

# Now we have all of the file paths, we can construct command
command = COMPILER_PATH

for jsFile in jsFilePaths:
    command += ' \\\n\t--js="'+jsFile+'"'
    
command += ' \\\n\t--js_output_file="'+OUTPUT_FILE+'"'

print('Running command:\n'+command)

os.system(command)


