import sys
import time
import json
import signal
import requests
import subprocess


# firebase url
url = 'https://smart-mirror-5467c-default-rtdb.firebaseio.com/'


# load data from json files
def loadDefaultData():
    with open('./config/default_config.json', 'r') as f:
        data = json.load(f)
        return data


def loadstartupConfig():
    with open('./config/startup_config.json', 'r') as f:
        data = json.load(f)
        return data


def loadData():
    with open('./config/config.json', 'r') as f:
        data = json.load(f)
        return data


def saveData(data):
    with open('./config/config.json', 'w') as f:
        json.dump(data, f)


def loadParams():
    global params
    with open('./config/params.json', 'r') as f:
        params = json.load(f)


def saveParams():
    global params
    with open('./config/params.json', 'w') as f:
        json.dump(params, f)


def loadCredentials():
    global credentials
    with open('./config/credentials.json', 'r') as f:
        credentials = json.load(f)


def saveCredentials():
    global credentials
    with open('./config/credentials.json', 'w') as f:
        json.dump(credentials, f)


# load startup config if no config is found
loadParams()
loadCredentials()
saveData(loadstartupConfig())

# function to get the id token


def getIdToken(refresh_token):
    url = "https://securetoken.googleapis.com/v1/token?key=AIzaSyC4vl0DJrf2rmk6PNDv6XuQsrFR1FmIMI4"
    payload = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    for i in range(3):
        response = requests.post(url, data=payload, headers=headers)
        try:
            response.raise_for_status()
            return response.json()['id_token']
        except (requests.exceptions.HTTPError, KeyError) as e:
            print(f"[Python] Error fetching ID token: {e}")
    print("[Python] Failed to fetch ID token after 3 attempts")
    return None


# function to check if the user is found
def check_user():
    global url
    global params
    global credentials

    for i in range(3):
        response = requests.get(
            f"{url}mirrors/{params['uid']}/.json?auth={params['idToken']}")
        if response.status_code == 200:
            print("\033[92m[Python] Mirror found\033[0m")
            cred = response.json()
            if cred.get("uid") != "none":
                print("\033[92m[Python] User found\033[0m")
                if cred.get("uid") != credentials.get("uid"):
                    print("\033[92m[Python] Updating credentials\033[0m")
                    credentials = cred
                    saveCredentials()
                return True
            else:
                print("\033[91m[Python] No user found\033[0m")
                if loadCredentials() != cred:
                    credentials = cred
                    saveCredentials()
                return False
        elif response.status_code == 401:
            print("\033[93m[Python] Unauthorized: fetching new ID token\033[0m")
            params['idToken'] = getIdToken(params['refreshToken'])
            saveParams()
        elif response.status_code == 404:
            print("\033[93m[Python] Mirror not found\033[0m")
            return False
        else:
            print(
                f"\033[91m[Python] Request failed with status code {response.status_code}\033[0m")
            response.raise_for_status()
    print("[Python] Failed to check user after 3 attempts")
    return False


# run the smart mirror and clean up
process = subprocess.Popen("npm start", shell=True)


def signal_handler(signal, frame):
    print('\033[91m[Python] Exiting...\033[0m')
    sys.exit(0)


signal.signal(signal.SIGINT, signal_handler)

# main loop
time.sleep(3)
while True:
    try:
        if check_user():
            response = requests.get(
                f"{url}users/{credentials['uid']}/.json?auth={credentials['idToken']}")
            dataOnline = response.json()
            dataLocal = loadData()

            if dataOnline == dataLocal:
                print('\033[92m[Python] No changes\033[0m')

            else:
                if response.status_code == 200:
                    print('\033[91m[Python] Updating...\033[0m')
                    data = response.json()
                    saveData(data)
                else:
                    print(
                        f'\033[93m[Python] Request failed with status code {response.status_code}\033[0m')
                    print('\033[93m[Python] Fetching new token...\033[0m')
                    credentials['idToken'] = getIdToken(
                        credentials['refreshToken'])
                    saveCredentials()
        else:
            if loadDefaultData() != loadData():
                print('\033[91m[Python] Saving Default\033[0m')
                saveData(loadDefaultData())

    except requests.exceptions.RequestException as e:
        print(f'\033[91m[Python] Error: {e}\033[0m')

    time.sleep(1)
