from rest_framework import serializers

class UserProductInlineSerializer(serializers.Serializer):
    url = serializers.HyperlinkedIdentityField(view_name='product-detail',
                                               lookup_field='pk',
                                               read_only=True)
    title = serializers.CharField(read_only=True)
    price = serializers.IntegerField(read_only=True)

class UserPublicSerializer(serializers.Serializer):
    username = serializers.CharField(read_only=True)
    id = serializers.IntegerField(read_only=True)
    other_products = serializers.SerializerMethodField(read_only=True)
    
    # Gains access to foreign key related model: User
    # Because this serializer is nested in the Product serializer serializing the Product Model
    def get_other_products(self,obj):
        request=self.context.get('request')
        user = obj
        my_products_qs = user.product_set.all()
        return UserProductInlineSerializer(my_products_qs, many=True, context=self.context).data