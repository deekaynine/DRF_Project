from rest_framework import serializers
from rest_framework.reverse import reverse 

from .models import Product

from .validators import validate_title

class ProductSerializer(serializers.ModelSerializer):
    my_discount = serializers.SerializerMethodField(read_only=True)
    url = serializers.HyperlinkedIdentityField(view_name="product-detail", lookup_field='pk')
    title = serializers.CharField(validators=[validate_title])
    class Meta:
        model = Product
        fields =[
             'url',
            'title',
            'content',
            'price',
            'sale_price',
            'my_discount',
           
        ]
        exclude=[]

    def get_url(self,obj):
        request = self.context.get("request") #self.request
        if request is None:
            return None
        return reverse("product-detail", kwargs={"pk": obj.pk}, request=request)
    def get_my_discount(self,obj):
       if not hasattr(obj, "id"):
           return None
       if not isinstance(obj, Product):
           return None
       return obj.get_discount()
    

