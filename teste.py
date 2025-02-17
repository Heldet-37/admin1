import requests

url = "https://skyvendamz.up.railway.app/admin/denuncia_produtos/"
headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzQyMzgzMzI4fQ.QUIQDW7wTqi2nM2iR9AR4wHTXQU-gBLDdc28Psl_XAc"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    print(response.json())
else:
    print(f"Erro {response.status_code}: {response.text}")
