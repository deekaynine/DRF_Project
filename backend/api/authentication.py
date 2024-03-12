from rest_framework.authentication import TokenAuthentication as BaseTokenAuth

class TokenAuthenticatoin(BaseTokenAuth):
    keyword = 'Bearer'