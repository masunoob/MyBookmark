from django.urls import path
from . import views

urlpatterns = [
    path('', views.bookmark_list, name='bookmark_list'),
    path('create/', views.bookmark_create, name='bookmark_create'),
    path('edit/<int:pk>/', views.bookmark_edit, name='bookmark_edit'),
]
