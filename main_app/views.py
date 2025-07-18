from django.shortcuts import render, get_object_or_404, redirect
from .models import Bookmark
from .forms import BookmarkForm

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

def bookmark_edit(request, pk):
    bookmark = get_object_or_404(Bookmark, pk=pk)
    if request.method == 'POST':
        form = BookmarkForm(request.POST, instance=bookmark)
        if form.is_valid():
            form.save()
            return redirect('bookmark_list')
    else:
        form = BookmarkForm(instance=bookmark)
    return render(request, 'main_app/bookmark_form.html', {'form': form})

def bookmark_delete(request, pk):
    bookmark = get_object_or_404(Bookmark, pk=pk)
    if request.method == 'POST':
        bookmark.delete()
        return redirect('bookmark_list')
    return render(request, 'main_app/bookmark_confirm_delete.html', {'bookmark': bookmark})