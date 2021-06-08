from django.contrib import admin
from .models import Todo

class TodoAdmin(admin.ModelAdmin):
    list_display = ('date','title', 'description','due','assignee','completed')

# Register your models here.

admin.site.register(Todo, TodoAdmin)