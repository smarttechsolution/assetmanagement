from django.shortcuts import get_object_or_404, redirect, render

def home_page(request):
    return render(request, '404.html')



def return_help_page(request):
    return render(request, 'help.html')