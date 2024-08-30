import requests

# Set the API endpoint
base_url = "http://localhost:3000"

# Set the headers
headers = {
    "Origin": "http://localhost:4173"
}

# Login
login_url = f"{base_url}/api/auth/login"
login_data = {"username": "admin", "password": "admin"}
login_response = requests.post(login_url, json=login_data, headers=headers)

# Check if login was successful
if login_response.status_code == 200:
    print("Login successful")

    # Get the session cookie
    cookies = login_response.cookies

    def test_route(method, route, base_url, cookies, headers, data=None):
        url = f"{base_url}{route}"
        response = requests.request(method, url, cookies=cookies, headers=headers, json=data)

        # Print the response
        print(route, response.status_code, response.text)
        print('-' * 10)

    # Send a request to /api/user/route1
    if login_response.status_code == 200:
        test_route('GET', '/api/user/profile', base_url, cookies, headers)
        test_route('PUT', '/api/user/profile', base_url, cookies, headers)
        test_route('POST', '/api/user/update_password', base_url, cookies, headers)
        json_data = {"wins": True}
        test_route('POST', '/api/user/update_data', base_url, cookies, headers, data=json_data)
        # and so on for other routes
    else:
        print("Login failed")
