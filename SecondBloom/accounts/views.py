from django.shortcuts import render
from django.http import HttpResponsePermanentRedirect

# Create your views here.
def logInPage(request):
    return render(request, "login.html")

def registerPage(request):
    return render(request, "signIn.html")