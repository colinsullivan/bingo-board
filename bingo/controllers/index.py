from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext

from django.http import HttpResponse


from bingo.forms import UserRegistrationForm, UserLoginForm

###
#   This is the default page that people will see when they go to the homepage.
###
def home(request):
    registerForm = UserRegistrationForm()
    loginForm = UserLoginForm()
    
    return render_to_response('index.html', {
        'registerForm': registerForm, 
#        'loginForm': loginForm, 
    }, context_instance = RequestContext(request))
    
    
###
#   This is an basic controller that allows a user to create a new account.
###
def register(request):
    
    if request.method == 'POST':
        registerForm = UserRegistrationForm(request.POST)
        
        if registerForm.is_valid():
            # Create the new user
            content = 'creating user'
        else:
            content = 'errors'
    else:
        content = 'not post'
    
    return render_to_response('register_result.html', {
        'content': content, 
        'registerForm': registerForm,
    }, context_instance = RequestContext(request))
    
###
#   This is a basic controller that allows a user to login
###
def login(request):
    if request.method == 'POST':
        loginForm = AuthenticationForm(rquest.POST)
        
        if loginForm.is_valid():
            # Login the user
            content = 'loggin in'

    else :
        content = 'not post'
        
    return render_to_response('login_result.html', {
        'content': content,
        'loginForm': loginForm,
    }, context_instance = RequestContext(request))