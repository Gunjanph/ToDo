from django.db import models

# Create your models here.

CHOICES = (
    ('open','OPEN'),
    ('working', 'WORKING'),
    ('done','DONE'),
    ('overdue','OVERDUE'),
)

class Todo(models.Model):
    # time_created =  models.TimeField(_(u"Conversation Time"), auto_now_add=True, blank=True)
    date = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=1000)
    due = models.DateField((u"Due Date"), blank=True, null=True)
    assignee = models.CharField(max_length=100, blank=True, null=True)
    completed = models.CharField((u"Status"),max_length=7, choices=CHOICES, default='open')
    def _str_(self):
        return self.title