import requests

product_id = input("Enter your product id: ")

try:
    product_id = int(product_id)
    endpoint = f"http://localhost:8000/api/products/{product_id}/delete/"
    get_response = requests.delete(endpoint)
    print(get_response.status_code, get_response.status_code==204)
except:
    product_id = None
    print(f'{product_id} is invalid')





