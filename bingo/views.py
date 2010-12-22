from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext

from django.http import HttpResponse, HttpResponseRedirect

from django.contrib.auth.forms import AuthenticationForm
from bingo.forms import UserRegistrationForm
from django.views.decorators.cache import never_cache
from django.core.context_processors import csrf
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login as auth_login



###
#   This is the default page that people will see when they go to the homepage.
###
@never_cache
def index(request):
    
    # If this user is logged in
    if request.user.is_authenticated():
        # Go to home
        return HttpResponseRedirect('/home/')
    
    registerForm = UserRegistrationForm()
    loginForm = AuthenticationForm()
    
    return render_to_response('index.html', {
        'registerForm': registerForm, 
        'loginForm': loginForm, 
    }, context_instance = RequestContext(request))
    

###
#   This is the page that a user will see once they have successfully logged in.
###
@login_required
def home(request):
    user = request.user
    
    return render_to_response('home.html', {
        'message': 'Hello, '+user.email, 
    }, context_instance = RequestContext(request))
    
    
###
#   This is an basic controller that allows a user to create a new account.
###
@never_cache
def register(request):
    
    if request.method == 'POST':
        registerForm = UserRegistrationForm(request.POST)
        
        if registerForm.is_valid():
            # Create the new user
            user = registerForm.save()
            
            message = 'Registration was successful.  Please login as '+user.email
            registerForm = UserRegistrationForm()
            
        else:
            message = 'An error occurred while attempting to register.'
            registerForm = registerForm
            
    else:
        return HttpResponseRedirect('/')
        

    return render_to_response('index.html', {
        'message': message, 
        'registerForm': registerForm,
        'loginForm': AuthenticationForm(),
    }, context_instance = RequestContext(request))
    
    
    
###
#   This is a basic controller that allows a user to login
###
@never_cache
def login(request):
    if request.method == 'POST':
        loginForm = AuthenticationForm(data=request.POST)
        
        if loginForm.is_valid():
            #   User was successfully authenticated.  Redirect to home.
            auth_login(request,loginForm.get_user())
            return HttpResponseRedirect('/home/')
        else:
            message = 'An error occurred while logging in.'

    else :
        return HttpResponseRedirect('/')
        
    return render_to_response('index.html', {
        'message': message,
        'loginForm': loginForm,
        'registerForm': UserRegistrationForm()
    }, context_instance = RequestContext(request))