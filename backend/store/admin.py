from django.contrib import admin
from store.models import Product, Category, Gallery, Specification, Size , Color, Cart, CartOrder, CartOrderItem, Tax, Review, Coupon
from users.models import User

# Inlines creates tabs in admin panel
# Inlines must have a foreign key to the referenced model (product)

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

class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'product']
# Register your models here.

admin.site.register(Category)
admin.site.register(Product, ProductAdmin)
admin.site.register(Cart)
admin.site.register(CartOrder)
admin.site.register(CartOrderItem)
admin.site.register(Coupon)
admin.site.register(Review, ReviewAdmin)
admin.site.register(Tax)

