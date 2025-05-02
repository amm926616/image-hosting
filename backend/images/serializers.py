from rest_framework import serializers
from .models import ImageFolder, Image

class ImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ['id', 'name', 'url', 'uploaded_at']

    def get_url(self, obj):
        return self.context['request'].build_absolute_uri(obj.file.url)

class FolderSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = ImageFolder
        fields = ['id', 'name', 'path', 'created_at', 'images']
