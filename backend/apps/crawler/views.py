from django.shortcuts import render, HttpResponse, redirect
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return HttpResponse('Hello world!')


@csrf_exempt
def test(request):
    if request.method == "POST":    
        print(request.POST)
        return HttpResponse("Success")

    else:
        print("error")
        return HttpResponse("error")
