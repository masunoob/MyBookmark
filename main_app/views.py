from django.shortcuts import render
from .models import Bookmark
from .forms import BookmarkForm
from django.shortcuts import redirect

# Create your views here.
def bookmark_list(request):
    bookmarks = Bookmark.objects.all()
    context = {
        'bookmarks': bookmarks
    }
    return render(request, 'main_app/bookmark_list.html', {'context': context})

def bookmark_create(request):
    if request.method == 'POST':
        form = BookmarkForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('bookmark_list')
    else:
        form = BookmarkForm()
    return render(request, 'main_app/bookmark_form.html', {'form': form})