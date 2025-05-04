import os
import re
from django.http.response import JsonResponse
from django.shortcuts import render
from django.conf import settings
from django.core.paginator import Paginator
from django.views.decorators.http import require_GET


@require_GET
def home(request):
    return render(request, 'images/home.html')

@require_GET
def get_collections(request):
    """
    Returns metadata about all image collections (folders)
    Format: {folder_path: {count: int, thumbnail: str?}}
    """
    media_root = settings.MEDIA_ROOT
    collections = {}

    for root, dirs, files in os.walk(media_root):
        # Skip hidden directories
        dirs[:] = [d for d in dirs if not d.startswith('.')]

        relative_folder = os.path.relpath(root, media_root)
        if relative_folder.startswith('.'):
            continue

        folder_key = relative_folder.replace('\\', '/')

        # Only process directories that contain images
        image_files = [
            f for f in files
            if not f.startswith('.') and f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))
        ]

        if not image_files:
            continue

        # Get first image as thumbnail (you might want to implement a better thumbnail selection)
        thumbnail_url = None
        if image_files:
            thumbnail_path = os.path.join(folder_key, image_files[0]).replace('\\', '/')
            thumbnail_url = request.build_absolute_uri(
                os.path.join(settings.MEDIA_URL, thumbnail_path)
            )

        collections[folder_key] = {
            'count': len(image_files),
            'thumbnail': thumbnail_url
        }

    return JsonResponse(collections)

@require_GET
def get_image_links(request, collection_path):
    """
    Returns paginated image links for a specific collection
    Expects: collection_path as URL parameter
    Optional query params: page (default=1), per_page (default=24)
    """
    page_number = request.GET.get('page', 1)
    try:
        page_number = int(page_number)
    except (TypeError, ValueError):
        page_number = 1

    per_page = request.GET.get('per_page', 24)
    try:
        per_page = int(per_page)
    except (TypeError, ValueError):
        per_page = 24

    # Validate collection path
    collection_full_path = os.path.normpath(os.path.join(settings.MEDIA_ROOT, collection_path))

    # Security check to prevent directory traversal
    if not collection_full_path.startswith(settings.MEDIA_ROOT):
        return JsonResponse({'error': 'Invalid collection path'}, status=400)

    if not os.path.isdir(collection_full_path):
        return JsonResponse({'error': 'Collection not found'}, status=404)

    # Get all image files in the collection
    image_urls = []
    for filename in os.listdir(collection_full_path):
        if filename.startswith('.'):
            continue

        file_path = os.path.join(collection_full_path, filename)
        if os.path.isfile(file_path) and filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
            relative_path = os.path.join(collection_path, filename).replace('\\', '/')
            image_url = request.build_absolute_uri(
                os.path.join(settings.MEDIA_URL, relative_path)
            )
            image_urls.append(image_url)

    # Sort images naturally (you might want to customize this)
    image_urls.sort(key=natural_key)

    # Paginate results
    paginator = Paginator(image_urls, per_page)
    try:
        page = paginator.page(page_number)
    except:
        return JsonResponse({'error': 'Invalid page number'}, status=400)

    return JsonResponse({
        'images': list(page.object_list),
        'has_next': page.has_next(),
        'total_images': paginator.count,
        'current_page': page.number,
        'total_pages': paginator.num_pages
    })

# to fix sorting problem
def natural_key(url):
    # Extract the last numeric group in the filename
    filename = os.path.basename(url)
    numbers = re.findall(r'\d+', filename)
    return [int(num) for num in numbers] if numbers else [0]
