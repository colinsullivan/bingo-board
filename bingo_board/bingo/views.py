from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext

from django.http import HttpResponse, HttpResponseRedirect

from django.contrib.auth.forms import AuthenticationForm
from bingo.forms import UserRegistrationForm
from django.views.decorators.cache import never_cache
from django.core.context_processors import csrf
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login as auth_login

from bingo.api import *



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
        'page': 'index', 
    }, context_instance = RequestContext(request))
    

###
#   This is the page that a user will see once they have successfully logged in.
###
@login_required
def home(request):
    user = request.user
    
    userBoards = UserBoardResource()
    userBoardsSerialized = userBoards.as_dict(request)
    
    
    return render_to_response('home.html', {
        'message': 'Hello, '+user.email, 
        'page': 'home',
        'data': simplejson.dumps({
            'boards': userBoardsSerialized, 
        }),
        'domain': request.META['HTTP_HOST'],
    }, context_instance = RequestContext(request))
    
    
###
#   A view that is not used directly, but contains all common functionality for
#   the edit and view board pages.
###
def bingo_board(request, board_id, template, page):
    board = Board.objects.get(pk = board_id)
    boardResource = SingleBoardResource()
    boardResource.set_board_id(board_id)
    # TODO: Serialization should be fixed in API so this is a single object
    boardSerialized = boardResource.as_dict(request)[0]
    
    return render_to_response(template, {
        'boardName': board.name,
        'page': page,
        'data': simplejson.dumps({
            'board': boardSerialized            
        })
    }, context_instance = RequestContext(request))
    
    
###
#   This is the page that the user can use to view the current state of the bingo 
#   board.
###
def view_board(request, board_id):
    return bingo_board(request, board_id, 'view_board.html', 'view')
    
    
    

###
#   This is the page that the user can use to call numbers on a bingo board.
###
@login_required
def edit_board(request, board_id):
    return bingo_board(request, board_id, 'edit_board.html', 'edit')


###
#   This is the view that is executed when a board is to be cleared
###
@login_required
def clear_board(request, board_id):
    
    user = request.user
    
    board = Board.objects.get(pk=board_id)
    
    if board.user != user:
        raise Exception('Operation not allowed')
    
    markers = Marker.objects.filter(board=board)
    
    for marker in markers:
        if(marker.value):
            marker.value = False
            marker.save()

    return HttpResponse('success', content_type='text/plain')
    
    
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
        'page': 'index', 
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
        'registerForm': UserRegistrationForm(),
        'page': 'index', 
    }, context_instance = RequestContext(request))