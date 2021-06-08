from __future__ import print_function
from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TodoSerializer
from .models import Todo
from rest_framework.filters import OrderingFilter

# Create your views here.

# sortfield = 'title'
# sortorder = 'descend'

class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()
    print("In")
    filter_backends = [OrderingFilter]
    field = ""
    order = ""
    def get(self, request):
        print("In get")
        super().get(request)
        self.field = request.GET.get('sortfield')
        self.order = request.GET.get('sortorder')
        print(self.field)
        return super().get(request)
    
    ordering_fields = [field]
    print(field)
    if(order == 'descend'):
        ordering = ['-id']
    if(order == 'ascend'):
        ordering = ['id']
    
