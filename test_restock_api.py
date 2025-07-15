import requests

url = "http://localhost:5000/api/chatbot/query"
payload = {"message": "restock plan"}
headers = {"Content-Type": "application/json"}
 
response = requests.post(url, json=payload, headers=headers)
print("Status Code:", response.status_code)
print("Response:")
print(response.text) 