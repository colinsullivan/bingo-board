
from django import forms
from django.utils.translation import ugettext_lazy as _

from django.contrib.auth.models import User

from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

class UserRegistrationForm(UserCreationForm):
    email = forms.EmailField(label=_("Email"))
    
    class Meta:
        model = User
        fields = ("username","email")
    
    def clean_email(self):
        email = self.cleaned_data['email']
        
        try:
            User.objects.get(email=email)
        except User.DoesNotExist:
            return email
        raise forms.ValidationError(_("A user with that email already exists."))
    
    
class UserLoginForm(AuthenticationForm):
    
    def clean_username(self):
        return super(UserLoginForm, self).clean_username()