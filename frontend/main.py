import requests

endpoint = "http://localhost:8000/api/create/"

get_response = requests.post(endpoint, json={"title": "123"})
print(get_response.json())

