import requests

url = "https://skyvendamz-production.up.railway.app/admin/denuncia_produtos/"
headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzQyNDU2ODAyfQ.ACRKlAf6Ibr9msjulobgvL-C9P17vboOqrZkdpBABXA"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    print(response.json())
else:
    print(f"Erro {response.status_code}: {response.text}")
