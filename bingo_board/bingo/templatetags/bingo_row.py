###
#   @file bingo_row.py
#   Contains the template tags for a row in a bingo board.
###
from django import template
 
register = template.Library()

###
#   A bingo row.
#
#   @param  {String}    letter    - The letter to print in the row
###
@register.inclusion_tag('partials/bingo_row.html')
def bingo_row(letter, extra_marker_class=''):
    number_ranges = {
        'B': {
            'min': 1, 
            'max': 16, 
        },
        'I': {
            'min': 16, 
            'max': 31, 
        },
        'N': {
            'min': 31, 
            'max': 46, 
        }, 
        'G': {
            'min': 46, 
            'max': 61, 
        }, 
        'O': {
            'min': 61, 
            'max': 76, 
        },
    }
    
    number_range = number_ranges[letter]
    
    return {
        'letter': letter, 
        'number_range': range(number_range['min'], number_range['max']), 
        'extra_marker_class': extra_marker_class, 
    }
    
    
    