from django.contrib import admin
from store.models import Product, Category, Gallery, Specification, Size , Color

class GalleryInline(admin.TabularInline):
    model = Gallery

class SpecificationInline(admin.TabularInline):
    model = Specification

class SizeInline(admin.TabularInline):
    model = Size

class ColorInline(admin.TabularInline):
    model = Color

class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'category', 'shipping_amount', 'in_stock', 'vendor', 'featured']
    list_editable = ['featured']
    list_filter = ['date']
    search_fields = ['title']
    inlines = [GalleryInline, SpecificationInline, SizeInline, ColorInline]

# Register your models here.

admin.site.register(Category)
admin.site.register(Product, ProductAdmin)
