from django.shortcuts import render

# Create your views here.
def logRegPage(request):
    return render(request, "registerLogin.html")

def checkFunc(request):
    return render(request, "index.html")