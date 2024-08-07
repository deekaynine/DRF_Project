from rest_framework import serializers

from store.models import Category, Product, Gallery, Color, Specification, CartItem, Order, OrderItem,ProductFaq, Wishlist, Notification, Coupon, Size, Review, Profile
from vendor.models import Vendor
class CategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = "__all__"

class SpecificationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Specification
        fields = "__all__"

class GallerySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Gallery
        fields = "__all__"

class SizeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Size
        fields = "__all__"

class ColorSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Color
        fields = "__all__"

class VendorSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Vendor
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(VendorSerializer,self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class ProductSerializer(serializers.ModelSerializer):
    gallery= GallerySerializer(many=True, read_only=True)
    color= ColorSerializer(many=True, read_only=True)
    specification= SpecificationSerializer(many=True, read_only=True)
    size= SizeSerializer(many=True, read_only=True)
    

    class Meta:
        model = Product
        fields = ["id",
                  "title",
                  "description",
                  "image",
                  "category",
                  "price",
                  "og_price",
                  "shipping_amount",
                  "stock_qty",
                  "in_stock",
                  "status",
                  "featured",
                  "views",
                  "rating",
                  "vendor",
                  "pid",
                  "slug",
                  "date",
                  "product_rating",
                  "rating_count",
                  'gallery',
                  'color',
                  'specification',
                  "size",
                  "order_count"
                  ]
        
    def __init__(self, *args, **kwargs):
        super(ProductSerializer,self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class CartItemSerializer(serializers.ModelSerializer):
    
    product = ProductSerializer()  

    class Meta:
        model = CartItem
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super(CartItemSerializer, self).__init__(*args, **kwargs)
        # Customize serialization depth based on the request method.
        request = self.context.get('request')
        if request and request.method == 'POST':
            # When creating a new cart order item, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3


class OrderItemSerializer(serializers.ModelSerializer): 

    class Meta:
        model = OrderItem
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super(OrderItemSerializer, self).__init__(*args, **kwargs)
        # Customize serialization depth based on the request method.
        request = self.context.get('request')
        if request and request.method == 'POST':
            # When creating a new cart order item, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3


class OrderSerializer(serializers.ModelSerializer):

    orderItem = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(OrderSerializer, self).__init__(*args, **kwargs)
        # Customize serialization depth based on the request method.
        request = self.context.get('request')
        if request and request.method == 'POST':
            # When creating a new cart order, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3

class ProductFaqSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ProductFaq
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(ProductFaq,self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3



class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields="__all__"

class ReviewSerializer(serializers.ModelSerializer):
    user_profile = ProfileSerializer()
    product = ProductSerializer()
    user_rating = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Review
        fields = ["id","review","user_rating","reply","user","user_profile", "product","date"] 

    def __init__(self, *args, **kwargs):
        super(ReviewSerializer,self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3
            
    def get_user_rating(self,obj):
        return obj.get_rating()

class WishlistSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Wishlist
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(WishlistSerializer,self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class CouponSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Coupon
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(CouponSerializer,self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class NotificationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Notification
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super(NotificationSerializer,self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class SummarySerializer(serializers.Serializer):
    products = serializers.IntegerField()
    orders = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=12, decimal_places=2)


class EarningSummarySerializer(serializers.Serializer):
    monthly_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)

class CouponSummarySerializer(serializers.Serializer):
    total_coupons = serializers.IntegerField()
    active_coupons = serializers.IntegerField()

class NotificationSummarySerializer(serializers.Serializer):
    read_notif = serializers.IntegerField()
    unread_notif = serializers.IntegerField()
    all_notif = serializers.IntegerField() 