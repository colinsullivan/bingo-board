from django import template


register = template.Library()

###
#   This is a partial template for a form.  All forms will have this same stuff.
#
@register.inclusion_tag('partials/form.html')
def form(id, title, action, f):
    return {
        'title': title, 
        'id': id, 
        'action': action, 
        'form': f, 
    }

@register.inclusion_tag('partials/register_form.html')
def register_form(registerForm):
    return form('registration', 'Register', '/register/', registerForm)

@register.inclusion_tag('partials/login_form.html')
def login_form(loginForm):
    return form('login', 'Login', '/login/', loginForm)

###
#   This is a partial template for a field.  All fields will have this same stuff.
#
@register.inclusion_tag('partials/field.html')
def field(f, fieldObject, form_id, field_id, field_label, input_type, input_attrs=''):
    
    try:
        value = fieldObject.data
    except AttributeError:
        value = ''
        
    if value == None:
        value = ''

        
    return {
        'form_id': form_id, 
        'field_id': field_id, 
        'field_label': field_label, 
        'input_type': input_type, 
        'input_attrs': input_attrs, 
        'field': fieldObject, 
        'value': value, 
    }

