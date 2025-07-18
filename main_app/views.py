from django.shortcuts import render
from .models import Bookmark

# Create your views here.
def bookmark_list(request):
    bookmarks = Bookmark.objects.all()
    context = {
        'bookmarks': bookmarks
    }
    return render(request, 'main_app/bookmark_list.html', {'context': context})
