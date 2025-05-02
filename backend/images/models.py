from django.db import models

class ImageFolder(models.Model):
    name = models.CharField(max_length=255)
    path = models.CharField(max_length=512, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Image(models.Model):
    folder = models.ForeignKey(ImageFolder, on_delete=models.CASCADE, related_name='images')
    name = models.CharField(max_length=255)
    file = models.ImageField(upload_to='')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
