from django.contrib import admin
from users.models import Profile, User

class UserAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'phone' ]

class ProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'gender', 'country' ]
    # list_editable = ['gender', 'country']
    search_fields = ['full_name']


# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)