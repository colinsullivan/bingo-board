
from django import forms
from django.utils.translation import ugettext_lazy as _

from django.contrib.auth.models import User

from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

class UserRegistrationForm(forms.Form):
    email = forms.EmailField(label=_("Email"))
    password1 = forms.CharField(label=_("Password"), widget=forms.PasswordInput)
    password2 = forms.CharField(label=_("Password confirmation"), widget=forms.PasswordInput,
        help_text = _("Enter the same password as above, for verification."))
    
    # These properties probably don't matter since we are subclassing forms.Form
    # instead of a model form, but I left them in there anyway.
    class Meta:
        model = User
        fields = ('email')
    
    def clean_email(self):
        email = self.cleaned_data['email']
        
        try:
            User.objects.get(email=email)
        except User.DoesNotExist:
            return email
        raise forms.ValidationError(_("A user with that email already exists."))
        
    def clean_password2(self):
        password1 = self.cleaned_data.get("password1", "")
        password2 = self.cleaned_data["password2"]
        if password1 != password2:
            raise forms.ValidationError(_("The two password fields didn't match."))
        return password2

    def save(self, commit=True):
        user = User(email=self.cleaned_data['email'], username=self.cleaned_data['email'])
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user
