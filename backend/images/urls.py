from django.urls import path
from . import views


urlpatterns = [
    path('collections/', views.get_collections, name='get_collections'),
    path('links/<path:collection_path>/', views.get_image_links, name='get_image_links'),
]
