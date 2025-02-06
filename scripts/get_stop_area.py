import requests
import json
import os

api_key = os.getenv("NAVITIA_API_KEY")

search = "Melun"
url = f"https://api.navitia.io/v1/coverage/sncf/pt_objects?q={search}&type[]=stop_area"

headers = {"Authorization": api_key}

response = requests.get(url, headers=headers)
response.raise_for_status()

print(json.dumps(response.json(), indent=4))
