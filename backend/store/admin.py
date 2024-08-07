from django.contrib import admin
from store.models import Product, Category, Wishlist, Gallery, Specification, Size , Color, CartItem, Order, OrderItem, Tax, Review, Coupon, Notification
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

class OrderAdmin(admin.ModelAdmin):
    search_fields = ['oid', 'full_name', 'email', 'mobile']
    list_editable = ['order_status', 'payment_status']
    list_filter = ['payment_status', 'order_status']
    list_display = ['oid', 'payment_status', 'order_status', 'sub_total', 'shipping_amount', 'tax_fee', 'service_fee' ,'total', 'saved' ,'date']

class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'product']
# Register your models here.

admin.site.register(Category)
admin.site.register(Product, ProductAdmin)
admin.site.register(CartItem)
admin.site.register(Order , OrderAdmin)
admin.site.register(OrderItem)
admin.site.register(Coupon)
admin.site.register(Review, ReviewAdmin)
admin.site.register(Tax)
admin.site.register(Notification)
admin.site.register(Wishlist)

