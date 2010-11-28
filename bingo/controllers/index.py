from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext

from django.http import HttpResponse

from django.contrib.auth.forms import AuthenticationForm

from bingo.forms import UserRegistrationForm

###
#   This is the default page that people will see when they go to the homepage.
###
def home(request):
    registerForm = UserRegistrationForm()
    loginForm = AuthenticationForm()
    
    return render_to_response('index.html', {
        'registerForm': registerForm, 
    }, context_instance = RequestContext(request))
    
    
###
#   This is an ajax controller that allows a user to create a new account.
###
def register(request):
    
    if request.method == 'POST':
        registerForm = UserRegistrationForm(request.POST)
        
        if form.is_valid():
            # Create the new user
            
            return HttpResponse('success', content_type = 'text/plain')
        else :
            return HttpResponse('error', content_type='text/plain')
    else:
        return HttpResponse('error', content_type='text/plain')